const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345678",
  database: process.env.DB_NAME || "doan",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test connection
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Đã kết nối MySQL thành công!");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối MySQL:", err);
  });

module.exports = pool;

