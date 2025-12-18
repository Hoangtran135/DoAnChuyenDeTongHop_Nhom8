const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");

router.get("/top-products/:limit", (req, res) => {
  const limit = parseInt(req.params.limit);

  if (isNaN(limit) || limit <= 0) {
    return res.status(400).json({ message: "Số lượng không hợp lệ" });
  }

  const sql = `
    SELECT p.id, p.name, SUM(od.quantity) AS total_sold
    FROM order_details od
    JOIN products p ON od.product_id = p.id
    GROUP BY p.id, p.name
    ORDER BY total_sold DESC
    LIMIT ?
  `;

  db.query(sql, [limit], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ message: "Lỗi truy vấn" });
    }
    res.json(result);
  });
});

router.get("/revenue-report", (req, res) => {
  const query = `
    SELECT 
        YEAR(o.created_at) AS year,
        MONTH(o.created_at) AS month,
        SUM(od.quantity * od.price) AS total_revenue, 
        SUM(od.quantity) AS total_sold_products
    FROM 
        order_details od
    JOIN 
        orders o ON od.order_id = o.id
    WHERE 
        o.status = 'Delivered' 
        AND o.created_at >= NOW() - INTERVAL 3 MONTH
    GROUP BY 
        YEAR(o.created_at), MONTH(o.created_at)
    ORDER BY 
        YEAR(o.created_at) DESC, MONTH(o.created_at) DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Database query error");
    } else {
      res.json(results);
    }
  });
});

module.exports = router;


