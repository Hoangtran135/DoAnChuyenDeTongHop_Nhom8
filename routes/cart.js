// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");

// ========== GET - Lấy danh sách giỏ hàng ==========
router.get("/cart/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT c.id AS cart_id, p.id AS product_id,p.description, p.name, p.price, ci.quantity, p.images
    FROM carts c
    JOIN cart_items ci ON c.id = ci.cart_id
    JOIN products p ON ci.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn giỏ hàng" });
    res.json(results);
  });
});

// ========== POST - Thêm sản phẩm vào giỏ hàng ==========
router.post("/cart-items", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const checkCartQuery = "SELECT id FROM carts WHERE user_id = ?";
  db.query(checkCartQuery, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi khi kiểm tra giỏ hàng" });

    if (results.length > 0) {
      const cart_id = results[0].id;

      const checkItemQuery =
        "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?";
      db.query(checkItemQuery, [cart_id, product_id], (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Lỗi kiểm tra sản phẩm trong giỏ hàng" });

        if (results.length > 0) {
          const updateQuery =
            "UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?";
          db.query(updateQuery, [quantity, cart_id, product_id], (err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Lỗi khi cập nhật giỏ hàng" });
            res.status(200).json({ message: "Cập nhật giỏ hàng thành công" });
          });
        } else {
          const insertQuery =
            "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)";
          db.query(insertQuery, [cart_id, product_id, quantity], (err) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Lỗi khi thêm sản phẩm vào giỏ hàng" });
            res.status(200).json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
          });
        }
      });
    } else {
      const createCartQuery = "INSERT INTO carts (user_id) VALUES (?)";
      db.query(createCartQuery, [user_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi khi tạo giỏ hàng" });

        const cart_id = result.insertId;
        const insertItemQuery =
          "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)";
        db.query(insertItemQuery, [cart_id, product_id, quantity], (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Lỗi khi thêm sản phẩm vào giỏ hàng" });
          res.status(200).json({ message: "Tạo giỏ hàng và thêm sản phẩm thành công" });
        });
      });
    }
  });
});

// ========== PUT - Cập nhật số lượng giỏ hàng ==========
router.put("/cart", (req, res) => {
  const { cart_id, product_id, quantity } = req.body;

  if (!cart_id || !product_id || quantity < 1) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
  }

  const sql = `UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?`;

  db.query(sql, [quantity, cart_id, product_id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật giỏ hàng:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    res.json({ message: "Cập nhật số lượng thành công" });
  });
});

// ========== DELETE - Xóa sản phẩm khỏi giỏ hàng ==========
router.delete("/cart1", (req, res) => {
  const { cart_id, product_id } = req.body;

  if (!cart_id) {
    return res.status(400).json({ message: "cart_id is required" });
  }

  if (!product_id) {
    return res.status(400).json({ message: "product_id is required" });
  }

  const deleteItemSql =
    "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?";
  db.query(deleteItemSql, [cart_id, product_id], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa sản phẩm khỏi cart_items:", err);
      return res
        .status(500)
        .json({ message: "Lỗi máy chủ khi xóa sản phẩm khỏi giỏ hàng" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }

    const checkCartSql = "SELECT 1 FROM cart_items WHERE cart_id = ? LIMIT 1";
    db.query(checkCartSql, [cart_id], (err, rows) => {
      if (err) {
        console.error("Lỗi khi kiểm tra số lượng sản phẩm trong cart:", err);
        return res.status(500).json({ message: "Lỗi khi kiểm tra giỏ hàng" });
      }

      if (rows.length === 0) {
        const deleteCartSql = "DELETE FROM carts WHERE id = ?";
        db.query(deleteCartSql, [cart_id], (err) => {
          if (err) {
            console.error("Lỗi khi xóa cart:", err);
            return res.status(500).json({ message: "Lỗi khi xóa giỏ hàng" });
          }

          return res.status(200).json({
            message: "Xóa sản phẩm thành công và giỏ hàng rỗng đã bị xóa.",
          });
        });
      } else {
        return res.status(200).json({ message: "Xóa sản phẩm thành công" });
      }
    });
  });
});

// ========== EXPORT ==========
module.exports = router;
