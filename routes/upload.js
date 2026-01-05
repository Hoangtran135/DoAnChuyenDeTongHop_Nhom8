// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const { upload } = require("../config/multer");

// ========== POST - Upload ảnh ==========
router.post("/upload", upload.single("image"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("Không có file được upload.");
  }

  const imageFilename = file.filename;
  res.send({ imageFilename });
});

// ========== EXPORT ==========
module.exports = router;
