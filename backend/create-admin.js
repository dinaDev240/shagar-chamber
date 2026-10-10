const bcrypt = require("bcryptjs");
const db = require("./db");

async function createAdmin() {

    const fullName = "Shagar Chamber Admin";
    const email = "admin@shagarchamber.com";
    const password = "Admin@12345";

    try {

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO admin_users
            (
                full_name,
                email,
                password_hash,
                role,
                status
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            fullName,
            email,
            passwordHash,
            "admin",
            "Active"
        ];

        db.query(sql, values, (err, result) => {

            if (err) {

                console.error(
                    "Failed to create admin:",
                    err
                );

                return;
            }

            console.log(
                "Admin account created successfully!"
            );

            console.log(
                "Admin ID:",
                result.insertId
            );

            console.log(
                "Email:",
                email
            );

            console.log(
                "Password:",
                password
            );

            process.exit(0);
        });

    } catch (error) {

        console.error(
            "Error creating admin:",
            error
        );

        process.exit(1);
    }
}

createAdmin();