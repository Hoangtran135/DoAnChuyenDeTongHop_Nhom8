// Error handling middleware
const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File quá lớn. Kích thước tối đa là 5MB",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Lỗi upload file: " + err.message,
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ: " + err.message,
    });
  }

  // Database errors
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "Dữ liệu đã tồn tại",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Lỗi server",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

