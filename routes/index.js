// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();

// ========== ROUTES ==========
router.use(require("./upload"));
router.use(require("./banners"));
router.use(require("./products"));
router.use(require("./categories"));
router.use(require("./auth"));
router.use(require("./users"));
router.use(require("./orders"));
router.use(require("./cart"));
router.use(require("./favorites"));
router.use(require("./vouchers"));
router.use(require("./qrpayment"));
router.use(require("./feedback"));
router.use(require("./search"));
router.use(require("./reports"));
router.use(require("./chat"));

// ========== EXPORT ==========
module.exports = router;
