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

    // Get API key from environment
    const API_KEY = process.env.API_KEY;
    
    if (!API_KEY) {
      console.error('API_KEY not configured in environment variables');
      return res.status(500).json({
        success: false,
        error: 'API Key not configured'
      });
    }

    // Prepare request to TikTok API
    const apiUrl = 'https://api.tikmate.cc/api/v1/download';
    
    const response = await axios.post(apiUrl, {
      url: url,
      api_key: API_KEY
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000 // 30 seconds timeout
    });

    // Check if response contains data
    if (response.data && response.data.success) {
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
    } else {
      // If API returns error
      return res.status(400).json({
        success: false,
        error: response.data.message || 'Failed to download video'
      });
    }

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
        error: 'API request timeout. Please try again.'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Internal server error: ' + error.message
      });
    }
  }
};
