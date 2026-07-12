const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL diperlukan' });
  }

  console.log('📥 Processing:', url);

  // ============================================
  // 🔥 LIST API (yang masih aktif)
  // ============================================
  const apis = [
    // API 1: TikWM
    {
      name: 'TikWM',
      url: 'https://www.tikwm.com/api/',
      params: { url },
      parser: (data) => ({
        video: data.data?.play || data.data?.wmplay || data.data?.hdplay,
        audio: data.data?.music || null,
        title: data.data?.title || 'Video TikTok',
        author: data.data?.author?.unique_id || 'Unknown',
        thumbnail: data.data?.cover || '',
        duration: data.data?.duration || '00:00'
      })
    },
    // API 2: SnapTik
    {
      name: 'SnapTik',
      url: 'https://snaptik.app/action.php',
      method: 'POST',
      data: new URLSearchParams({ url }),
      parser: (html) => {
        const match = html.match(/href="([^"]*\.mp4[^"]*)"/);
        return match ? {
          video: match[1],
          audio: null,
          title: 'Video TikTok',
          author: 'Unknown',
          thumbnail: '',
          duration: '00:00'
        } : null;
      }
    },
    // API 3: SSSTikTok
    {
      name: 'SSSTikTok',
      url: 'https://ssstik.io/abc',
      method: 'POST',
      data: new URLSearchParams({ url, format: 'mp4' }),
      parser: (html) => {
        const match = html.match(/href="([^"]*\.mp4[^"]*)"/);
        return match ? {
          video: match[1],
          audio: null,
          title: 'Video TikTok',
          author: 'Unknown',
          thumbnail: '',
          duration: '00:00'
        } : null;
      }
    }
  ];

  // ============================================
  // 🔥 LOOPING API SAMPAI DAPAT
  // ============================================
  for (const api of apis) {
    try {
      console.log(`🔄 Mencoba ${api.name}...`);
      
      let response;
      if (api.method === 'POST') {
        response = await axios.post(api.url, api.data, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 15000
        });
      } else {
        response = await axios.get(api.url, {
          params: api.params,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 15000
        });
      }

      const data = api.parser(response.data);
      
      if (data && data.video) {
        console.log(`✅ ${api.name} berhasil!`);
        return res.json({
          success: true,
          data: data
        });
      }
      
      console.log(`❌ ${api.name} gagal (tidak ada video)`);
      
    } catch (error) {
      console.log(`❌ ${api.name} error: ${error.message}`);
    }
  }

  // ============================================
  // ❌ SEMUA API GAGAL
  // ============================================
  return res.status(404).json({
    success: false,
    error: 'Video tidak ditemukan. Pastikan URL benar dan video publik.'
  });
};
