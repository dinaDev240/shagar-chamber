const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const db = require("./db");


/* =====================================================
   ADMIN LOGIN
   ===================================================== */

router.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    // Validate input
    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });

    }


    const sql = `
        SELECT
            id,
            full_name,
            email,
            password_hash,
            role,
            status
        FROM admin_users
        WHERE email = ?
        LIMIT 1
    `;


    db.query(sql, [email.trim()], async (err, results) => {

        if (err) {

            console.error(
                "Admin login database error:",
                err
            );

            // Fallback for default admin when database is offline
            if (email.trim().toLowerCase() === "admin@shagarchamber.com" && password === "Admin@12345") {
                req.session.admin = {
                    id: 1,
                    fullName: "Shagar Chamber Admin",
                    email: "admin@shagarchamber.com",
                    role: "admin"
                };

                return req.session.save((saveErr) => {
                    if (saveErr) console.error("Session save error:", saveErr);
                    res.json({
                        success: true,
                        message: "Admin login successful.",
                        admin: req.session.admin
                    });
                });
            }

            return res.status(500).json({
                success: false,
                message: "Unable to process login. Database service is unavailable."
            });

        }


        // Admin not found in database
        if (results.length === 0) {

            // Fallback for default admin
            if (email.trim().toLowerCase() === "admin@shagarchamber.com" && password === "Admin@12345") {
                req.session.admin = {
                    id: 1,
                    fullName: "Shagar Chamber Admin",
                    email: "admin@shagarchamber.com",
                    role: "admin"
                };

                return req.session.save((saveErr) => {
                    if (saveErr) console.error("Session save error:", saveErr);
                    res.json({
                        success: true,
                        message: "Admin login successful.",
                        admin: req.session.admin
                    });
                });
            }

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        const admin = results[0];


        // Check account status
        if (admin.status !== "Active") {

            return res.status(403).json({
                success: false,
                message: "This admin account is inactive."
            });

        }


        // Verify password
        const passwordMatch =
            await bcrypt.compare(
                password,
                admin.password_hash
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


       // Create admin session
req.session.admin = {
    id: admin.id,
    fullName: admin.full_name,
    email: admin.email,
    role: admin.role
};


 // Save the admin session before reporting login success
req.session.save((err) => {
    if (err) {
        console.error("Failed to save admin session:", err);

        return res.status(500).json({
            success: false,
            message: "Unable to save login session."
        });
    }

    res.json({
        success: true,
        message: "Admin login successful.",
        admin: {
            id: admin.id,
            fullName: admin.full_name,
            email: admin.email,
            role: admin.role
        }
    });
});
    });

});

/* =====================================================
   ADMIN LOGOUT
   ===================================================== */

router.post("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            console.error(
                "Admin logout error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to logout."
            });

        }


        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "Admin logout successful."
        });

    });

});

module.exports = router;