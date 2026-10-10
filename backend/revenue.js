const express = require("express");
const router = express.Router();

const db = require("./db");
const requireAdmin = require("./admin-middleware");


/* =====================================================
   REVENUE MANAGEMENT
   ===================================================== */


/* =====================================================
   GET ALL REVENUE
   ===================================================== */

router.get("/", requireAdmin, (req, res) => {

    const sql = `
        SELECT
            id,
            revenue_type,
            description,
            payer_name,
            amount,
            payment_method,
            payment_status,
            payment_date,
            reference,
            notes,
            created_at
        FROM revenue
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Failed to fetch revenue:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to load revenue records."
            });

        }

        res.json({
            success: true,
            revenue: results
        });

    });

});


/* =====================================================
   CREATE REVENUE
   ===================================================== */

router.post("/", requireAdmin, (req, res) => {

    const {
        revenueType,
        description,
        payerName,
        amount,
        paymentMethod,
        paymentStatus,
        paymentDate,
        reference,
        notes
    } = req.body;


    /* =================================================
       VALIDATION
       ================================================= */

    if (
        !revenueType ||
        !description ||
        !payerName ||
        !amount ||
        !paymentMethod
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Revenue type, description, payer name, amount and payment method are required."
        });

    }


    /* =================================================
       ALLOWED REVENUE TYPES
       ================================================= */

    const allowedRevenueTypes = [
        "Membership",
        "Partnership",
        "Expo",
        "Event",
        "Other"
    ];

    if (!allowedRevenueTypes.includes(revenueType)) {

        return res.status(400).json({
            success: false,
            message: "Invalid revenue type."
        });

    }


    /* =================================================
       PAYMENT STATUS
       ================================================= */

    const allowedPaymentStatuses = [
        "Pending",
        "Paid",
        "Failed"
    ];

    const finalPaymentStatus =
        paymentStatus &&
        allowedPaymentStatuses.includes(paymentStatus)
            ? paymentStatus
            : "Pending";


    /* =================================================
       DATABASE QUERY
       ================================================= */

    const sql = `
        INSERT INTO revenue (
            revenue_type,
            description,
            payer_name,
            amount,
            payment_method,
            payment_status,
            payment_date,
            reference,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const values = [
        revenueType.trim(),
        description.trim(),
        payerName.trim(),
        amount,
        paymentMethod.trim(),
        finalPaymentStatus,
        paymentDate || null,
        reference ? reference.trim() : null,
        notes ? notes.trim() : null
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error(
                "Failed to create revenue:",
                err
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to create revenue record."
            });

        }


        res.status(201).json({
            success: true,
            message:
                "Revenue record created successfully.",
            revenue_id: result.insertId
        });

    });

});


module.exports = router;