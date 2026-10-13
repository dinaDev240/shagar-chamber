const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const db = require("./db");
const requireAdmin = require("./admin-middleware");
const { persistUploads, sendStoredFile } = require("./file-storage");
const uploadDirs = [
    path.join(__dirname, "uploads", "national-ids"),
    path.join(__dirname, "uploads", "payment-receipts")
];

uploadDirs.forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
});
const multer = require("multer");

    
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "paymentReceipt") {
            cb(null, path.join(__dirname, "uploads", "payment-receipts"));
        } else {
            cb(null, path.join(__dirname, "uploads", "national-ids"));
        }
    },


    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only JPG, PNG and WEBP images are allowed."
                )
            );
        }
    }
});
// Register a new member
router.post(
    "/register",
    upload.fields([
        {
            name: "nationalIdFront",
            maxCount: 1
        },
        {
            name: "nationalIdBack",
            maxCount: 1
        },
        {
            name: "paymentReceipt",
            maxCount: 1
        }
    ]),
    persistUploads((file) =>
        file.fieldname === "paymentReceipt" ? "payment-receipts" : "national-ids"
    ),
    (req, res) => {
   const {
    fullName,
    email,
    phone,
    tin,
    businessName,
    businessSector,
    businessAddress,
    businessDescription,
    membershipType,
    businessCategory,
    paymentMethod
} = req.body;

const nationalIdFront =
    req.files?.nationalIdFront?.[0];

const nationalIdBack =
    req.files?.nationalIdBack?.[0];
    const paymentReceipt =
    req.files?.paymentReceipt?.[0];
    // Required field validation
    if (
    !fullName ||
    !email ||
    !phone ||
    !nationalIdFront ||
    !nationalIdBack ||
    !businessName ||
    !businessSector ||
    !businessAddress ||
    !businessDescription ||
    !membershipType ||
    !businessCategory ||
    !paymentMethod ||
    !paymentReceipt
) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all required fields."
        });
    }

  // Set membership fee automatically
let membershipFee;

if (membershipType === "member") {

    if (businessCategory === "trader") {

        membershipFee = 1000;

    } else if (businessCategory === "plc") {

        membershipFee = 5000;

    } else {

        return res.status(400).json({
            success: false,
            message: "Invalid business category."
        });

    }

} else if (membershipType === "partnership") {

    // Keep the existing partnership fee unchanged
    membershipFee = 120;

} else {

    return res.status(400).json({
        success: false,
        message: "Invalid membership type."
    });

}

    // Convert frontend membership type to database value
    const databaseMembershipType =
        membershipType === "member"
            ? "Member"
            : "Partnership";

   // Payment is pending until payment is verified by the system
const databasePaymentStatus = "Pending";

  const sql = `
    INSERT INTO members (
        full_name,
        email,
        phone,
        national_id,
        national_id_front,
        national_id_back,
        tin_number,
        business_name,
        business_type,
        business_category,
        address,
        business_description,
        membership_type,
        membership_fee,
        payment_status,
        payment_method,
        payment_receipt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
   const values = [
    fullName,
    email,
    phone,
    null,
    nationalIdFront.filename,
    nationalIdBack.filename,
    tin || null,
    businessName,
    businessSector,
    businessCategory,
    businessAddress,
    businessDescription,
    databaseMembershipType,
    membershipFee,
    databasePaymentStatus,
    paymentMethod,
    paymentReceipt.filename
];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Member registration failed:", err);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "This National ID is already registered."
                });
            }

            return res.status(500).json({
                success: false,
                message: "Unable to register membership application."
            });
        }

        res.status(201).json({
            success: true,
            message: "Membership application submitted successfully!",
            member_id: result.insertId,
            membership_type: databaseMembershipType,
            membership_fee: membershipFee,
            payment_status: databasePaymentStatus,
            status: "Pending"
        });
    });
});
// =====================================================
// GET ALL MEMBERSHIP APPLICATIONS
// =====================================================

router.get("/", requireAdmin, (req, res) => {

   const sql = `
    SELECT
        id,
        full_name,
        email,
        phone,
        national_id_front,
        national_id_back,
        tin_number,
        business_name,
        business_type,
        business_category,
        address,
        business_description,
        membership_type,
        membership_fee,
        payment_status,
        payment_method,
        payment_receipt,
        status,
        created_at
    FROM members
    ORDER BY created_at DESC
