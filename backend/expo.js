const express = require("express");
const router = express.Router();
const db = require("./db");
const requireAdmin = require("./admin-middleware");

/* =====================================================
   GET ALL EXPOS
   ===================================================== */

router.get("/", (req, res) => {

    const sql = `
        SELECT *
        FROM expos
        ORDER BY start_date ASC, id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Failed to load expos:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to load expos"
            });
        }

        res.json({
            success: true,
            expos: results
        });

    });

});


/* =====================================================
   GET ONE EXPO
   ===================================================== */

router.get("/:id", (req, res) => {

    const expoId = req.params.id;

    const sql = `
        SELECT *
        FROM expos
        WHERE id = ?
    `;

    db.query(sql, [expoId], (err, results) => {

        if (err) {

            console.error("Failed to load expo:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to load expo"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Expo not found"
            });
        }

        res.json({
            success: true,
            expo: results[0]
        });

    });

});


/* =====================================================
   CREATE EXPO
   ===================================================== */

router.post("/", requireAdmin, (req, res) => {

    const {
        title,
        type,
        description,
        image_url,
        location,
        start_date,
        end_date,
        contact_email,
        contact_phone,
        status
    } = req.body;


    if (!title || !type || !description) {

        return res.status(400).json({
            success: false,
            message: "Title, type and description are required"
        });

    }


    const sql = `
        INSERT INTO expos
        (
            title,
            type,
            description,
            image_url,
            location,
            start_date,
            end_date,
            contact_email,
            contact_phone,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const values = [
        title,
        type,
        description,
        image_url || null,
        location || null,
        start_date || null,
        end_date || null,
        contact_email || null,
        contact_phone || null,
        status || "Upcoming"
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error("Failed to create expo:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to create expo"
            });
        }


        res.status(201).json({
            success: true,
            message: "Expo created successfully",
            expoId: result.insertId
        });

    });

});


/* =====================================================
   UPDATE EXPO
   ===================================================== */

router.put("/:id", requireAdmin, (req, res) => {

    const expoId = req.params.id;

    const {
        title,
        type,
        description,
        image_url,
        location,
        start_date,
        end_date,
        contact_email,
        contact_phone,
        status
    } = req.body;


    if (!title || !type || !description) {

        return res.status(400).json({
            success: false,
            message: "Title, type and description are required"
        });

    }


    const sql = `
        UPDATE expos
        SET
            title = ?,
            type = ?,
            description = ?,
            image_url = ?,
            location = ?,
            start_date = ?,
            end_date = ?,
            contact_email = ?,
            contact_phone = ?,
            status = ?
        WHERE id = ?
    `;


    const values = [
        title,
        type,
        description,
        image_url || null,
        location || null,
        start_date || null,
        end_date || null,
        contact_email || null,
        contact_phone || null,
        status || "Upcoming",
        expoId
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error("Failed to update expo:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to update expo"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Expo not found"
            });

        }


        res.json({
            success: true,
            message: "Expo updated successfully"
        });

    });

});


/* =====================================================
   DELETE EXPO
   ===================================================== */

router.delete("/:id", requireAdmin, (req, res) => {

    const expoId = req.params.id;


    const sql = `
        DELETE FROM expos
        WHERE id = ?
    `;


    db.query(sql, [expoId], (err, result) => {

        if (err) {

            console.error("Failed to delete expo:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete expo"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Expo not found"
            });

        }


        res.json({
            success: true,
            message: "Expo deleted successfully"
        });

    });

});


module.exports = router;