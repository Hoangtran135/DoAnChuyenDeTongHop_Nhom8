const express = require("express");
const router = express.Router();
const db = require("../utils/dbHelper");
const moment = require("moment-timezone");

// GET all vouchers
router.get("/vouchers", (req, res) => {
  const sql =
    "SELECT id, start, end, discountcode,discount, quantity, created_at FROM vouchers ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err)
      return res.json({
        success: false,
        message: "Error fetching vouchers",
        error: err,
      });
    res.json({ success: true, vouchers: result });
  });
});

// Tạo voucher (phiên bản đơn giản)
router.post("/vouchers", (req, res) => {
  const { start, end, discountcode, quantity } = req.body;
  const sql =
    "INSERT INTO vouchers (start, end, discountcode, quantity) VALUES (?, ?, ?, ?)";
  db.query(sql, [start, end, discountcode, quantity], (err) => {
    if (err) return res.json({ success: false, message: "Insert failed", error: err });
    res.json({ success: true, message: "Voucher created" });
  });
});

// Voucher khả dụng
router.get("/available-vouchers", (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const query = `
    SELECT discountcode AS code, discount, start, end
    FROM vouchers
    WHERE start <= ? AND end >= ? AND quantity > 0
  `;

  db.query(query, [today, today], (err, results) => {
    if (err) {
      console.error("❌ Lỗi truy vấn vouchers:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    const result = results.map((row) => ({
      code: row.code,
      description: `Áp dụng từ ${row.start} đến ${row.end}`,
      discountAmount: Number(row.discount) || 0,
    }));

    res.json(result);
  });
});

// List vouchers theo trạng thái
router.get("/listvouchers", (req, res) => {
  const status = req.query.status || "all";
  const now = new Date();

  let query = "SELECT * FROM vouchers";
  let params = [];

  if (status === "active") {
    query += " WHERE start <= ? AND end >= ? AND quantity > 0";
    params = [now, now];
  } else if (status === "expired") {
    query += " WHERE end < ? OR quantity = 0";
    params = [now];
  }

  db.execute(query, params, (err, rows) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: "Lỗi truy vấn voucher" });
    }

    const vouchers = rows.map((voucher) => ({
      ...voucher,
      start: moment(voucher.start).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
      end: moment(voucher.end).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
      created_at: moment(voucher.created_at)
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(vouchers);
  });
});

// Tạo voucher (phiên bản đầy đủ)
router.post("/addvouchers", (req, res) => {
  const { discountcode, discount, start, end, quantity } = req.body;

  if (!discountcode || !discount || !start || !end || !quantity) {
    return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
  }

  const startDate = moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss");
  const endDate = moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss");
  const created = moment().format("YYYY-MM-DD HH:mm:ss");

  db.query(
    "SELECT * FROM vouchers WHERE discountcode = ?",
    [discountcode],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi máy chủ khi kiểm tra voucher" });
      }

      if (rows.length > 0) {
        return res.status(400).json({ message: "Mã voucher đã tồn tại" });
      }

      const sql = `INSERT INTO vouchers (discountcode, discount, start, end, created_at, quantity)
                   VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(
        sql,
        [discountcode, discount, startDate, endDate, created, quantity],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ message: "Lỗi máy chủ khi thêm voucher" });
          }

          res.status(201).json({ message: "Thêm voucher thành công" });
        }
      );
    }
  );
});

module.exports = router;


