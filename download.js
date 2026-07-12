const axios = require('axios');

module.exports = async (req, res) => {
  // ===== CORS Headers =====
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ===== Handle OPTIONS (preflight) =====
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ===== Hanya terima POST =====
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed. Gunakan POST.' 
    });
  }

  // ===== Ambil URL dari body =====
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ 
      success: false,
      error: 'URL TikTok diperlukan' 
    });
  }

  // ===== Validasi URL TikTok =====
  const tiktokRegex = /(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)/;
  if (!tiktokRegex.test(url)) {
    return res.status(400).json({ 
      success: false,
      error: 'URL tidak valid. Masukkan link TikTok.' 
    });
  }

  console.log('📥 Mendownload:', url);

  try {
    // ============================================
    // 🔥 API 1: TikMate (Paling Stabil)
    // ============================================
    const response = await axios.get('https://api.tikmate.app/api/lookup', {
      params: { url: url },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://tikmate.app/'
      },
      timeout: 30000
    });

    console.log('✅ Response TikMate:', response.data);

    // ===== Cek response TikMate =====
    if (response.data && response.data.url) {
      return res.status(200).json({
        success: true,
        data: {
          video: response.data.url,
          audio: response.data.audio || null,
          title: response.data.title || 'Video TikTok',
          author: response.data.author || 'Unknown',
          username: response.data.author || 'Unknown',
          thumbnail: response.data.thumbnail || '',
          duration: response.data.duration || '00:00',
          cover: response.data.thumbnail || ''
        }
      });
    }

    // ============================================
    // 🔥 API 2: TikWM (Fallback)
    // ============================================
    console.log('🔄 Mencoba TikWM API...');
    
    const fallbackResponse = await axios.get('https://www.tikwm.com/api/', {
      params: { url: url },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Response TikWM:', fallbackResponse.data);

    if (fallbackResponse.data && fallbackResponse.data.data) {
      const data = fallbackResponse.data.data;
      
      return res.status(200).json({
        success: true,
        data: {
          video: data.play || data.wmplay || data.hdplay,
          audio: data.music || null,
          title: data.title || 'Video TikTok',
          author: data.author?.unique_id || 'Unknown',
          username: data.author?.unique_id || 'Unknown',
          thumbnail: data.cover || '',
          duration: data.duration || '00:00',
          cover: data.cover || ''
        }
      });
    }

    // ============================================
    // 🔥 API 3: TikTokAPI (Last Resort)
    // ============================================
    console.log('🔄 Mencoba TikTokAPI...');
    
    const lastResponse = await axios.get('https://api.tiktokapi.cc/api/tiktok', {
      params: { url: url },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    console.log('✅ Response TikTokAPI:', lastResponse.data);

    if (lastResponse.data && lastResponse.data.url) {
      return res.status(200).json({
        success: true,
        data: {
          video: lastResponse.data.url,
          audio: lastResponse.data.audio || null,
          title: lastResponse.data.title || 'Video TikTok',
          author: lastResponse.data.author || 'Unknown',
          username: lastResponse.data.author || 'Unknown',
          thumbnail: lastResponse.data.thumbnail || '',
          duration: lastResponse.data.duration || '00:00',
          cover: lastResponse.data.thumbnail || ''
        }
      });
    }

    // ===== Jika semua API gagal =====
    return res.status(404).json({
      success: false,
      error: 'Video tidak ditemukan. Coba URL lain.'
    });

  } catch (error) {
    // ============================================
    // 🔥 ERROR HANDLING
    // ============================================
    console.error('❌ Error:', error.message);
    
    // Cek jenis error
    let errorMessage = 'Gagal mendownload video. Silakan coba lagi nanti.';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Server terlalu lambat.';
    } else if (error.response) {
      // Server merespon dengan error
      if (error.response.status === 404) {
        errorMessage = 'Video tidak ditemukan.';
      } else if (error.response.status === 403) {
        errorMessage = 'Akses ditolak. Coba gunakan VPN.';
      } else if (error.response.status === 429) {
        errorMessage = 'Terlalu banyak request. Tunggu beberapa menit.';
      } else {
        errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      errorMessage = 'Tidak ada response dari server. Cek koneksi internet.';
    }

    // ============================================
    // 🔧 KIRIM ERROR SEBAGAI JSON (BUKAN HTML!)
    // ============================================
    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
