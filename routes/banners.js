// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");
const { upload, generateRandomFilename } = require("../config/multer");
const path = require("path");
const fs = require("fs");
const uploadDir = process.env.UPLOAD_DIR || "uploads";

// ========== GET - Lấy danh sách banners ==========
router.get("/banners", (req, res) => {
  const sql =
    "SELECT id, images AS images, created_at FROM banner ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching banners:", err);
      return res.status(500).json({ error: "Lỗi server khi lấy banner" });
    }

    res.json(results);
  });
});

// ========== GET - Lấy banner (alias) ==========
router.get("/laybanners", (req, res) => {
  const sql =
    "SELECT id, images, created_at FROM banner ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching banner:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
});

// ========== DELETE - Xóa banner ==========
router.delete("/banners/:id", (req, res) => {
  const bannerId = req.params.id;

  db.query("SELECT * FROM banner WHERE id = ?", [bannerId], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Lỗi server khi kiểm tra banner" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Banner không tồn tại" });
    }

    db.query("DELETE FROM banner WHERE id = ?", [bannerId], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: "Lỗi server khi xóa banner" });
      }

      res.json({ message: "Xóa banner thành công" });
    });
  });
});

// ========== POST - Thêm banner ==========
router.post("/banners", upload.single("image"), (req, res) => {
  const file = req.file;

  if (!file) {
    console.log("Không có file được gửi lên");
    return res.status(400).json({ message: "Bạn cần gửi file ảnh." });
  }

  console.log("File đã được upload tạm thời:", file.filename);
  const ext = path.extname(file.originalname);
  const newFilename = generateRandomFilename() + ext;

  const oldPath = path.join(__dirname, "..", uploadDir, file.filename);
  const newPath = path.join(__dirname, "..", uploadDir, newFilename);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error("Lỗi khi đổi tên file:", err);
      return res.status(500).json({ message: "Lỗi khi đổi tên file." });
    }

    console.log(`Đổi tên file thành công: ${file.filename} -> ${newFilename}`);

    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    const sql = "INSERT INTO banner (images, created_at) VALUES (?, ?)";

    db.query(sql, [newFilename, createdAt], (err, results) => {
      if (err) {
        console.error("Lỗi khi thêm banner vào database:", err);
        return res.status(500).json({ message: "Lỗi khi thêm banner." });
      }

      console.log("Thêm banner thành công, ID:", results.insertId);
      res
        .status(201)
        .json({ message: "Banner đã được thêm.", id: results.insertId });
    });
  });
});

// ========== PUT - Cập nhật banner ==========
router.put("/updatebanners/:id", upload.single("image"), (req, res) => {
  const bannerId = req.params.id;
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ message: "Bạn cần gửi file ảnh để update banner." });
  }

  const getBannerSql = "SELECT images FROM banner WHERE id = ?";
  db.query(getBannerSql, [bannerId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy banner từ database:", err);
      return res.status(500).json({ message: "Lỗi khi lấy banner." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Banner không tồn tại." });
    }

    const oldFilename = results[0].images;

    const ext = path.extname(file.originalname);
    const newFilename = generateRandomFilename() + ext;

    const oldPath = path.join(__dirname, "..", uploadDir, file.filename);
    const newPath = path.join(__dirname, "..", uploadDir, newFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Lỗi khi đổi tên file:", err);
        return res.status(500).json({ message: "Lỗi khi đổi tên file." });
      }

      const updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
      const updateSql =
        "UPDATE banner SET images = ?, created_at = ? WHERE id = ?";

      db.query(
        updateSql,
        [newFilename, updatedAt, bannerId],
        (err, results) => {
          if (err) {
            console.error("Lỗi khi cập nhật banner trong database:", err);
            return res
              .status(500)
              .json({ message: "Lỗi khi cập nhật banner." });
          }

          if (oldFilename) {
            const oldFilePath = path.join(__dirname, "..", uploadDir, oldFilename);
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.warn("Không thể xóa file ảnh cũ:", oldFilePath);
              }
            });
          }

          return res
            .status(200)
            .json({ message: "Banner đã được cập nhật.", id: bannerId });
        }
      );
    });
  });
});

// ========== EXPORT ==========
module.exports = router;
