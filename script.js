/* Reset & Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #6C3CE1;
    --primary-dark: #5A2DB8;
    --primary-light: #8B6BF5;
    --secondary: #FF6B6B;
    --gradient: linear-gradient(135deg, #6C3CE1 0%, #E9408B 50%, #FF6B6B 100%);
    --bg-dark: #0A0A0F;
    --bg-card: #1A1A2E;
    --bg-input: #16213E;
    --text-primary: #FFFFFF;
    --text-secondary: #A0AEC0;
    --shadow: 0 20px 60px rgba(108, 60, 225, 0.3);
    --radius: 16px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: var(--bg-dark);
    color: var(--text-primary);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-image: 
        radial-gradient(circle at 20% 50%, rgba(108, 60, 225, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(233, 64, 139, 0.1) 0%, transparent 50%);
}

/* Loading Screen */
#loading-screen {
    position: fixed;
    inset: 0;
    background: var(--bg-dark);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: opacity 0.5s ease;
}

#loading-screen.hidden {
    opacity: 0;
    pointer-events: none;
}

.loader {
    text-align: center;
    position: relative;
    width: 100px;
    height: 100px;
}

.loader svg {
    width: 100%;
    height: 100%;
    animation: rotate 2s linear infinite;
}

.loader circle {
    fill: none;
    stroke: url(#gradient);
    stroke-width: 6;
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    animation: dash 1.5s ease-in-out infinite;
}

.loader-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: 700;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 2px;
}

@keyframes rotate {
    100% { transform: rotate(360deg); }
}

@keyframes dash {
    0% { stroke-dashoffset: 283; }
    50% { stroke-dashoffset: 70; }
    100% { stroke-dashoffset: 283; }
}

/* Container */
.container {
    max-width: 800px;
    width: 100%;
    background: var(--bg-card);
    border-radius: var(--radius);
    padding: 40px;
    box-shadow: var(--shadow);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Header */
header {
    text-align: center;
    margin-bottom: 35px;
}

.logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 8px;
}

.logo {
    width: 48px;
    height: 48px;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

h1 {
    font-size: 32px;
    font-weight: 800;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
}

.subtitle {
    color: var(--text-secondary);
    font-size: 14px;
    letter-spacing: 0.5px;
}

/* Input Section */
.input-section {
    margin-bottom: 30px;
}

.input-wrapper {
    display: flex;
    gap: 12px;
    background: var(--bg-input);
    border-radius: 12px;
    padding: 6px;
    border: 2px solid transparent;
    transition: var(--transition);
}

.input-wrapper:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(108, 60, 225, 0.15);
}

#urlInput {
    flex: 1;
    background: transparent;
    border: none;
    padding: 14px 18px;
    color: var(--text-primary);
    font-size: 15px;
    outline: none;
}

#urlInput::placeholder {
    color: var(--text-secondary);
}

.btn-primary {
    background: var(--gradient);
    border: none;
    padding: 12px 28px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: var(--transition);
    white-space: nowrap;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108, 60, 225, 0.4);
}

.btn-primary:active {
    transform: translateY(0);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.input-hint {
    margin-top: 10px;
    font-size: 12px;
    color: var(--text-secondary);
    text-align: center;
}

/* Error Message */
.error-message {
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    border-radius: 10px;
    padding: 14px 18px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: shake 0.5s ease;
}

.error-message.hidden {
    display: none;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.error-icon {
    font-size: 20px;
}

.error-text {
    flex: 1;
    font-size: 14px;
    color: #FF6B6B;
}

/* Loading Indicator */
.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 20px;
    margin-bottom: 20px;
    background: rgba(108, 60, 225, 0.05);
    border-radius: 10px;
    border: 1px solid rgba(108, 60, 225, 0.1);
}

.loading-indicator.hidden {
    display: none;
}

.spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(108, 60, 225, 0.2);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Result Section */
.result-section {
    animation: fadeInUp 0.5s ease;
}

.result-section.hidden {
    display: none;
}

/* Video Container */
.video-container {
    margin-bottom: 25px;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    position: relative;
}

.video-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    background: #000;
}

