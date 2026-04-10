/**
 * Voice Assistant Proxy Route
 * Proxies HTTP requests to the Flask AI server at port 5002.
 * WebSocket connections are handled at the server.js level via http-proxy-middleware.
 */

const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');

const FLASK_BASE = process.env.FLASK_SERVER_URL || 'http://localhost:5002';

// HTTP proxy for REST endpoints (/api/voice/chat, /api/voice/tts, /api/voice/greeting, /api/voice/health)
const voiceHttpProxy = createProxyMiddleware({
  target: FLASK_BASE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/voice': '/api/voice',  // Keep path same — Flask handles /api/voice/*
  },
  on: {
    error: (err, req, res) => {
      console.error('[Voice Proxy] HTTP error:', err.message);
      if (res && !res.headersSent) {
        res.status(502).json({
          success: false,
          error: {
            code: 'VOICE_PROXY_ERROR',
            message: 'Voice assistant service unavailable. Please ensure the Flask server is running.'
          }
        });
      }
    }
  }
});

router.use('/', voiceHttpProxy);

module.exports = router;
module.exports.FLASK_BASE = FLASK_BASE;
