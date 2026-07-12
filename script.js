// ===== DOM Elements =====
const videoUrlInput = document.getElementById('videoUrl');
const analyzeBtn = document.getElementById('analyzeBtn');
const pasteBtn = document.getElementById('pasteBtn');
const resultSection = document.getElementById('resultSection');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const thumbnail = document.getElementById('thumbnail');
const videoTitle = document.getElementById('videoTitle');
const username = document.getElementById('username');
const duration = document.getElementById('duration');
const downloadVideoBtn = document.getElementById('downloadVideoBtn');
const downloadAudioBtn = document.getElementById('downloadAudioBtn');
const videoLinkInput = document.getElementById('videoLinkInput');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const historyList = document.getElementById('historyList');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const themeToggle = document.getElementById('themeToggle');
const particlesContainer = document.getElementById('particles');

// ===== State =====
let currentData = null;
let history = JSON.parse(localStorage.getItem('downloadHistory')) || [];
let isAnalyzing = false;
let progressInterval = null;

// ===== Particles =====
function createParticles() {
  const count = 50;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (15 + Math.random() * 20) + 's';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = Math.random() > 0.5 ? 'var(--gold)' : 'var(--neon-blue)';
    particlesContainer.appendChild(particle);
  }
}
createParticles();

// ===== Typing Animation =====
function typingEffect() {
  const text = 'PANGLIMA Downloader';
  const element = document.querySelector('.typing-text');
  if (!element) return;
  
  let index = 0;
  element.textContent = '';
  
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, 80 + Math.random() * 50);
    }
  }
  
  type();
}
typingEffect();

// ===== Theme Toggle =====
let isDark = true;
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.querySelector('.sun').style.display = isDark ? 'none' : 'inline';
  themeToggle.querySelector('.moon').style.display = isDark ? 'inline' : 'none';
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  isDark = false;
  document.body.classList.add('light');
  themeToggle.querySelector('.sun').style.display = 'inline';
  themeToggle.querySelector('.moon').style.display = 'none';
}

// ===== Toast =====
function showToast(message, type = 'success') {
  toastMessage.textContent = message;
  toast.className = 'toast ' + type;
  toast.classList.add('show');
  
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== Progress =====
function updateProgress(value) {
  const percent = Math.min(Math.max(value, 0), 100);
  progressFill.style.width = percent + '%';
  progressText.textContent = Math.round(percent) + '%';
}

function startProgress() {
  progressContainer.style.display = 'flex';
  updateProgress(0);
  let progress = 0;
  
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 90) {
      clearInterval(progressInterval);
      progress = 90;
    }
    updateProgress(progress);
  }, 200);
}

function completeProgress() {
  clearInterval(progressInterval);
  updateProgress(100);
  setTimeout(() => {
    progressContainer.style.display = 'none';
  }, 500);
}

// ===== Ripple Effect =====
document.querySelectorAll('.btn-ripple').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = ripple.style.height = '100px';
    ripple.style.marginLeft = '-50px';
    ripple.style.marginTop = '-50px';
    
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ===== Paste from Clipboard =====
pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    videoUrlInput.value = text;
    videoUrlInput.focus();
    showToast('Link telah ditempel!', 'success');
  } catch (err) {
    showToast('Gagal membaca clipboard', 'error');
  }
});

// ============================================
// 🔧 FIX: HANDLE ANALYZE DENGAN VALIDASI JSON
// ============================================
analyzeBtn.addEventListener('click', handleAnalyze);
videoUrlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleAnalyze();
});

