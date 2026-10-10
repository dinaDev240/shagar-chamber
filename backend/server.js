require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const membersRouter = require("./members");
const opportunitiesRouter = require("./opportunities");
const newsRouter = require("./news");
const revenueRouter = require("./revenue");
const expoRouter = require("./expo");
const partnershipsRouter = require("./partnerships");
const contactRouter = require("./contact");
const jobApplicationsRouter = require("./job-applications");
const eventsRouter = require("./events");
const adminAuthRouter = require("./admin-auth");
const requireAdmin = require("./admin-middleware");
const db = require("./db");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || "shagar-chamber-admin-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 2
        }
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        // Allow any local origin (localhost, 127.0.0.1 across ports 5500, 5501, 3000, etc.)
        if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.get("/api/cors-test", (req, res) => {

    res.json({
        success: true,
        message: "CORS is working correctly."
    });

});
app.get("/api/admin/test", requireAdmin, (req, res) => {

    res.json({
        success: true,
        message: "Admin authentication is working.",
        admin: req.session.admin
    });

});
app.use("/api/members", membersRouter);
app.use("/api/opportunities", opportunitiesRouter);
app.use("/api/news", newsRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/expos", expoRouter);
app.use("/api/partnerships", partnershipsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/job-applications", jobApplicationsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/admin", adminAuthRouter);
// Serve the website (frontend folder) from this same server
// Open http://localhost:5000/admin-login.html in the browser
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Shagar Chamber backend is running successfully!"
    });
});
// Test MySQL connection
app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1 AS test", (err, results) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({
                success: false,
                message: "Database query failed"
            });
        }

        res.json({
            success: true,
            message: "Database query successful!",
            result: results
        });
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Shagar Chamber backend running on http://localhost:${PORT}`);
});