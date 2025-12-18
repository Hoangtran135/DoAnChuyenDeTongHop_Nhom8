const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: false, // Tắt CSP để tránh conflict với Expo
  crossOriginEmbedderPolicy: false,
  // Cho phép Expo web (port 8081) load ảnh từ backend (port 3000)
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

// Rate limiting cho API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 requests mỗi IP trong 15 phút
  message: {
    success: false,
    message: "Quá nhiều requests, vui lòng thử lại sau",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting cho login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Giới hạn 5 lần đăng nhập/đăng ký
  message: {
    success: false,
    message: "Quá nhiều lần thử, vui lòng thử lại sau 15 phút",
  },
  skipSuccessfulRequests: true,
});

module.exports = {
  securityHeaders,
  apiLimiter,
  authLimiter,
};

