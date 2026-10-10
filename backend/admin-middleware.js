function requireAdmin(req, res, next) {

    if (!req.session.admin) {

        return res.status(401).json({
            success: false,
            message: "Admin authentication required."
        });

    }

    next();
}


module.exports = requireAdmin;