// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");

// ========== GET - Lấy danh sách đơn hàng ==========
router.get("/orders", (req, res) => {
  const status = req.query.status || "";

  const sql = `
    SELECT 
      o.id, 
      u.name AS userName, 
      o.status, 
      SUM(od.quantity) AS total_quantity, 
      o.total_amount AS total_price,
      o.created_at AS orderDate
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_details od ON o.id = od.order_id
    LEFT JOIN products p ON od.product_id = p.id
    WHERE o.status LIKE ?
    GROUP BY o.id, u.name, o.status
  `;

  db.query(sql, [`%${status}%`], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi truy vấn" });
    }
    res.json(result);
  });
});

// ========== PUT - Hủy đơn hàng ==========
router.put("/orders/:id/cancel", (req, res) => {
  const orderId = req.params.id;

  const query = "UPDATE orders SET status = ? WHERE id = ?";
  const values = ["Canceled", orderId];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({ message: "Đơn hàng đã được hủy" });
  });
});

// ========== PUT - Cập nhật trạng thái đơn hàng ==========
router.put("/orders/:id/status", (req, res) => {
  const orderId = req.params.id;

  const query = "UPDATE orders SET status = ? WHERE id = ?";
  const values = ["Delivered", orderId];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res
      .status(200)
      .json({ message: "Đã cập nhật trạng thái đơn hàng thành Delivered" });
  });
});

// ========== GET - Lấy chi tiết đơn hàng ==========
router.get("/orders/:orderId/detail", (req, res) => {
  const { orderId } = req.params;

  db.query(
    `SELECT o.id, o.created_at AS order_date,o.total_amount AS total_price, o.status, u.name AS user_name 
     FROM orders o
     JOIN users u ON o.user_id = u.id
     WHERE o.id = ?`,
    [orderId],
    (error, order) => {
      if (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        return res
          .status(500)
          .json({ message: "Lỗi server khi lấy thông tin đơn hàng" });
      }

      if (!order || order.length === 0) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại" });
      }

      db.query(
        `SELECT od.product_id, p.name AS product_name, od.quantity, od.price
         FROM order_details od
         JOIN products p ON od.product_id = p.id
         WHERE od.order_id = ?`,
        [orderId],
        (error, orderDetails) => {
          if (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            return res
              .status(500)
              .json({ message: "Lỗi server khi lấy chi tiết đơn hàng" });
          }

          const totalPrice = order[0].total_price;

          return res.json({
            order: {
              id: order[0].id,
              userName: order[0].user_name,
              orderDate: order[0].order_date,
              totalPrice: totalPrice,
              status: order[0].status,
            },
            orderDetails,
          });
        }
      );
    }
  );
});

// ========== GET - Lấy danh sách đơn hàng của người dùng ==========
router.get("/orders/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT o.id, o.status, o.total_amount, o.payment_type, o.created_at
    FROM orders o
    WHERE o.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi truy vấn đơn hàng" });
    }
    res.json(results);
  });
});

