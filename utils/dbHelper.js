const pool = require("../config/database");

/**
 * Wrapper để tương thích với code cũ đang dùng callback style:
 *   db.query(sql, cb)
 *   db.query(sql, params, cb)
 *   db.execute(sql, params, cb)
 * và code mới đang dùng mysql2 promise style:
 *   const [rows] = await db.query(sql, params)
 *
 * Lưu ý: Promise style sẽ trả về đúng format của mysql2: [rows, fields]
 */
function query(sql, params, cb) {
  // db.query(sql, cb)
  if (typeof params === "function") {
    cb = params;
    params = undefined;
  }

  // Callback style
  if (typeof cb === "function") {
    pool
      .query(sql, params)
      .then(([rows, fields]) => cb(null, rows, fields))
      .catch((err) => cb(err));
    return;
  }

  // Promise style: [rows, fields]
  return pool.query(sql, params);
}

function execute(sql, params, cb) {
  // db.execute(sql, cb)
  if (typeof params === "function") {
    cb = params;
    params = undefined;
  }

  // Callback style
  if (typeof cb === "function") {
    pool
      .execute(sql, params)
      .then(([rows, fields]) => cb(null, rows, fields))
      .catch((err) => cb(err));
    return;
  }

  // Promise style: [rows, fields]
  return pool.execute(sql, params);
}

module.exports = {
  query,
  execute,
  pool,
};

