
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("./db");

/* ADMIN LOGIN */
router.post("/login", (req, res) => {
    const identifier = String(
        req.body?.username || req.body?.email || ""
    ).trim();
    const password = req.body?.password;

    if (!identifier || typeof password !== "string" || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required."
        });
    }

    const sql = `
        SELECT id, full_name, username, email,
               password_hash, role, status
        FROM admin_users
        WHERE username = ? OR email = ?
        LIMIT 1
    `;

    db.query(sql, [identifier, identifier], async (err, results) => {
        if (err) {
            console.error("Admin login database error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Unable to process login. Please try again later."
            });
        }

        if (!results || results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const admin = results[0];

        if (admin.status !== "Active") {
            return res.status(403).json({
                success: false,
                message: "This admin account is inactive."
            });
        }

        try {
            const passwordMatch = await bcrypt.compare(
                password,
                admin.password_hash
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password."
                });
            }

            req.session.admin = {
                id: admin.id,
                fullName: admin.full_name,
                username: admin.username,
                email: admin.email,
                role: admin.role
            };

            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error("Admin session save failed:", saveErr.message);
                    return res.status(500).json({
                        success: false,
                        message: "Unable to save login session."
                    });
                }

                return res.json({
                    success: true,
                    message: "Admin login successful.",
                    admin: req.session.admin
                });
            });
        } catch (error) {
            console.error("Admin password verification failed:", error.message);
            return res.status(500).json({
                success: false,
                message: "Unable to process login."
            });
        }
    });
});

/* ADMIN LOGOUT */
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Admin logout error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Unable to logout."
            });
        }

        res.clearCookie("connect.sid");
        return res.json({
            success: true,
            message: "Admin logout successful."
        });
    });
});

module.exports = router;
