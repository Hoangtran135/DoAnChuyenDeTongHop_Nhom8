const express = require("express");
const router = express.Router();

// In-memory store để lưu trạng thái quét QR
// Trong production, nên dùng Redis hoặc database
const qrScanStatus = new Map();

// Helper function để lưu trạng thái quét QR
const saveQRScanStatus = (qrCode) => {
  const status = {
    scanned: true,
    scannedAt: new Date().toISOString(),
  };
  qrScanStatus.set(qrCode, status);
  
  // Tự động xóa sau 5 phút để tránh memory leak
  setTimeout(() => qrScanStatus.delete(qrCode), 5 * 60 * 1000);
  
  return status;
};

// API: Thiết bị khác gọi khi quét QR thành công
router.post("/qr-scan", (req, res) => {
  const { qrCode } = req.body;

  if (!qrCode) {
    return res.status(400).json({ success: false, message: "Thiếu mã QR" });
  }

  const status = saveQRScanStatus(qrCode);
  
  res.json({
    success: true,
    message: "Đã ghi nhận quét QR thành công",
    scannedAt: status.scannedAt,
  });
});

// API: Kiểm tra trạng thái quét QR
router.get("/qr-status/:qrCode", (req, res) => {
  const { qrCode } = req.params;
  const decodedQRCode = decodeURIComponent(qrCode);

  const status = qrScanStatus.get(decodedQRCode);

  if (!status) {
    return res.json({
      success: false,
      scanned: false,
      message: "Chưa có thiết bị nào quét QR code này",
    });
  }


  res.json({
    success: true,
    scanned: status.scanned,
    scannedAt: status.scannedAt,
  });
});

// API: Tạo mã QR mới (tùy chọn - để reset)
router.post("/qr-create", (req, res) => {
  const { qrCode } = req.body;

  if (!qrCode) {
    return res.status(400).json({ success: false, message: "Thiếu mã QR" });
  }

  // Khởi tạo trạng thái chưa quét
  qrScanStatus.set(qrCode, {
    scanned: false,
    createdAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: "Đã tạo mã QR",
    qrCode,
  });
});

// API: Redirect endpoint - khi quét QR code sẽ tự động gọi API này
router.get("/qr-scan-redirect/:qrCode", async (req, res) => {
  const { qrCode } = req.params;
  const decodedQRCode = decodeURIComponent(qrCode);

  if (!decodedQRCode) {
    return res.status(400).send(`
      <html>
        <head><title>Lỗi</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: red;">❌ Lỗi: Không tìm thấy mã QR</h1>
          <p>Vui lòng quét lại mã QR code.</p>
        </body>
      </html>
    `);
  }

  const status = saveQRScanStatus(decodedQRCode);

  // Trả về trang HTML thông báo thành công
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quét QR thành công</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          text-align: center;
        }
        .success-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }
        h1 {
          color: #28a745;
          margin-bottom: 15px;
        }
        p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .info {
          background: #e7f3ff;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
          border-left: 4px solid #0052A5;
        }
        .info p {
          color: #004085;
          font-size: 14px;
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon">✅</div>
        <h1>Quét QR thành công!</h1>
        <p>Bạn đã quét mã QR thanh toán VNPay thành công.</p>
        <p>Màn hình thanh toán sẽ tự động cập nhật.</p>
        <div class="info">
          <p><strong>Mã QR:</strong> ${decodedQRCode}</p>
          <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">
          Bạn có thể đóng trang này.
        </p>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;

