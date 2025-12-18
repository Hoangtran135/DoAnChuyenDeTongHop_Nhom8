// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorHandler");
const { securityHeaders, apiLimiter, authLimiter } = require("./middleware/security");

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Global middleware
app.use(securityHeaders);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploads
app.use("/uploads", express.static(process.env.UPLOAD_DIR || "uploads"));

// Rate limiting
app.use("/api/", apiLimiter);
app.use("/login", authLimiter);
app.use("/register", authLimiter);
app.use("/registeradmin", authLimiter);

// Healthcheck
app.get("/", (req, res) => {
  res.send("Server Node.js đã chạy");
});

// Routes (tách theo module)
app.use(require("./routes"));

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`);
});


