// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");

// ========== GET - Lấy danh sách yêu thích ==========
router.get("/favourite/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT f.*, p.name, p.price, p.images
    FROM favorites f
    JOIN products p ON f.productid = p.id
    WHERE f.userid = ?
  `;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn favorites:", err);
      return res.status(500).json({ error: "Lỗi truy vấn" });
    }
    res.json(result);
  });
});

// ========== GET - Lấy danh sách yêu thích (alias) ==========
router.get("/favorites/user/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT f.*, p.name, p.price, p.images
    FROM favorites f
    JOIN products p ON f.productid = p.id
    WHERE f.userid = ?
  `;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn favorites:", err);
      return res.status(500).json({ error: "Lỗi truy vấn" });
    }
    res.json(result);
  });
});

// ========== POST - Thêm yêu thích ==========
router.post("/favorites", (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ error: "Thiếu userid hoặc productid" });
  }

  const sql =
    "INSERT INTO favorites (userid, productid, created_at) VALUES (?, ?, NOW())";
  db.query(sql, [user_id, product_id], (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm vào favorites:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Đã tồn tại trong yêu thích" });
      }
      return res.status(500).json({ error: "Lỗi khi thêm vào yêu thích" });
    }

    res.json({ message: "Đã thêm vào yêu thích", id: result.insertId });
  });
});

// ========== DELETE - Xóa yêu thích ==========
router.delete("/favorites", (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ error: "Thiếu userid hoặc productid" });
  }

  const sql = "DELETE FROM favorites WHERE userid = ? AND productid = ?";
  db.query(sql, [user_id, product_id], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa yêu thích:", err);
      return res.status(500).json({ error: "Lỗi khi xóa khỏi yêu thích" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy mục yêu thích" });
    }

    res.json({ message: "Đã xóa khỏi yêu thích" });
  });
});

// ========== EXPORT ==========
module.exports = router;
