const axios = require('axios');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Gunakan POST.' 
    });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ 
      success: false, 
      error: 'URL TikTok diperlukan' 
    });
  }

  // Validasi URL TikTok
  const tiktokRegex = /(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)/;
  if (!tiktokRegex.test(url)) {
    return res.status(400).json({ 
      success: false, 
      error: 'URL tidak valid. Masukkan link TikTok.' 
    });
  }

  console.log('📥 Processing URL:', url);

  // ============================================
  // 🔥 LIST API YANG MASIH AKTIF (2026)
  // ============================================
  
  // API 1: TikWM (Paling Stabil)
  try {
    console.log('🔄 Mencoba TikWM...');
    const response = await axios.get('https://www.tikwm.com/api/', {
      params: { url: url },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ TikWM response:', response.data);

    if (response.data && response.data.data) {
      const data = response.data.data;
      return res.status(200).json({
        success: true,
        data: {
          video: data.play || data.wmplay || data.hdplay,
          audio: data.music || null,
          title: data.title || 'Video TikTok',
          author: data.author?.unique_id || 'Unknown',
          username: data.author?.unique_id || 'Unknown',
          thumbnail: data.cover || '',
          duration: data.duration || '00:00'
        }
      });
    }
  } catch (error) {
    console.log('❌ TikWM error:', error.message);
  }

  // API 2: SnapTik
  try {
    console.log('🔄 Mencoba SnapTik...');
    const snapResponse = await axios.post(
      'https://snaptik.app/action.php',
      new URLSearchParams({ url: url }),
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://snaptik.app',
          'Referer': 'https://snaptik.app/'
        },
        timeout: 15000
      }
    );

    const html = snapResponse.data;
    const videoMatch = html.match(/href="([^"]*\.mp4[^"]*)"/);
    
    if (videoMatch) {
      return res.status(200).json({
        success: true,
        data: {
          video: videoMatch[1],
          audio: null,
          title: 'Video TikTok',
          author: 'Unknown',
          username: 'Unknown',
          thumbnail: '',
          duration: '00:00'
        }
      });
    }
  } catch (error) {
    console.log('❌ SnapTik error:', error.message);
  }

  // API 3: SSSTikTok
  try {
    console.log('🔄 Mencoba SSSTikTok...');
    const sssResponse = await axios.post(
      'https://ssstik.io/abc',
      new URLSearchParams({ url: url, format: 'mp4' }),
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://ssstik.io',
          'Referer': 'https://ssstik.io/'
        },
        timeout: 15000
      }
    );

    const html = sssResponse.data;
    const videoMatch = html.match(/href="([^"]*\.mp4[^"]*)"/);
    
    if (videoMatch) {
      return res.status(200).json({
        success: true,
        data: {
          video: videoMatch[1],
          audio: null,
          title: 'Video TikTok',
          author: 'Unknown',
          username: 'Unknown',
          thumbnail: '',
          duration: '00:00'
        }
      });
    }
  } catch (error) {
    console.log('❌ SSSTikTok error:', error.message);
  }

  // API 4: MusicallyDown
  try {
    console.log('🔄 Mencoba MusicallyDown...');
    const musicResponse = await axios.get('https://musicallydown.com/get', {
      params: { 
        url: url,
        ajax: '1'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ MusicallyDown response:', musicResponse.data);

    if (musicResponse.data && musicResponse.data.video) {
      return res.status(200).json({
        success: true,
        data: {
          video: musicResponse.data.video,
          audio: musicResponse.data.audio || null,
          title: musicResponse.data.title || 'Video TikTok',
          author: musicResponse.data.author || 'Unknown',
          username: musicResponse.data.author || 'Unknown',
          thumbnail: musicResponse.data.thumbnail || '',
          duration: musicResponse.data.duration || '00:00'
        }
      });
    }
  } catch (error) {
    console.log('❌ MusicallyDown error:', error.message);
  }

  // ============================================
  // ❌ SEMUA API GAGAL
  // ============================================
  console.log('❌ Semua API gagal untuk URL:', url);
  
  return res.status(404).json({
    success: false,
    error: 'Video tidak ditemukan. Pastikan URL benar dan video publik.'
  });
};
