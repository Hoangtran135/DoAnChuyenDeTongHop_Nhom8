// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");
const { upload } = require("../config/multer");

// ========== POST - Tạo feedback ==========
router.post("/feedbacks", upload.single("image"), (req, res) => {
  const { orderId, userId, star, feedback: feedbackText } = req.body;
  const file = req.file;

  if (!orderId || !userId || !star) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  const imageFilename = file ? file.filename : null;

  const queryProducts = "SELECT product_id FROM order_details WHERE order_id = ?";

  db.query(queryProducts, [orderId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy sản phẩm trong đơn hàng:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong đơn hàng" });
    }

    const now = new Date();
    const feedbacksToInsert = results.map((row) => [
      userId,
      row.product_id,
      imageFilename,
      star,
      feedbackText || "",
      now,
    ]);

    const insertQuery = `
      INSERT INTO feedback (userid, productid, images, star, feedback, created_at)
      VALUES ?
    `;

    db.query(insertQuery, [feedbacksToInsert], (insertErr) => {
      if (insertErr) {
        console.error("Lỗi khi lưu phản hồi:", insertErr);
        return res.status(500).json({ message: "Lỗi khi lưu phản hồi" });
      }
      res.status(201).json({
        message: "Phản hồi đã được ghi nhận cho tất cả sản phẩm trong đơn hàng",
      });
    });
  });
});

// ========== GET - Lấy feedback theo sản phẩm ==========
router.get("/feedbacks/product/:productId", (req, res) => {
  const productId = req.params.productId;

  db.query(
    "SELECT f.feedback, f.star,f.images, u.name FROM feedback f JOIN users u ON f.userid = u.id WHERE f.productid = ?",
    [productId],
    (error, results) => {
      if (error) {
        console.error("Lỗi lấy feedback:", error);
        return res.status(500).json({ error: "Lỗi server" });
      }
      res.json(results);
    }
  );
});

// ========== EXPORT ==========
module.exports = router;
