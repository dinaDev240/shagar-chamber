/* =====================================================
   SHAGAR CHAMBER
   CONTACT MESSAGES API
   ===================================================== */

const express = require("express");
const router = express.Router();

const db = require("./db");
const requireAdmin = require("./admin-middleware");

/* =====================================================
   SUBMIT CONTACT MESSAGE
   ===================================================== */

router.get("/", requireAdmin, (req, res) => {

    const {
        fullName,
        email,
        phone,
        subject,
        message
    } = req.body;


    /* =================================================
       BASIC VALIDATION
       ================================================= */

    if (!fullName || !email || !message) {

        return res.status(400).json({
            success: false,
            message: "Full name, email and message are required."
        });

    }


    /* =================================================
       INSERT MESSAGE INTO DATABASE
       ================================================= */

    const sql = `
        INSERT INTO contact_messages
        (
            full_name,
            email,
            phone,
            subject,
            message
        )
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            fullName,
            email,
            phone || null,
            subject || null,
            message
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Contact message insert failed:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to save contact message."
                });

            }


            res.status(201).json({

                success: true,

                message:
                    "Your message has been sent successfully.",

                messageId:
                    result.insertId

            });

        }
    );

});


/* =====================================================
   GET ALL CONTACT MESSAGES
   ===================================================== */

router.get("/", (req, res) => {

    const sql = `
        SELECT *
        FROM contact_messages
        ORDER BY created_at DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Failed to load contact messages:",
                err
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to load contact messages."

            });

        }


        res.json({

            success: true,

            messages: results

        });

    });

});


/* =====================================================
   UPDATE MESSAGE STATUS
   ===================================================== */

router.patch("/:id/status", requireAdmin, (req, res) => {

    const { status } = req.body;


    const allowedStatuses = [
        "New",
        "Read",
        "Replied"
    ];


    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid message status."

        });

    }


    const sql = `
        UPDATE contact_messages
        SET status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [status, req.params.id],
        (err, result) => {

            if (err) {

                console.error(
                    "Failed to update message status:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to update message status."

                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Contact message not found."

                });

            }


            res.json({

                success: true,

                message:
                    "Message status updated successfully."

            });

        }
    );

});


/* =====================================================
   DELETE CONTACT MESSAGE
   ===================================================== */

router.delete("/:id", requireAdmin, (req, res) => {

    const sql = `
        DELETE FROM contact_messages
        WHERE id = ?
    `;


    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {

                console.error(
                    "Failed to delete contact message:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to delete contact message."

                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Contact message not found."

                });

            }


            res.json({

                success: true,

                message:
                    "Contact message deleted successfully."

            });

        }
    );

});


module.exports = router;