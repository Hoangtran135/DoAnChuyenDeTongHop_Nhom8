// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");

// ========== POST - Lưu tìm kiếm ==========
router.post("/saveSearch", (req, res) => {
  const { userId, searchContent } = req.body;

  if (!userId || !searchContent) {
    return res.status(400).json({ message: "Thiếu userId hoặc searchContent" });
  }

  const query = "INSERT INTO search (userId, searchContent) VALUES (?, ?)";
  db.query(query, [userId, searchContent], (err, results) => {
    if (err) {
      console.error("Lỗi khi lưu tìm kiếm:", err);
      return res.status(500).json({ message: "Lỗi server khi lưu tìm kiếm" });
    }
    res.json({
      message: "Lưu tìm kiếm thành công",
      insertId: results.insertId,
    });
  });
});

// ========== GET - Lấy top searches ==========
router.get("/topSearches", (req, res) => {
  const userId = req.query.userId;
  const limit = parseInt(req.query.limit) || 5;

  if (!userId) {
    return res.json([]);
  }

  const sql = `SELECT searchContent FROM search WHERE userId = ? ORDER BY id DESC LIMIT ?`;

  db.query(sql, [userId, limit], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    const keywords = results.map((row) => row.searchContent);
    res.json(keywords);
  });
});

// ========== EXPORT ==========
module.exports = router;
