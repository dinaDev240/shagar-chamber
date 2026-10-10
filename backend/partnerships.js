/* =====================================================
   SHAGAR CHAMBER
   PARTNERSHIPS API
   ===================================================== */

const express = require("express");

const router = express.Router();

const db = require("./db");
const requireAdmin = require("./admin-middleware");

/* =====================================================
   GET ALL PARTNERSHIPS
   ===================================================== */

router.get("/", function (req, res) {

    const sql = `
        SELECT *
        FROM partnerships
        ORDER BY created_at DESC
    `;


    db.query(sql, function (err, results) {

        if (err) {

            console.error(
                "Failed to fetch partnerships:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch partnerships"
            });

        }


        res.json({
            success: true,
            partnerships: results
        });

    });

});


/* =====================================================
   GET ONE PARTNERSHIP
   ===================================================== */

router.get("/:id", function (req, res) {

    const partnershipId =
        req.params.id;


    const sql = `
        SELECT *
        FROM partnerships
        WHERE id = ?
    `;


    db.query(
        sql,
        [partnershipId],
        function (err, results) {

            if (err) {

                console.error(
                    "Failed to fetch partnership:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch partnership"
                });

            }


            if (!results.length) {

                return res.status(404).json({
                    success: false,
                    message: "Partnership not found"
                });

            }


            res.json({
                success: true,
                partnership: results[0]
            });

        }
    );

});


/* =====================================================
   CREATE PARTNERSHIP
   ===================================================== */

router.post("/", requireAdmin, function (req, res) {

    const {
        partner_name,
        partner_type,
        description,
        logo_url,
        website_url,
        contact_email,
        contact_phone,
        status
    } = req.body;


    if (!partner_name || !partner_type) {

        return res.status(400).json({
            success: false,
            message:
                "Partner name and partner type are required"
        });

    }


    const sql = `
        INSERT INTO partnerships
        (
            partner_name,
            partner_type,
            description,
            logo_url,
            website_url,
            contact_email,
            contact_phone,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            partner_name,
            partner_type,
            description || null,
            logo_url || null,
            website_url || null,
            contact_email || null,
            contact_phone || null,
            status || "Active"
        ],
        function (err, result) {

            if (err) {

                console.error(
                    "Failed to create partnership:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to create partnership"
                });

            }


            res.status(201).json({
                success: true,
                message:
                    "Partnership created successfully.",
                partnershipId: result.insertId
            });

        }
    );

});


/* =====================================================
   UPDATE PARTNERSHIP
   ===================================================== */

router.put("/:id", requireAdmin, function (req, res) {

    const partnershipId =
        req.params.id;


    const {
        partner_name,
        partner_type,
        description,
        logo_url,
        website_url,
        contact_email,
        contact_phone,
        status
    } = req.body;


    if (!partner_name || !partner_type) {

        return res.status(400).json({
            success: false,
            message:
                "Partner name and partner type are required"
        });

    }


    const sql = `
        UPDATE partnerships
        SET
            partner_name = ?,
            partner_type = ?,
            description = ?,
            logo_url = ?,
            website_url = ?,
            contact_email = ?,
            contact_phone = ?,
            status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            partner_name,
            partner_type,
            description || null,
            logo_url || null,
            website_url || null,
            contact_email || null,
            contact_phone || null,
            status || "Active",
            partnershipId
        ],
        function (err, result) {

            if (err) {

                console.error(
                    "Failed to update partnership:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to update partnership"
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Partnership not found"
                });

            }


            res.json({
                success: true,
                message:
                    "Partnership updated successfully."
            });

        }
    );

});


/* =====================================================
   DELETE PARTNERSHIP
   ===================================================== */

router.delete("/:id", requireAdmin, function (req, res) {

    const partnershipId =
        req.params.id;


    const sql = `
        DELETE FROM partnerships
        WHERE id = ?
    `;


    db.query(
        sql,
        [partnershipId],
        function (err, result) {

            if (err) {

                console.error(
                    "Failed to delete partnership:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete partnership"
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Partnership not found"
                });

            }


            res.json({
                success: true,
                message:
                    "Partnership deleted successfully."
            });

        }
    );

});


module.exports = router;