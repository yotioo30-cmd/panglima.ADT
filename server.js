'use strict';

require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.success(`PANGLIMA Downloader berjalan di http://localhost:${PORT}`);
  if (!process.env.TIKAPI_KEY) {
    logger.warn(
      'TIKAPI_KEY belum diatur! Salin .env.example menjadi .env lalu isi API Key Anda.'
    );
  }
});