#videoPlayer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
}

/* Custom Video Controls */
.video-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    padding: 20px 16px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.video-wrapper:hover .video-controls,
.video-wrapper:focus-within .video-controls {
    opacity: 1;
}

.play-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    flex-shrink: 0;
}

.play-btn:hover {
    transform: scale(1.1);
}

.play-btn svg {
    width: 28px;
    height: 28px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(255,255,255,0.3);
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    transition: height 0.2s ease;
}

.progress-bar:hover {
    height: 6px;
}

.progress-fill {
    height: 100%;
    background: var(--gradient);
    border-radius: 2px;
    width: 0%;
    transition: width 0.1s linear;
}

.time-display {
    color: white;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.fullscreen-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    flex-shrink: 0;
}

.fullscreen-btn:hover {
    transform: scale(1.1);
}

/* Video Info */
.video-info {
    background: var(--bg-input);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
}

.info-header {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
}

.thumbnail {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
    background: var(--bg-dark);
}

.info-details {
    flex: 1;
    min-width: 0;
}

.video-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
}

.video-author {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 8px;
}

.video-meta {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: var(--text-secondary);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn-download,
.btn-audio {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: var(--transition);
    min-width: 140px;
}

.btn-download {
    background: var(--gradient);
    color: white;
}

.btn-download:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108, 60, 225, 0.4);
}

.btn-audio {
    background: rgba(255, 107, 107, 0.15);
    color: #FF6B6B;
    border: 1px solid rgba(255, 107, 107, 0.3);
}

.btn-audio:hover {
    background: rgba(255, 107, 107, 0.25);
    transform: translateY(-2px);
}

/* Share Section */
.share-section {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    flex-wrap: wrap;
}

.share-label {
    color: var(--text-secondary);
    font-size: 13px;
}

.share-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.share-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    color: white;
}

.share-btn:hover {
    transform: translateY(-2px) scale(1.05);
}

.share-btn.whatsapp {
    background: #25D366;
}

.share-btn.twitter {
    background: #1DA1F2;
}

.share-btn.facebook {
    background: #1877F2;
}

.share-btn.copy {
    background: var(--bg-input);
    color: var(--text-secondary);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.share-btn.copy:hover {
    background: var(--primary);
    color: white;
}

/* Footer */
footer {
    margin-top: 35px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    text-align: center;
}

footer p {
    font-size: 13px;
    color: var(--text-secondary);
}

.footer-links {
    margin-top: 8px;
    display: flex;
    justify-content: center;
    gap: 20px;
}

.footer-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 12px;
    transition: var(--transition);
}

.footer-links a:hover {
    color: var(--primary-light);
}

/* Responsive */
@media (max-width: 640px) {
    .container {
        padding: 20px;
        border-radius: 12px;
    }

    h1 {
        font-size: 24px;
    }

    .logo {
        width: 36px;
        height: 36px;
    }

    .input-wrapper {
        flex-direction: column;
        background: transparent;
        padding: 0;
        gap: 10px;
    }

    #urlInput {
        background: var(--bg-input);
        border-radius: 10px;
        padding: 14px 16px;
    }

    .btn-primary {
        justify-content: center;
        padding: 14px;
    }

    .info-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .thumbnail {
        width: 100%;
        height: 180px;
    }

    .action-buttons {
        flex-direction: column;
    }

    .btn-download,
    .btn-audio {
        min-width: auto;
    }

    .video-controls {
        padding: 12px 10px 8px;
        gap: 8px;
    }

    .play-btn svg {
        width: 22px;
        height: 22px;
    }

    .time-display {
        font-size: 10px;
    }

    .share-section {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .share-buttons {
        justify-content: center;
    }
}
