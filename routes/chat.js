// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");

// ========== GET - Lấy conversations của user ==========
router.get("/api/conversations/user/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT id, user_id 
    FROM conversations 
    WHERE user_id = ? 
    ORDER BY id DESC
    LIMIT 10
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ========== GET - Lấy tất cả conversations ==========
router.get("/api/conversations1", (req, res) => {
  const sql = "SELECT * FROM conversations";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn conversations:", err);
      return res.status(500).json({ error: "Lỗi server khi lấy conversations" });
    }
    res.json(results);
  });
});

// ========== POST - Tạo conversation mới ==========
router.post("/api/conversations", (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: "Missing user_id" });

  db.query("DELETE FROM conversations WHERE user_id = ?", [user_id], (err) => {
    if (err) {
      console.error("Lỗi khi xóa conversation cũ:", err);
      return res.status(500).json({ error: "Server error" });
    }

    db.query(
      "INSERT INTO conversations (user_id) VALUES (?)",
      [user_id],
      (err2, result) => {
        if (err2) {
          console.error("Lỗi khi tạo conversation mới:", err2);
          return res.status(500).json({ error: "Server error" });
        }

        const newConversationId = result.insertId;

        const welcomeMessage =
          "Xin chào bạn! Cảm ơn bạn đã liên hệ với EightMart – bạn cần hỗ trợ gì hôm nay ạ? 💬";
        const adminId = 1;
        const role = 1;

        db.query(
          "INSERT INTO messages (conversation_id, user_id, message, role, created_at) VALUES (?, ?, ?, ?, NOW())",
          [newConversationId, adminId, welcomeMessage, role],
          (err3) => {
            if (err3) {
              console.error("Lỗi khi tạo tin nhắn chào mừng:", err3);
              return res.status(500).json({ error: "Server error" });
            }

            db.query(
              "SELECT * FROM conversations WHERE id = ?",
              [newConversationId],
              (err4, rows) => {
                if (err4) {
                  console.error(err4);
                  return res.status(500).json({ error: "Server error" });
                }
                res.json(rows[0]);
              }
            );
          }
        );
      }
    );
  });
});

// ========== GET - Lấy tin nhắn theo conversation ==========
router.get("/api/messages/:conversation_id", (req, res) => {
  const conversationId = +req.params.conversation_id;
  db.query(
    `SELECT m.*, u.name, u.role FROM messages m
     JOIN users u ON m.user_id = u.id
     WHERE m.conversation_id = ?
     ORDER BY m.created_at ASC`,
    [conversationId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }
      res.json(rows);
    }
  );
});

// ========== POST - Gửi tin nhắn (user) ==========
router.post("/api/messages", (req, res) => {
  const { conversation_id, user_id, message } = req.body;
  if (!conversation_id || !user_id || !message)
    return res.status(400).json({ error: "Missing fields" });

  db.query(
    "INSERT INTO messages (conversation_id, user_id, message, created_at) VALUES (?, ?, ?, NOW())",
    [conversation_id, user_id, message],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }

      res.json({ success: true });
    }
  );
});

// ========== GET - Lấy tin nhắn admin ==========
router.get("/api/messagesadmin/:conversationId", (req, res) => {
  const conversationId = req.params.conversationId;

  const sql = `
    SELECT 
      m.id, 
      m.conversation_id, 
      m.message, 
      m.created_at, 
      m.role,
      u.name
    FROM messages m
    LEFT JOIN users u ON m.user_id = u.id
    WHERE m.conversation_id = ?
    ORDER BY m.created_at ASC
  `;

  db.query(sql, [conversationId], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy tin nhắn:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    const messages = result.map((row) => ({
      id: row.id,
      conversation_id: row.conversation_id,
      message: row.message,
      created_at: row.created_at,
      role: row.role,
      name: row.name,
      is_admin: row.role === 1,
    }));

    res.json(messages);
  });
});

// ========== POST - Gửi tin nhắn admin ==========
router.post("/api/messagesadmin", (req, res) => {
  const { conversation_id, user_id, message, role } = req.body;

  if (
    conversation_id === undefined ||
    user_id === undefined ||
    !message ||
    (role !== 0 && role !== 1)
  ) {
    return res.status(400).json({ message: "Thiếu hoặc sai dữ liệu đầu vào" });
  }

  const sql = `
    INSERT INTO messages (conversation_id, user_id, message, role, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(sql, [conversation_id, user_id, message, role], (err, result) => {
    if (err) {
      console.error("Error inserting message:", err);
      return res.status(500).json({ message: "Lỗi khi gửi tin nhắn" });
    }

    res.status(201).json({ message: "Tin nhắn đã được gửi", id: result.insertId });
  });
});

// ========== EXPORT ==========
module.exports = router;
