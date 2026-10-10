const express = require("express");
const router = express.Router();

const db = require("./db");
const requireAdmin = require("./admin-middleware");

/* =====================================================
   GET ALL EVENTS
   ===================================================== */

router.get("/", (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            event_type,
            description,
            event_date,
            event_time,
            location,
            image_url,
            contact_email,
            contact_phone,
            status,
            created_at
        FROM events
        ORDER BY event_date ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Error fetching events:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch events."
            });
        }

        res.json({
            success: true,
            events: results
        });

    });

});


/* =====================================================
   GET ONE EVENT
   ===================================================== */

router.get("/:id", (req, res) => {

    const eventId = req.params.id;

    const sql = `
        SELECT *
        FROM events
        WHERE id = ?
    `;

    db.query(sql, [eventId], (err, results) => {

        if (err) {

            console.error("Error fetching event:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch event."
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }

        res.json({
            success: true,
            event: results[0]
        });

    });

});


/* =====================================================
   CREATE EVENT
   ===================================================== */

router.post("/", requireAdmin, (req, res) => {

    const {
        title,
        eventType,
        description,
        eventDate,
        eventTime,
        location,
        imageUrl,
        contactEmail,
        contactPhone,
        status
    } = req.body;


    /* -----------------------------
       VALIDATION
       ----------------------------- */

    if (!title || !eventType || !eventDate) {

        return res.status(400).json({
            success: false,
            message: "Title, event type and event date are required."
        });
    }


    const allowedStatuses = [
        "Upcoming",
        "Completed",
        "Cancelled"
    ];

    const finalStatus =
        allowedStatuses.includes(status)
            ? status
            : "Upcoming";


    /* -----------------------------
       INSERT EVENT
       ----------------------------- */

    const sql = `
        INSERT INTO events (
            title,
            event_type,
            description,
            event_date,
            event_time,
            location,
            image_url,
            contact_email,
            contact_phone,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title,
        eventType,
        description || null,
        eventDate,
        eventTime || null,
        location || null,
        imageUrl || null,
        contactEmail || null,
        contactPhone || null,
        finalStatus
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error("Error creating event:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to create event."
            });
        }

        res.status(201).json({
            success: true,
            message: "Event created successfully.",
            eventId: result.insertId
        });

    });

});


/* =====================================================
   UPDATE EVENT
   ===================================================== */

router.put("/:id", requireAdmin, (req, res) => {

    const eventId = req.params.id;

    const {
        title,
        eventType,
        description,
        eventDate,
        eventTime,
        location,
        imageUrl,
        contactEmail,
        contactPhone,
        status
    } = req.body;


    if (!title || !eventType || !eventDate) {

        return res.status(400).json({
            success: false,
            message: "Title, event type and event date are required."
        });
    }


    const allowedStatuses = [
        "Upcoming",
        "Completed",
        "Cancelled"
    ];

    const finalStatus =
        allowedStatuses.includes(status)
            ? status
            : "Upcoming";


    const sql = `
        UPDATE events
        SET
            title = ?,
            event_type = ?,
            description = ?,
            event_date = ?,
            event_time = ?,
            location = ?,
            image_url = ?,
            contact_email = ?,
            contact_phone = ?,
            status = ?
        WHERE id = ?
    `;


    const values = [
        title,
        eventType,
        description || null,
        eventDate,
        eventTime || null,
        location || null,
        imageUrl || null,
        contactEmail || null,
        contactPhone || null,
        finalStatus,
        eventId
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error("Error updating event:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to update event."
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }


        res.json({
            success: true,
            message: "Event updated successfully."
        });

    });

});


/* =====================================================
   DELETE EVENT
   ===================================================== */

router.delete("/:id", requireAdmin, (req, res) => {

    const eventId = req.params.id;

    const sql = `
        DELETE FROM events
        WHERE id = ?
    `;

    db.query(sql, [eventId], (err, result) => {

        if (err) {

            console.error("Error deleting event:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete event."
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }


        res.json({
            success: true,
            message: "Event deleted successfully."
        });

    });

});


/* =====================================================
   EXPORT ROUTER
   ===================================================== */

module.exports = router;