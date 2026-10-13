// =====================================================
// PERMANENT FILE STORAGE
// -----------------------------------------------------
// Online hosts (Render, Railway, etc.) wipe the server's
// disk on every restart/redeploy, so uploaded photos saved
// only in backend/uploads disappear and the admin dashboard
// shows broken images. This module copies every upload to a
// private Supabase Storage bucket and serves files from
// there when the local copy is missing.
// =====================================================
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const BUCKET_NAME = process.env.SUPABASE_BUCKET || "shagar-member-documents";

const supabase =
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
        ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
              auth: { persistSession: false }
          })
        : null;

if (!supabase) {
    console.warn(
        "WARNING: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set. Uploads are stored on local disk only and will be lost when the host restarts."
    );
} else {
    // Make sure the private bucket exists
    supabase.storage.getBucket(BUCKET_NAME).then(({ error }) => {
        if (error) {
            supabase.storage
                .createBucket(BUCKET_NAME, { public: false })
                .then(({ error: createError }) => {
                    if (createError) console.error("Could not create storage bucket:", createError.message);
                    else console.log("Created storage bucket:", BUCKET_NAME);
                });
        }
    });
}

const MIME_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

function contentTypeFor(filename) {
    return MIME_TYPES[path.extname(filename).toLowerCase()] || "application/octet-stream";
}

// Express middleware: run AFTER multer. Uploads every received
// file to Supabase under "<folder>/<filename>".
// folderFor(file) returns the folder name for a given file.
function persistUploads(folderFor) {
    return async function (req, res, next) {
        if (!supabase) return next();

        const files = [];
        if (req.file) files.push(req.file);
        if (req.files) {
            Object.values(req.files).forEach((list) => {
                (Array.isArray(list) ? list : [list]).forEach((f) => files.push(f));
            });
        }

        try {
            for (const file of files) {
                const objectPath = `${folderFor(file)}/${file.filename}`;
                const buffer = fs.readFileSync(file.path);
                const { error } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(objectPath, buffer, {
                        contentType: file.mimetype || contentTypeFor(file.filename),
                        upsert: true
                    });
                if (error) throw error;
            }
            next();
        } catch (err) {
            console.error("Upload to permanent storage failed:", err.message || err);
            res.status(500).json({
                success: false,
                message: "Could not save the uploaded file. Please try again."
            });
        }
    };
}

// Send a stored file: local disk first, then Supabase.
async function sendStoredFile(res, folder, filename, notFoundMessage, inline = true) {
    const safeName = path.basename(filename || "");
    if (!safeName) {
        return res.status(404).json({ success: false, message: notFoundMessage });
    }

    const localPath = path.join(__dirname, "uploads", folder, safeName);
    if (fs.existsSync(localPath)) {
        return res.sendFile(localPath, {
            headers: inline ? { "Content-Disposition": "inline" } : {}
        });
    }

    if (supabase) {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .download(`${folder}/${safeName}`);
        if (!error && data) {
            const buffer = Buffer.from(await data.arrayBuffer());
            res.setHeader("Content-Type", contentTypeFor(safeName));
            res.setHeader("Cache-Control", "private, max-age=3600");
            if (inline) res.setHeader("Content-Disposition", "inline");
            return res.send(buffer);
        }
    }

    return res.status(404).json({ success: false, message: notFoundMessage });
}

module.exports = { persistUploads, sendStoredFile };
