const db = require('../config/db')
const Vehicle = {
    create: (vehicleData, callback) => {
        const sql = `INSERT INTO vehicles (user_id, title, price, description, location, images) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            vehicleData.user_id,
            vehicleData.title,
            vehicleData.price,
            vehicleData.description,
            vehicleData.location,
            JSON.stringify(vehicleData.images) // Store images as JSON array
        ];
        db.query(sql, values, callback);
    },

    getAll: (callback) => {
        db.query("SELECT * FROM vehicles", callback)
    },

    getById: (id, callback) => {
        db.query("SELECT * FROM vehicles WHERE id = ?", [id], (err, results) => {
            if (err) return callback(err, null)
            if (results.length === 0) return callback(null, null)
            callback(null, results[0])
        })
    },

    update: (id, vehicleData, callback) => {
        const sql = `
            UPDATE vehicles 
            SET title = ?, price = ?, description = ?, location = ?, images = ? 
            WHERE id = ? AND user_id = ?
        `;
        const values = [
            vehicleData.title,
            vehicleData.price,
            vehicleData.description,
            vehicleData.location,
            JSON.stringify(vehicleData.images),
            id,
            vehicleData.user_id
        ];
        db.query(sql, values, callback);
    },

    delete: (id, user_id, callback) => {
        db.query("DELETE FROM vehicles WHERE id =?", [id, user_id], callback)
    }

}

module.exports = Vehicle