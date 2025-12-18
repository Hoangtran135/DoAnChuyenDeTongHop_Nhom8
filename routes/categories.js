const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");
const { upload, generateRandomFilename } = require("../config/multer");
const path = require("path");
const fs = require("fs");

// API: Lấy danh sách danh mục kèm số lượng sản phẩm
router.get("/categories", (req, res) => {
  const sql = `
    SELECT c.id, c.name, COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id, c.name
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn" });
    res.json(result);
  });
});

// API: Danh sách categories đang hoạt động
router.get("/listcategories", (req, res) => {
  const sql = `SELECT * FROM categories WHERE role = 1`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn danh mục" });
    res.json(result);
  });
});

// API: Thêm danh mục kèm ảnh
router.post("/categories", upload.single("image"), (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!name || !file) {
    return res.status(400).json({ message: "Tên và ảnh là bắt buộc!" });
  }

  const checkSql = "SELECT id FROM categories WHERE name = ?";
  db.query(checkSql, [name], (err, results) => {
    if (err) {
      console.error("Lỗi khi kiểm tra tên danh mục:", err);
      return res.status(500).json({ message: "Lỗi server khi kiểm tra danh mục." });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ alert: "Tên danh mục đã tồn tại, vui lòng chọn tên khác." });
    }

    const imageFilename = generateRandomFilename();
    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    const oldPath = path.join(__dirname, "..", uploadDir, file.filename);
    const newPath = path.join(__dirname, "..", uploadDir, imageFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Lỗi khi đổi tên file:", err);
        return res.status(500).json({ message: "Lỗi khi đổi tên file ảnh." });
      }

      const created_at = new Date();
      const sql =
        "INSERT INTO categories (name, images, created_at) VALUES (?, ?, ?)";

      db.query(sql, [name, imageFilename, created_at], (err) => {
        if (err) {
          console.error("Lỗi khi thêm danh mục:", err);
          return res.status(500).json({ message: "Lỗi khi thêm danh mục." });
        }
        res.status(201).json({ message: "Danh mục đã được thêm." });
      });
    });
  });
});

// API: Cập nhật danh mục kèm ảnh
router.put("/categories/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Tên là bắt buộc!" });
  }

  const updated_at = new Date();

  const proceedUpdate = (imageFilename) => {
    const sql =
      "UPDATE categories SET name = ?, images = ?, created_at = ? WHERE id = ?";
    db.query(sql, [name, imageFilename, updated_at, id], (err, results) => {
      if (err) {
        console.error("Lỗi khi cập nhật danh mục:", err.message);
        return res.status(500).json({ message: "Lỗi khi cập nhật danh mục." });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Danh mục không tồn tại." });
      }

      res.status(200).json({ message: "Danh mục đã được cập nhật." });
    });
  };

  if (req.file) {
    const imageFilename = generateRandomFilename();
    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    const oldPath = path.join(__dirname, "..", uploadDir, req.file.filename);
    const newPath = path.join(__dirname, "..", uploadDir, imageFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Lỗi khi đổi tên file:", err);
        return res.status(500).json({ message: "Lỗi khi đổi tên file ảnh." });
      }
      proceedUpdate(imageFilename);
    });
  } else {
    const sql = "SELECT images FROM categories WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy ảnh cũ:", err.message);
        return res
          .status(500)
          .json({ message: "Lỗi server khi lấy dữ liệu cũ." });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Danh mục không tồn tại." });
      }

      const imageFilename = results[0].images;
      proceedUpdate(imageFilename);
    });
  }
});

// API: Ẩn danh mục (role = 0)
router.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE categories SET role = 0 WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật role danh mục:", err.message);
      return res.status(500).json({ message: "Lỗi khi cập nhật role danh mục." });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục để cập nhật." });
    }

    res.status(200).json({ message: "Đã chuyển role danh mục thành 0 (ẩn danh mục)." });
  });
});

module.exports = router;


