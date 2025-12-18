const express = require("express");
const router = express.Router();

// Mount all route modules (keeps server.js minimal)
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
router.use(require("./feedback"));
router.use(require("./search"));
router.use(require("./reports"));
router.use(require("./chat"));

module.exports = router;


