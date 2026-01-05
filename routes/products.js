// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");
const { upload } = require("../config/multer");

// ========== POST - Thêm sản phẩm ==========
router.post("/products", upload.single("image"), (req, res) => {
  const { name, description, price, category_id } = req.body;
  const file = req.file;

  if (!name || !price || !category_id || !file) {
    return res
      .status(400)
      .json({ message: "Tên, giá, danh mục và ảnh là bắt buộc!" });
  }

  const imageFilename = file.filename;
  const created_at = new Date();
  const updated_at = new Date();
  const role = 1;

  const sql = `
    INSERT INTO products (name, description, price, images, category_id, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, description, price, imageFilename, category_id, role, created_at, updated_at],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi khi thêm sản phẩm" });
      }
      res.status(201).json({
        message: "Sản phẩm đã được thêm!",
        productId: result.insertId,
      });
    }
  );
});

// ========== PUT - Cập nhật sản phẩm ==========
router.put("/products/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;
  const file = req.file;

  if (!name || !price || !category_id) {
    return res.status(400).json({ message: "Tên, giá, danh mục là bắt buộc!" });
  }

  let imageFilename = req.body.image;
  if (file) imageFilename = file.filename;

  const updated_at = new Date();

  const sql = `
    UPDATE products
    SET name = ?, description = ?, price = ?, images = ?, category_id = ?, updated_at = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, description, price, imageFilename, category_id, updated_at, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm" });
      }
      res
        .status(200)
        .json({ message: "Sản phẩm đã được cập nhật!", productId: id });
    }
  );
});

// ========== DELETE - Ẩn sản phẩm ==========
router.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE products SET role = 0 WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật role sản phẩm:", err.message);
      return res.status(500).json({ message: "Lỗi khi cập nhật role sản phẩm." });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để cập nhật." });
    }

    res
      .status(200)
      .json({ message: "Đã chuyển role sản phẩm thành 0 (ẩn sản phẩm)." });
  });
});

// ========== GET - Lấy danh sách sản phẩm ==========
router.get("/products", (req, res) => {
  const categoryId = req.query.category_id;
  let sql = `
    SELECT p.id, p.name, p.description, p.price, p.images, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.role = 1
  `;

  if (categoryId) {
    sql += ` AND p.category_id = ?`;
    db.query(sql, [categoryId], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn" });
      res.json(result);
    });
  } else {
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn" });
      res.json(result);
    });
  }
});

// ========== GET - Lấy chi tiết sản phẩm ==========
router.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const sqlQuery = "SELECT * FROM products WHERE id = ?";

  db.query(sqlQuery, [productId], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi hệ thống" });
    if (results.length === 0)
      return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
    res.json(results[0]);
  });
});

// ========== GET - Lấy sản phẩm theo danh mục ==========
router.get("/products-by-category/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.images, p.category_id, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ?
  `;
  db.query(sql, [categoryId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn sản phẩm" });
    res.json(result);
  });
});

// ========== EXPORT ==========
module.exports = router;
