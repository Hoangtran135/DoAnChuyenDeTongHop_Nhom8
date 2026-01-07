// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");

// ========== POST - Đăng ký người dùng ==========
router.post("/register", (req, res) => {
  const { fullName, username, email, password, phone, address } = req.body;

  if (!fullName || !username || !email || !password || !phone || !address) {
    return res
      .status(400)
      .json({ success: false, alert: "Vui lòng nhập đầy đủ thông tin" });
  }

  console.log("Dữ liệu đăng ký nhận được:", {
    fullName,
    username,
    email,
    password,
    phone,
    address,
    role: 0,
  });

  const checkUsernameSql = "SELECT * FROM users WHERE username = ?";
  const checkEmailSql = "SELECT * FROM users WHERE email = ?";

  db.query(checkUsernameSql, [username], (err, usernameResult) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, alert: "Lỗi khi kiểm tra username" });
    if (usernameResult.length > 0)
      return res
        .status(400)
        .json({ success: false, alert: "Tên đăng nhập đã tồn tại" });

    db.query(checkEmailSql, [email], (err, emailResult) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, alert: "Lỗi khi kiểm tra email" });
      if (emailResult.length > 0)
        return res.status(400).json({ success: false, alert: "Email đã tồn tại" });

      const insertSql =
        "INSERT INTO users (name, username, email, password, phone, address, role, role1) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        insertSql,
        [fullName, username, email, password, phone, address, 0, 1],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, alert: "Lỗi khi đăng ký tài khoản" });

          console.log("Thêm user mới vào database thành công!");
          res.json({ success: true, alert: "Đăng ký thành công" });
        }
      );
    });
  });
});

// ========== POST - Đăng ký admin ==========
router.post("/registeradmin", (req, res) => {
  const { fullName, username, email, password, phone, address } = req.body;

  if (!fullName || !username || !email || !password || !phone || !address) {
    return res
      .status(400)
      .json({ success: false, alert: "Vui lòng nhập đầy đủ thông tin" });
  }

  console.log("Dữ liệu đăng ký nhận được:", {
    fullName,
    username,
    email,
    password,
    phone,
    address,
    role: 1,
  });

  const checkUsernameSql = "SELECT * FROM users WHERE username = ?";
  const checkEmailSql = "SELECT * FROM users WHERE email = ?";

  db.query(checkUsernameSql, [username], (err, usernameResult) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, alert: "Lỗi khi kiểm tra username" });
    if (usernameResult.length > 0)
      return res
        .status(400)
        .json({ success: false, alert: "Tên đăng nhập đã tồn tại" });

    db.query(checkEmailSql, [email], (err, emailResult) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, alert: "Lỗi khi kiểm tra email" });
      if (emailResult.length > 0)
        return res.status(400).json({ success: false, alert: "Email đã tồn tại" });

      const insertSql =
        "INSERT INTO users (name, username, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
      db.query(
        insertSql,
        [fullName, username, email, password, phone, address, 1],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ success: false, alert: "Lỗi khi đăng ký tài khoản" });

          console.log("Thêm user mới vào database thành công!");
          res.json({ success: true, alert: "Đăng ký thành công" });
        }
      );
    });
  });
});

// ========== POST - Đăng nhập ==========
router.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || role === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập đủ thông tin" });
  }

  // Chỉ cho phép đăng nhập khi role1 = 1 (role1 = 0 thì không thể đăng nhập)
  const sql =
    "SELECT * FROM users WHERE username = ? AND password = ? AND role = ? AND role1 = 1";
  db.query(sql, [username, password, role], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn:", err);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.json({
        success: true,
        message: "Đăng nhập thành công",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Tên đăng nhập, mật khẩu hoặc quyền truy cập không đúng",
      });
    }
  });
});

// ========== EXPORT ==========
module.exports = router;