`;
    db.query(sql, (err, results) => {

        if (err) {

            console.error("Failed to load members:", err);

            return res.status(500).json({
                success: false,
                message: "Unable to load membership applications."
            });
        }

        res.json({
            success: true,
            members: results
        });

    });

});
// =====================================================
// GET NATIONAL ID IMAGE
// =====================================================

router.get("/id-image/:filename", requireAdmin, (req, res) => {
    sendStoredFile(res, "national-ids", req.params.filename, "National ID image not found.")
        .catch((err) => {
            console.error("Failed to send ID image:", err);
            res.status(500).json({ success: false, message: "Unable to load image." });
        });
});

router.get("/payment-receipt/:filename", requireAdmin, (req, res) => {
    sendStoredFile(res, "payment-receipts", req.params.filename, "Payment receipt not found.")
        .catch((err) => {
            console.error("Failed to send receipt:", err);
            res.status(500).json({ success: false, message: "Unable to load image." });
        });
});
// =====================================================
// UPDATE MEMBERSHIP APPLICATION STATUS
// =====================================================

router.patch("/:id/status", requireAdmin, (req, res) => {

    const memberId = req.params.id;
    const { status } = req.body;

    // Only these statuses are allowed
    const allowedStatuses = [
        "Pending",
        "Active",
        "Rejected"
    ];

    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid membership status."
        });

    }

    // =====================================================
    // APPROVAL REQUIRES VERIFIED PAYMENT
    // =====================================================

    if (status === "Active") {

        const checkPaymentSql = `
            SELECT payment_status
            FROM members
            WHERE id = ?
        `;

        db.query(
            checkPaymentSql,
            [memberId],
            (err, results) => {

                if (err) {

                    console.error(
                        "Failed to check payment status:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to verify payment status."
                    });

                }

                if (results.length === 0) {

                    return res.status(404).json({
                        success: false,
                        message:
                            "Membership application not found."
                    });

                }

                const paymentStatus =
                    results[0].payment_status;

                if (paymentStatus !== "Paid") {

                    return res.status(400).json({
                        success: false,
                        message:
                            "This membership cannot be approved until the payment has been verified."
                    });

                }

                updateMembershipStatus();
            }
        );

    } else {

        updateMembershipStatus();

    }

    // =====================================================
    // UPDATE MEMBERSHIP STATUS
    // =====================================================

    function updateMembershipStatus() {

        const sql = `
            UPDATE members
            SET status = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [status, memberId],
            (err, result) => {

                if (err) {

                    console.error(
                        "Failed to update membership status:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to update membership status."
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        success: false,
                        message:
                            "Membership application not found."
                    });

                }

                res.json({
                    success: true,
                    message:
                        `Membership application ${status.toLowerCase()} successfully.`,
                    status: status
                });

            }
        );

    }

});
// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

router.patch("/:id/payment-status", requireAdmin, (req, res) => {

    const memberId = req.params.id;
    const { paymentStatus } = req.body;

    const allowedPaymentStatuses = [
        "Pending",
        "Paid",
        "Failed"
    ];

    if (!allowedPaymentStatuses.includes(paymentStatus)) {

        return res.status(400).json({
            success: false,
            message: "Invalid payment status."
        });

    }

    const sql = `
        UPDATE members
        SET payment_status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [paymentStatus, memberId],
        (err, result) => {

            if (err) {

                console.error(
                    "Failed to update payment status:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to update payment status."
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Membership application not found."
                });

            }

            res.json({
                success: true,
                message:
                    `Payment status changed to ${paymentStatus}.`,
                payment_status: paymentStatus
            });

        }
    );

});
module.exports = router;