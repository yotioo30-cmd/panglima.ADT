const axios = require('axios');
const cors = require('cors');

// CORS middleware
const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Run middleware helper
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

module.exports = async (req, res) => {
  // Enable CORS
  await runMiddleware(req, res, corsMiddleware);

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { url } = req.body;

    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    // Validate TikTok URL
    const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\/.+/;
    if (!tiktokRegex.test(url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid TikTok URL'
      });
    }

    console.log('📥 Processing URL:', url);

    // ============================================
    // 🔥 FALLBACK API SYSTEM (2026)
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

      if (response.data && response.data.data) {
        const data = response.data.data;
        console.log('✅ TikWM success');
        return res.status(200).json({
          success: true,
          data: {
            videoUrl: data.play || data.wmplay || data.hdplay,
            audioUrl: data.music || null,
            thumbnail: data.cover || '',
            title: data.title || 'Video TikTok',
            username: data.author?.unique_id || 'Unknown',
            duration: data.duration || '00:00',
            videoId: data.id || null
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
        console.log('✅ SnapTik success');
        return res.status(200).json({
          success: true,
          data: {
            videoUrl: videoMatch[1],
            audioUrl: null,
            thumbnail: '',
            title: 'Video TikTok',
            username: 'Unknown',
            duration: '00:00',
            videoId: null
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
        console.log('✅ SSSTikTok success');
        return res.status(200).json({
          success: true,
          data: {
            videoUrl: videoMatch[1],
            audioUrl: null,
            thumbnail: '',
            title: 'Video TikTok',
            username: 'Unknown',
            duration: '00:00',
            videoId: null
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

      if (musicResponse.data && musicResponse.data.video) {
        console.log('✅ MusicallyDown success');
        return res.status(200).json({
          success: true,
          data: {
            videoUrl: musicResponse.data.video,
            audioUrl: musicResponse.data.audio || null,
            thumbnail: musicResponse.data.thumbnail || '',
            title: musicResponse.data.title || 'Video TikTok',
            username: musicResponse.data.author || 'Unknown',
            duration: musicResponse.data.duration || '00:00',
            videoId: null
          }
        });
      }
    } catch (error) {
      console.log('❌ MusicallyDown error:', error.message);
    }

    // API 5: TikTok API Key (Jika tersedia)
    const API_KEY = process.env.API_KEY;
    if (API_KEY) {
      try {
        console.log('🔄 Mencoba TikMate API...');
        const apiUrl = 'https://api.tikmate.cc/api/v1/download';
        
        const response = await axios.post(apiUrl, {
          url: url,
          api_key: API_KEY
        }, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 30000
        });

        if (response.data && response.data.success) {
          console.log('✅ TikMate API success');
          return res.status(200).json({
            success: true,
            data: {
              videoUrl: response.data.video_url || response.data.videoUrl,
              audioUrl: response.data.audio_url || response.data.audioUrl,
              thumbnail: response.data.thumbnail || response.data.cover,
              title: response.data.title || response.data.desc,
              username: response.data.username || response.data.author,
              duration: response.data.duration || '00:00',
              videoId: response.data.video_id || response.data.id
            }
          });
        }
      } catch (error) {
        console.log('❌ TikMate API error:', error.message);
      }
    }

    // ============================================
    // ❌ SEMUA API GAGAL
    // ============================================
    console.log('❌ Semua API gagal untuk URL:', url);
    
    return res.status(404).json({
      success: false,
      error: 'Video tidak ditemukan. Pastikan URL benar dan video publik.'
    });

  } catch (error) {
    console.error('Download error:', error.message);
    
    // Handle different error types
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        error: error.response.data?.message || 'API request failed'
      });
    } else if (error.request) {
      return res.status(504).json({
        success: false,
        error: 'Request timeout. Please try again.'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Internal server error: ' + error.message
      });
    }
  }
};