async function handleAnalyze() {
  if (isAnalyzing) return;
  
  const url = videoUrlInput.value.trim();
  if (!url) {
    showToast('Masukkan link TikTok terlebih dahulu!', 'warning');
    return;
  }
  
  // Validate TikTok URL
  const tiktokRegex = /(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)/;
  if (!tiktokRegex.test(url)) {
    showToast('Link tidak valid! Masukkan link TikTok.', 'error');
    return;
  }
  
  isAnalyzing = true;
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = '<span class="btn-text">⏳ Memproses...</span>';
  
  try {
    startProgress();
    
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });
    
    // ============================================
    // 🔧 FIX: Cek response sebelum parse JSON
    // ============================================
    const contentType = response.headers.get('content-type');
    
    // Jika response bukan JSON (kemungkinan HTML error)
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Response bukan JSON:', text.substring(0, 200));
      
      // Cek apakah HTML error dari TikTok
      if (text.includes('The page') || text.includes('<!DOCTYPE') || text.includes('HTML')) {
        throw new Error('Server tidak dapat mengakses video. Coba URL lain atau coba lagi nanti.');
      }
      
      throw new Error('Error server: ' + text.substring(0, 100));
    }
    
    // ============================================
    // 🔧 FIX: Parse JSON dengan aman
    // ============================================
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const text = await response.text();
      console.error('Gagal parse JSON:', text.substring(0, 200));
      throw new Error('Response tidak valid dari server');
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Gagal menganalisis video');
    }
    
    if (data.success && data.data) {
      currentData = data.data;
      displayResult(data.data);
      addToHistory(data.data, url);
      showToast('Video berhasil dianalisis! ✅', 'success');
    } else {
      throw new Error(data.error || 'Gagal mendapatkan data video');
    }
    
  } catch (error) {
    // ============================================
    // 🔧 FIX: Tampilkan error yang lebih jelas
    // ============================================
    let errorMessage = error.message;
    
    // Cek berbagai jenis error
    if (errorMessage.includes('Unexpected token')) {
      errorMessage = 'Server error: Response tidak valid. Coba lagi nanti.';
    } else if (errorMessage.includes('Failed to fetch')) {
      errorMessage = 'Koneksi gagal. Periksa internet Anda.';
    } else if (errorMessage.includes('NetworkError')) {
      errorMessage = 'Error network. Coba lagi.';
    }
    
    showToast('❌ ' + errorMessage, 'error');
    console.error('Analyze error:', error);
    
  } finally {
    completeProgress();
    isAnalyzing = false;
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = '<span class="btn-text">🔍 Analyze</span>';
  }
}

// ===== Display Result =====
function displayResult(data) {
  resultSection.style.display = 'block';
  thumbnail.src = data.thumbnail || data.cover || '/placeholder.jpg';
  videoTitle.textContent = data.title || 'Video TikTok';
  username.textContent = '@' + (data.author || data.username || 'username');
  duration.textContent = '⏱️ ' + (data.duration || '00:00');
  videoLinkInput.value = data.video || data.videoUrl || data.play || '';
  
  // Set download buttons
  if (data.video || data.videoUrl || data.play) {
    downloadVideoBtn.onclick = () => {
      window.open(data.video || data.videoUrl || data.play, '_blank');
      showToast('Mengunduh video... 📥', 'success');
    };
  }
  
  if (data.audio || data.music) {
    downloadAudioBtn.style.display = 'inline-block';
    downloadAudioBtn.onclick = () => {
      window.open(data.audio || data.music, '_blank');
      showToast('Mengunduh audio... 🎵', 'success');
    };
  } else {
    downloadAudioBtn.style.display = 'none';
  }
  
  // Scroll to result
  setTimeout(() => {
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 200);
}

// ===== Copy Link =====
copyLinkBtn.addEventListener('click', async () => {
  const text = videoLinkInput.value;
  if (!text) {
    showToast('Tidak ada link untuk disalin', 'warning');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    showToast('Link berhasil disalin! 📋', 'success');
  } catch (err) {
    // Fallback
    videoLinkInput.select();
    document.execCommand('copy');
    showToast('Link berhasil disalin! 📋', 'success');
  }
});

// ===== History =====
function addToHistory(data, url) {
  const entry = {
    id: Date.now(),
    title: data.title || 'Video TikTok',
    username: data.author || data.username || 'user',
    thumbnail: data.thumbnail || data.cover || '',
    url: url,
    type: 'video',
    date: new Date().toISOString()
  };
  
  // Remove duplicates
  history = history.filter(item => item.url !== url);
  history.unshift(entry);
  
  // Keep only last 20
  if (history.length > 20) {
    history = history.slice(0, 20);
  }
  
  localStorage.setItem('downloadHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<p class="empty-history">Belum ada riwayat download</p>';
    return;
  }
  
  historyList.innerHTML = history.map(item => `
    <div class="history-item" data-url="${item.url}">
      <img src="${item.thumbnail || '/placeholder.jpg'}" alt="Thumbnail" loading="lazy">
      <div class="info">
        <div class="title">${item.title}</div>
        <div class="date">${new Date(item.date).toLocaleDateString('id-ID')}</div>
      </div>
      <span class="type video">Video</span>
    </div>
  `).join('');
  
  // Click to load history item
  document.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      const url = item.dataset.url;
      videoUrlInput.value = url;
      handleAnalyze();
    });
  });
}
renderHistory();

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
  // Ctrl+V to paste
  if (e.ctrlKey && e.key === 'v' && document.activeElement !== videoUrlInput) {
    e.preventDefault();
    pasteBtn.click();
  }
  
  // Escape to clear
  if (e.key === 'Escape') {
    videoUrlInput.value = '';
    videoUrlInput.focus();
  }
});

// ===== Auto-focus =====
videoUrlInput.focus();

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.log);
  });
}

// ===== Console Message =====
console.log('🛡️ PANGLIMA Downloader v1.0');
console.log('📱 Download TikTok No Watermark');
console.log('✅ Script sudah diperbaiki!');
