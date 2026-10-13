const express = require("express");
const router = express.Router();

const db = require("./db");
const requireAdmin = require("./admin-middleware");

const {
    persistUploads,
    sendStoredFile,
    deleteStoredFile
} = require("./file-storage");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =====================================================
   DELETE ONE JOB APPLICATION
   Admin authentication required.
   ===================================================== */

router.delete("/:id", requireAdmin, (req, res) => {

    const applicationId = Number(req.params.id);

    if (
        !Number.isSafeInteger(applicationId) ||
        applicationId < 1
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid job application ID."
        });
    }

    const findSql = `
        SELECT id, cv_path
        FROM job_applications
        WHERE id = ?
    `;

    db.query(findSql, [applicationId], (findErr, rows) => {

        if (findErr) {
            console.error(
                "Failed to find job application for deletion:",
                findErr
            );

            return res.status(500).json({
                success: false,
                message: "Unable to find the job application."
            });
        }

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job application not found."
            });
        }

        const cvPath = rows[0].cv_path;
        const cvFilename = cvPath
            ? path.basename(cvPath)
            : "";

        const deleteSql = `
            DELETE FROM job_applications
            WHERE id = ?
        `;

        db.query(
            deleteSql,
            [applicationId],
            async (deleteErr, result) => {

                if (deleteErr) {
                    console.error(
                        "Failed to delete job application:",
                        deleteErr
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to delete this job application. Check whether another database record depends on it."
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Job application not found."
                    });
                }

                try {
                    if (cvFilename) {
                        await deleteStoredFile(
                            "job-applications",
                            cvFilename
                        );
                    }

                    return res.json({
                        success: true,
                        message:
                            "Job application and its CV deleted successfully."
                    });

                } catch (cleanupError) {

                    console.error(
                        "Application deleted, but CV cleanup failed:",
                        applicationId,
                        cleanupError
                    );

                    return res.json({
                        success: true,
                        message:
                            "Job application deleted, but its CV may need storage cleanup."
                    });
                }
            }
        );
    });
});

/* =====================================================
   CV UPLOAD FOLDER
   ===================================================== */

const uploadDirectory = path.join(
    __dirname,
    "uploads",
    "job-applications"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}


/* =====================================================
   MULTER STORAGE
   ===================================================== */

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
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


/* =====================================================
   FILE FILTER
   ===================================================== */

const upload = multer({

    storage: storage,

    fileFilter: function (req, file, cb) {

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowedTypes.includes(file.mimetype)) {

            return cb(
                new Error(
                    "Only PDF, DOC and DOCX CV files are allowed."
                )
            );

        }

        cb(null, true);
    },

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


/* =====================================================
   GET ALL JOB APPLICATIONS
   ===================================================== */

router.get("/", requireAdmin, (req, res) => {

    const sql = `
        SELECT
            id,
            opportunity_id,
            job_title,
            full_name,
            email,
            phone,
            education,
            experience,
            cover_letter,
            cv_path,
            status,
            created_at
        FROM job_applications
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Failed to fetch job applications:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to load job applications."
            });
        }

        res.json({
            success: true,
            applications: results
        });

    });

});



/* =====================================================
   CREATE JOB APPLICATION
   ===================================================== */

router.post(
    "/",
    upload.single("cv"),
    persistUploads(() => "job-applications"),
    (req, res) => {

        const {
            opportunityId,
            jobTitle,
            fullName,
            email,
            phone,
            education,
            experience,
            coverLetter
        } = req.body;


        /* ---------------------------------------------
           VALIDATION
           --------------------------------------------- */

        if (
            !jobTitle ||
            !fullName ||
            !email ||
            !phone ||
            !education
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Job title, full name, email, phone and education are required."
            });

        }


        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please upload your CV."
            });

        }


        /* ---------------------------------------------
           CV PATH
           --------------------------------------------- */

        const cvPath =
            "/job-application-cv/" +
            req.file.filename;


        /* ---------------------------------------------
           INSERT APPLICATION
           --------------------------------------------- */

        const sql = `
            INSERT INTO job_applications (
                opportunity_id,
                job_title,
                full_name,
                email,
                phone,
                education,
                experience,
                cover_letter,
                cv_path,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
        `;


        const values = [
            opportunityId || null,
            jobTitle.trim(),
            fullName.trim(),
            email.trim(),
            phone.trim(),
            education.trim(),
            experience ? experience.trim() : null,
            coverLetter ? coverLetter.trim() : null,
            cvPath
        ];


        db.query(
            sql,
            values,
            (err, result) => {

                if (err) {

                    console.error(
                        "Failed to create job application:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to submit job application."
                    });

                }


                res.status(201).json({

                    success: true,

                    message:
                        "Job application submitted successfully.",

                    applicationId:
                        result.insertId

                });

            }
        );

    }
);


/* =====================================================
   UPDATE APPLICATION STATUS
   ===================================================== */

router.patch("/:id/status", requireAdmin, (req, res) => {

    const applicationId = req.params.id;

    const { status } = req.body;


    const allowedStatuses = [
        "Pending",
        "Shortlisted",
        "Rejected",
        "Hired"
    ];


    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid application status."
        });

    }


    const sql = `
        UPDATE job_applications
        SET status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [status, applicationId],
        (err, result) => {

            if (err) {

                console.error(
                    "Failed to update application status:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to update application status."
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Job application not found."
                });

            }


            res.json({

                success: true,

                message:
                    `Application status changed to ${status}.`,

                status: status

            });

        }
    );

});


/* =====================================================
   DOWNLOAD / VIEW CV
   ===================================================== */

router.get("/cv/:filename", requireAdmin, (req, res) => {
    sendStoredFile(res, "job-applications", req.params.filename, "CV file not found.")
        .catch((err) => {
            console.error("Failed to send CV:", err);
            res.status(500).json({ success: false, message: "Unable to load CV." });
        });
});

/* =====================================================
   GET ONE JOB APPLICATION
   ===================================================== */

router.get("/:id", requireAdmin, (req, res) => {

    const applicationId = req.params.id;

    const sql = `
        SELECT
            id,
            opportunity_id,
            job_title,
            full_name,
            email,
            phone,
            education,
            experience,
            cover_letter,
            cv_path,
            status,
            created_at
        FROM job_applications
        WHERE id = ?
    `;

    db.query(
        sql,
        [applicationId],
        (err, results) => {

            if (err) {

                console.error(
                    "Failed to fetch application:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Unable to load application."
                });
            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Job application not found."
                });

            }

            res.json({
                success: true,
                application: results[0]
            });

        }
    );

});


/* =====================================================
   ERROR HANDLER
   ===================================================== */

router.use((err, req, res, next) => {

    console.error(
        "Job application error:",
        err.message
    );

    res.status(400).json({
        success: false,
        message: err.message ||
            "Job application request failed."
    });

});


module.exports = router;