// ========== GET - Lấy chi tiết đơn hàng theo ID ==========
router.get("/order/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  const sqlOrderInfo = `
    SELECT status, total_amount, payment_type, created_at
    FROM orders
    WHERE id = ?
  `;

  const sqlOrderDetails = `
    SELECT od.id, p.name, p.price, od.quantity
    FROM order_details od
    JOIN products p ON od.product_id = p.id
    WHERE od.order_id = ?
  `;

  db.query(sqlOrderInfo, [orderId], (err, orderResult) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn đơn hàng" });
    if (orderResult.length === 0)
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    const orderInfo = orderResult[0];

    db.query(sqlOrderDetails, [orderId], (err, itemResults) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn sản phẩm" });

      res.json({
        orderInfo,
        items: itemResults,
      });
    });
  });
});

// ========== DELETE - Xóa chi tiết đơn hàng ==========
router.delete("/order-detail/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Thiếu ID sản phẩm" });
  }

  const getOrderIdQuery = "SELECT order_id FROM order_details WHERE id = ?";
  db.execute(getOrderIdQuery, [id], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn order_id:", err);
      return res.status(500).json({ message: "Lỗi truy vấn order_id" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để xóa" });
    }

    const orderId = results[0].order_id;

    const deleteQuery = "DELETE FROM order_details WHERE id = ?";
    db.execute(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        return res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
      }

      const totalQuery = `
        SELECT SUM(price * (1 - IFNULL(discount, 0) / 100)) AS total
        FROM order_details
        WHERE order_id = ?
      `;
      db.execute(totalQuery, [orderId], (err, rows) => {
        if (err) {
          console.error("Lỗi khi tính tổng:", err);
          return res.status(500).json({ message: "Lỗi khi tính tổng tiền" });
        }

        const newTotal = Math.round(rows[0].total || 0);

        if (newTotal === 0) {
          const deleteOrderQuery = "DELETE FROM orders WHERE id = ?";
          db.execute(deleteOrderQuery, [orderId], (err) => {
            if (err) {
              console.error("Lỗi khi xóa đơn hàng:", err);
              return res.status(500).json({ message: "Lỗi khi xóa đơn hàng" });
            }

            return res.status(200).json({
              message: "Đã xóa sản phẩm và đơn hàng vì không còn sản phẩm nào",
            });
          });
        } else {
          const updateOrderQuery =
            "UPDATE orders SET total_amount = ? WHERE id = ?";
          db.execute(updateOrderQuery, [newTotal, orderId], (err) => {
            if (err) {
              console.error("Lỗi khi cập nhật đơn hàng:", err);
              return res
                .status(500)
                .json({ message: "Lỗi khi cập nhật đơn hàng" });
            }

            return res.status(200).json({
              message: "Đã xóa sản phẩm và cập nhật tổng tiền đơn hàng",
            });
          });
        }
      });
    });
  });
});

// ========== POST - Đặt hàng ==========
router.post("/place-order", (req, res) => {
  const { userId, paymentType, totalAmount, voucherCode } = req.body;

  if (!userId || !paymentType || !totalAmount) {
    return res.status(400).json({ success: false, alert: "Dữ liệu không hợp lệ" });
  }

  const handleError = (err, message) => {
    console.error(err);
    res.status(500).json({ success: false, alert: message });
  };

  const now = new Date();
  let appliedDiscount = 0;

  const processVoucher = (callback) => {
    if (!voucherCode) return callback();

    const voucherQuery = `
      SELECT * FROM vouchers 
      WHERE discountcode = ? AND start <= ? AND end >= ? AND quantity > 0
    `;

    db.query(voucherQuery, [voucherCode, now, now], (err, result) => {
      if (err) return handleError(err, "Lỗi kiểm tra mã giảm giá");

      if (result.length === 0) {
        return res.status(400).json({
          success: false,
          alert: "Mã giảm giá không hợp lệ hoặc đã hết lượt sử dụng",
        });
      }

      appliedDiscount = result[0].discount || 0;

      db.query(
        "UPDATE vouchers SET quantity = quantity - 1 WHERE id = ?",
        [result[0].id],
        (err2) => {
          if (err2) return handleError(err2, "Lỗi cập nhật mã giảm giá");
          callback();
        }
      );
    });
  };

  processVoucher(() => {
    const createOrderQuery = `
      INSERT INTO orders (user_id, status, payment_type, total_amount)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      createOrderQuery,
      [userId, "Ordered", paymentType, totalAmount],
      (err, orderInsertResult) => {
        if (err) return handleError(err, "Lỗi khi tạo đơn hàng");

        const orderId = orderInsertResult.insertId;

        const cartQuery = `
          SELECT ci.product_id, ci.quantity, p.price
          FROM cart_items ci
          JOIN products p ON ci.product_id = p.id
          WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = ? LIMIT 1)
        `;
        db.query(cartQuery, [userId], (err2, cartItems) => {
          if (err2) return handleError(err2, "Lỗi khi lấy giỏ hàng");

          if (cartItems.length === 0) {
            return res.status(400).json({
              success: false,
              alert: "Giỏ hàng của bạn trống",
            });
          }

          let remaining = cartItems.length;

          cartItems.forEach((item) => {
            const total = item.price * item.quantity;

            const insertQuery = `
              INSERT INTO order_details (order_id, product_id, quantity, price, discount)
              VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
              insertQuery,
              [orderId, item.product_id, item.quantity, total, appliedDiscount],
              (err4) => {
                if (err4)
                  return handleError(err4, "Lỗi khi thêm sản phẩm vào đơn hàng");

                remaining--;
                if (remaining === 0) {
                  db.query(
                    "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
                    [userId],
                    (err5, cart) => {
                      if (err5) return handleError(err5, "Lỗi khi lấy cart");

                      if (cart.length > 0) {
                        db.query(
                          "DELETE FROM cart_items WHERE cart_id = ?",
                          [cart[0].id],
                          (err6) => {
                            if (err6) return handleError(err6, "Lỗi khi xóa giỏ hàng");
                            res.status(200).json({
                              success: true,
                              alert: "Đặt hàng thành công",
                            });
                          }
                        );
                      } else {
                        res.status(200).json({
                          success: true,
                          alert: "Đặt hàng thành công",
                        });
                      }
                    }
                  );
                }
              }
            );
          });
        });
      }
    );
  });
});

// ========== GET - Lấy thông tin đơn hàng ==========
router.get("/order-info", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Thiếu userId" });
  }

  const userQuery = `SELECT name, address, phone FROM users WHERE id = ?`;
  db.query(userQuery, [userId], (err, userResult) => {
    if (err)
      return res.status(500).json({ message: "Lỗi khi truy vấn người dùng" });
    if (userResult.length === 0)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const user = userResult[0];

    const productQuery = `
      SELECT p.name, p.description, p.price, p.images, ci.quantity
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      JOIN products p ON p.id = ci.product_id
      WHERE c.user_id = ?
    `;

    db.query(productQuery, [userId], (err, products) => {
      if (err)
        return res.status(500).json({ message: "Lỗi khi truy vấn giỏ hàng" });

      res.json({
        user,
        products,
      });
    });
  });
});

// ========== EXPORT ==========
module.exports = router;
