// Validation middleware
const validateRegister = (req, res, next) => {
  const { fullName, username, email, password, phone, address } = req.body;

  if (!fullName || !username || !email || !password || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Email không hợp lệ",
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { username, password, role } = req.body;

  if (!username || !password || role === undefined) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin",
    });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, price, category_id } = req.body;

  if (!name || !price || !category_id) {
    return res.status(400).json({
      success: false,
      message: "Tên, giá và danh mục là bắt buộc",
    });
  }

  if (isNaN(price) || parseFloat(price) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Giá không hợp lệ",
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
};

