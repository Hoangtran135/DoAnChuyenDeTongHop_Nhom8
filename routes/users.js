// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");

// ========== PUT - Cập nhật Admin ==========
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT * FROM users WHERE id = ? AND role = 1",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản Admin" });
    }

    await db.query(
      "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
      [username, email, password, id]
    );
    res.json({ message: "Cập nhật Admin thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật admin:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi cập nhật admin" });
  }
});

// ========== DELETE - Ẩn tài khoản ==========
router.delete("/deleteusers/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Nhận yêu cầu ẩn tài khoản với ID: ${id}`);

  db.query("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    if (err) {
      console.error("Lỗi khi truy vấn:", err);
      return res
        .status(500)
        .json({ message: "Lỗi máy chủ khi kiểm tra tài khoản người dùng" });
    }

    if (user.length === 0) {
      console.log("Không tìm thấy tài khoản với ID:", id);
      return res.status(404).json({ message: "Không tìm thấy tài khoản để ẩn" });
    }

    const updateQuery = "UPDATE users SET role1 = 0 WHERE id = ?";
    db.query(updateQuery, [id], (err, result) => {
      if (err) {
        console.error("Lỗi khi cập nhật role1:", err);
        return res.status(500).json({ message: "Lỗi máy chủ khi ẩn tài khoản" });
      }

      if (result.affectedRows === 0) {
        console.log("Không thể ẩn tài khoản với ID:", id);
        return res.status(404).json({ message: "Không thể ẩn tài khoản này" });
      }

      console.log("Ẩn tài khoản thành công với ID:", id);
      res.json({ message: "Ẩn tài khoản thành công" });
    });
  });
});

// ========== PUT - Cập nhật user ==========
router.put("/updateuser/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone || !address) {
    console.log("Missing data:", { name, email, phone, address });
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin",
    });
  }

  console.log("Received update request for user ID:", userId);
  console.log("Update data:", { name, email, phone, address });

  const query = `
    UPDATE users
    SET name = ?, email = ?, phone = ?, address = ?
    WHERE id = ?
  `;
  db.query(query, [name, email, phone, address, userId], (err, result) => {
    if (err) {
      console.error("Error updating user info:", err);
      return res
        .status(500)
        .json({ success: false, message: "Không thể cập nhật thông tin" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User information updated successfully",
    });
  });
});

// ========== PUT - Cập nhật admin ==========
router.put("/updateadmin/:id", (req, res) => {
  const adminId = req.params.id;
  const { name, email, phone, address, password, username } = req.body;

  if (!name || !email || !phone || !address || !username) {
    console.log("Thiếu dữ liệu:", { name, email, phone, address, username });
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin",
    });
  }

  let query = `
    UPDATE users
    SET name = ?, email = ?, phone = ?, address = ?, username = ?
    ${password ? ", password = ?" : ""}
    WHERE id = ?
  `;

  const params = password
    ? [name, email, phone, address, username, password, adminId]
    : [name, email, phone, address, username, adminId];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật thông tin admin:", err);
      return res.status(500).json({
        success: false,
        message: "Không thể cập nhật thông tin admin",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy quản trị viên",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật quản trị viên thành công",
    });
  });
});

// ========== GET - Lấy thông tin người dùng ==========
router.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const query =
    "SELECT id,username,password, name, email, phone, address FROM users WHERE id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({
        success: false,
        alert: "Có lỗi xảy ra khi truy vấn cơ sở dữ liệu",
      });
    }

    if (results.length > 0) {
      return res.json({ success: true, user: results[0] });
    } else {
      return res
        .status(404)
        .json({ success: false, alert: "Người dùng không tìm thấy" });
    }
  });
});

// ========== GET - Lấy danh sách người dùng ==========
router.get("/users", (req, res) => {
  const role = req.query.role;
  const role1 = req.query.role1;

  if (role === undefined || role1 === undefined) {
    return res.status(400).send("Thiếu tham số role hoặc role1");
  }

  const query =
    "SELECT id, username, email, role FROM users WHERE role = ? AND role1 = ?";
  db.query(query, [role, role1], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err);
      return res.status(500).send("Lỗi server");
    }

    res.json(results);
  });
});

// ========== GET - Kiểm tra role user ==========
router.get("/checkusers/:id", (req, res) => {
  const userId = req.params.id;
  console.log("Nhận request check role cho userId:", userId);

  const query = "SELECT role FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    res.json({ role: results[0].role });
  });
});

// ========== EXPORT ==========
module.exports = router;
