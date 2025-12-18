const express = require("express");
const router = express.Router();
const { upload } = require("../config/multer");

// API: Upload ảnh
router.post("/upload", upload.single("image"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("Không có file được upload.");
  }

  // Chỉ trả về tên file ngẫu nhiên
  const imageFilename = file.filename;
  res.send({ imageFilename });
});

module.exports = router;

