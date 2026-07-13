// DOM Elements
const urlInput = document.getElementById('urlInput');
const downloadBtn = document.getElementById('downloadBtn');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.querySelector('.error-text');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultSection = document.getElementById('resultSection');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const timeDisplay = document.querySelector('.time-display');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const thumbnail = document.getElementById('thumbnail');
const videoTitle = document.getElementById('videoTitle');
const videoAuthor = document.getElementById('videoAuthor');
const videoDuration = document.getElementById('videoDuration');
const downloadVideoBtn = document.getElementById('downloadVideoBtn');
const downloadAudioBtn = document.getElementById('downloadAudioBtn');

// State
let currentVideoData = null;
let isPlaying = false;
let isFullscreen = false;

// Event Listeners
downloadBtn.addEventListener('click', handleDownload);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleDownload();
});

// Video Controls
playPauseBtn.addEventListener('click', togglePlayPause);
videoPlayer.addEventListener('timeupdate', updateProgress);
videoPlayer.addEventListener('loadedmetadata', updateDuration);
progressBar.addEventListener('click', seekVideo);
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target === urlInput) return;
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
    }
    if (e.code === 'KeyF') {
        toggleFullscreen();
    }
});

// Download buttons
downloadVideoBtn.addEventListener('click', () => downloadMedia('video'));
downloadAudioBtn.addEventListener('click', () => downloadMedia('audio'));

// Share functions
window.shareLink = function(platform) {
    const url = window.location.href;
    const text = `Check out this TikTok video! 🎵`;
    let shareUrl = '';
    
    switch(platform) {
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
};

window.copyLink = function() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        const copyBtn = document.querySelector('.share-btn.copy');
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅';
        setTimeout(() => {
            copyBtn.innerHTML = originalHtml;
        }, 2000);
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
};

// Main Functions
async function handleDownload() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Masukkan link TikTok terlebih dahulu!');
        return;
    }

    // Validate URL
    const tiktokRegex = /(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)/;
    if (!tiktokRegex.test(url)) {
        showError('URL tidak valid. Masukkan link TikTok yang benar!');
        return;
    }

    // Reset UI
    hideError();
    resultSection.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '⏳ Memproses...';

    try {
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (data.success) {
            currentVideoData = data.data;
            displayResult(data.data);
        } else {
            showError(data.error || 'Gagal mendownload video. Coba lagi.');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Terjadi kesalahan jaringan. Periksa koneksi internet Anda.');
    } finally {
        loadingIndicator.classList.add('hidden');
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
        `;
    }
}

function displayResult(data) {
    // Set video
    videoSource.src = data.videoUrl;
    videoPlayer.load();
    
    // Set thumbnail
    thumbnail.src = data.thumbnail || data.videoUrl || '';
    thumbnail.alt = data.title || 'Video thumbnail';
    
    // Set info
    videoTitle.textContent = data.title || 'Video TikTok';
    videoAuthor.textContent = data.username ? `@${data.username}` : 'Unknown';
    videoDuration.textContent = `⏱️ ${data.duration || '00:00'}`;
    
    // Show result
    resultSection.classList.remove('hidden');
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Reset video controls
    updatePlayButton();
    progressFill.style.width = '0%';
    timeDisplay.textContent = '0:00 / 0:00';
}

// Video Control Functions
function togglePlayPause() {
    if (videoPlayer.paused) {
        videoPlayer.play();
    } else {
        videoPlayer.pause();
    }
    updatePlayButton();
}

function updatePlayButton() {
    const isPaused = videoPlayer.paused;
    playPauseBtn.innerHTML = isPaused ? 
        `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z" fill="white"/></svg>` :
        `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="white"/></svg>`;
    isPlaying = !isPaused;
}

function updateProgress() {
    if (videoPlayer.duration) {
        const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progressFill.style.width = `${percent}%`;
        timeDisplay.textContent = `${formatTime(videoPlayer.currentTime)} / ${formatTime(videoPlayer.duration)}`;
    }
}

function updateDuration() {
    timeDisplay.textContent = `0:00 / ${formatTime(videoPlayer.duration)}`;
}

function seekVideo(e) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoPlayer.currentTime = pos * videoPlayer.duration;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        isFullscreen = true;
    } else {
        document.exitFullscreen();
        isFullscreen = false;
    }
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Download Media
function downloadMedia(type) {
    if (!currentVideoData) return;
    
    const url = type === 'video' ? currentVideoData.videoUrl : currentVideoData.audioUrl;
    if (!url) {
        showError(`${type === 'video' ? 'Video' : 'Audio'} tidak tersedia untuk di-download.`);
        return;
    }
    
    const filename = `${currentVideoData.title || 'video'}_${type}_${Date.now()}.${type === 'video' ? 'mp4' : 'mp3'}`;
    
    // Create anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// UI Helper Functions
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Auto-focus input on load
urlInput.focus();

// Loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1000);
});
