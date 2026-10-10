const express = require("express");
const router = express.Router();

const db = require("./db");
const requireAdmin = require("./admin-middleware");
// ==========================================
// GET ALL OPPORTUNITIES
// ==========================================

router.get("/", (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            category,
            organization,
            location,
            description,
            requirements,
            contact_email,
            contact_phone,
            application_deadline,
            status,
            created_at
        FROM opportunities
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Failed to fetch opportunities:", err);

            return res.status(500).json({
                success: false,
                message: "Unable to load opportunities."
            });
        }

        res.json({
            success: true,
            opportunities: results
        });
    });
});


// ==========================================
// GET ONE OPPORTUNITY
// ==========================================

router.get("/:id", (req, res) => {

    const opportunityId = req.params.id;

    const sql = `
        SELECT *
        FROM opportunities
        WHERE id = ?
    `;

    db.query(sql, [opportunityId], (err, results) => {

        if (err) {
            console.error("Failed to fetch opportunity:", err);

            return res.status(500).json({
                success: false,
                message: "Unable to load opportunity."
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Opportunity not found."
            });
        }

        res.json({
            success: true,
            opportunity: results[0]
        });
    });
});


// ==========================================
// CREATE OPPORTUNITY
// ==========================================

router.post("/", requireAdmin, (req, res) => {

    const {
        title,
        category,
        organization,
        location,
        description,
        requirements,
        contactEmail,
        contactPhone,
        applicationDeadline
    } = req.body;


    // Required fields
    if (
        !title ||
        !category ||
        !description
    ) {

        return res.status(400).json({
            success: false,
            message: "Title, category and description are required."
        });
    }


    const sql = `
        INSERT INTO opportunities (
            title,
            category,
            organization,
            location,
            description,
            requirements,
            contact_email,
            contact_phone,
            application_deadline,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Open')
    `;


    const values = [
        title.trim(),
        category,
        organization ? organization.trim() : null,
        location ? location.trim() : null,
        description.trim(),
        requirements ? requirements.trim() : null,
        contactEmail ? contactEmail.trim() : null,
        contactPhone ? contactPhone.trim() : null,
        applicationDeadline || null
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error(
                "Failed to create opportunity:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to create opportunity."
            });
        }


        res.status(201).json({
            success: true,
            message: "Opportunity created successfully.",
            opportunity_id: result.insertId
        });
    });
});


// ==========================================
// CLOSE OPPORTUNITY
// ==========================================

router.patch("/:id/close", requireAdmin, (req, res) => {

    const opportunityId = req.params.id;

    const sql = `
        UPDATE opportunities
        SET status = 'Closed'
        WHERE id = ?
    `;

    db.query(sql, [opportunityId], (err, result) => {

        if (err) {

            console.error(
                "Failed to close opportunity:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to close opportunity."
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Opportunity not found."
            });
        }


        res.json({
            success: true,
            message: "Opportunity closed successfully."
        });
    });
});

// DELETE OPPORTUNITY
router.delete("/:id", requireAdmin, (req, res) => {

    const opportunityId = req.params.id;

    const sql = `
        DELETE FROM opportunities
        WHERE id = ?
    `;

    db.query(sql, [opportunityId], (err, result) => {

        if (err) {

            console.error(
                "Failed to delete opportunity:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to delete opportunity."
            });
        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Opportunity not found."
            });
        }

        res.json({
            success: true,
            message: "Opportunity deleted successfully."
        });

    });

});
module.exports = router;