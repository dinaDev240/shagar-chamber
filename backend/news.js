const express = require("express");
const router = express.Router();

const db = require("./db");
const requireAdmin = require("./admin-middleware");

/* =====================================================
   GET ALL NEWS
   ===================================================== */

router.get("/", (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            category,
            image_url,
            excerpt,
            content,
            author,
            status,
            published_at,
            created_at
        FROM news
        ORDER BY published_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Failed to fetch news:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to load news."
            });

        }

        res.json({
            success: true,
            news: results
        });

    });

});


/* =====================================================
   GET ONE NEWS ARTICLE
   ===================================================== */

router.get("/:id", (req, res) => {

    const newsId = req.params.id;

    const sql = `
        SELECT *
        FROM news
        WHERE id = ?
    `;

    db.query(sql, [newsId], (err, results) => {

        if (err) {

            console.error(
                "Failed to fetch news article:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to load news article."
            });

        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "News article not found."
            });

        }

        res.json({
            success: true,
            news: results[0]
        });

    });

});


/* =====================================================
   CREATE NEWS
   ===================================================== */

router.post("/", requireAdmin, (req, res) => {

    const {
        title,
        category,
        imageUrl,
        excerpt,
        content,
        author,
        status
    } = req.body;


    if (!title || !category || !content) {

        return res.status(400).json({
            success: false,
            message: "Title, category and content are required."
        });

    }


    const newsStatus =
        status === "Draft"
            ? "Draft"
            : "Published";


    const sql = `
        INSERT INTO news (
            title,
            category,
            image_url,
            excerpt,
            content,
            author,
            status,
            published_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const publishedAt =
        newsStatus === "Published"
            ? new Date()
            : null;


    const values = [
        title.trim(),
        category.trim(),
        imageUrl ? imageUrl.trim() : null,
        excerpt ? excerpt.trim() : null,
        content.trim(),
        author ? author.trim() : null,
        newsStatus,
        publishedAt
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error(
                "Failed to create news:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to create news article."
            });

        }


        res.status(201).json({
            success: true,
            message: "News article created successfully.",
            news_id: result.insertId
        });

    });

});


/* =====================================================
   UPDATE NEWS
   ===================================================== */

router.put("/:id", requireAdmin, (req, res) => {

    const newsId = req.params.id;

    const {
        title,
        category,
        imageUrl,
        excerpt,
        content,
        author,
        status
    } = req.body;


    if (!title || !category || !content) {

        return res.status(400).json({
            success: false,
            message: "Title, category and content are required."
        });

    }


    const newsStatus =
        status === "Draft"
            ? "Draft"
            : "Published";


    const sql = `
        UPDATE news
        SET
            title = ?,
            category = ?,
            image_url = ?,
            excerpt = ?,
            content = ?,
            author = ?,
            status = ?,
            published_at = ?
        WHERE id = ?
    `;


    const publishedAt =
        newsStatus === "Published"
            ? new Date()
            : null;


    const values = [
        title.trim(),
        category.trim(),
        imageUrl ? imageUrl.trim() : null,
        excerpt ? excerpt.trim() : null,
        content.trim(),
        author ? author.trim() : null,
        newsStatus,
        publishedAt,
        newsId
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.error(
                "Failed to update news:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to update news article."
            });

        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "News article not found."
            });

        }


        res.json({
            success: true,
            message: "News article updated successfully."
        });

    });

});


/* =====================================================
   DELETE NEWS
   ===================================================== */

router.delete("/:id", requireAdmin, (req, res) => {

    const newsId = req.params.id;

    const sql = `
        DELETE FROM news
        WHERE id = ?
    `;


    db.query(sql, [newsId], (err, result) => {

        if (err) {

            console.error(
                "Failed to delete news:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to delete news article."
            });

        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "News article not found."
            });

        }


        res.json({
            success: true,
            message: "News article deleted successfully."
        });

    });

});


module.exports = router;