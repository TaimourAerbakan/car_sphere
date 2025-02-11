const db = require('../config/db');

// ✅ Get user by ID
const User = {
    getById: (id, callback) => {
        db.query("SELECT id, name, email, phone, city, role FROM users WHERE id = ?", [id], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]); // Return first result
        });
    },

    // ✅ Update user profile
    update: (id, userData, callback) => {
        const sql = "UPDATE users SET name = ?, phone = ?, city = ? WHERE id = ?";
        const values = [userData.name, userData.phone, userData.city, id];

        db.query(sql, values, callback);
    }
};

module.exports = User;
