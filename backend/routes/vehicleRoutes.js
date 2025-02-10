const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const authMiddleWare = require('../middleware/authMiddleware');

// POST: Add new Vehicle listing (Authenticated User)
router.post('/', authMiddleWare, (req, res) => {
    console.log(req.user.id); // User ID from token (for debugging purposes)
    const { title, price, description, location, images } = req.body;
    const user_id = req.user.id; // Get user ID from JWT token

    if(!title || !price || !description || !location || !images) {
        return res.status(400).json({ error: 'All fields are required'})
    }

    const vehicleData = {user_id, title, price, description, location, images}

    Vehicle.create(vehicleData, (err, result) => {
        if(err) return res.status(500).json({ error: err.message })
            res.json({ message: 'Vehicle added successfully', vehicleId: result.InsertId })
    })
});

// GET: Fetch all Vehicle listings
router.get('/', (req, res) => {
    Vehicle.getAll((err, results) => {
        if(err) return res.status(500).json({ error: err.message })
        res.json(results)
    })
});

// GET: Fetch a single Vehicle by ID
router.get('/:id', (req, res) => {
    Vehicle.getById(req.params.id, (err, result) => {
        if(err) return res.status(500).json({ error: err.message })
        if(!result) return res.status(404).json({ error: 'Vehicle not found'})
        res.json(result)
    })
});

// PUT: Update a Vehicle listing (Authenticated User)
router.put('/:id', authMiddleWare, (req, res) => {
    const { title, price, description, location, images } = req.body;
    const user_id = req.user.id; // Get user ID from JWT token

    Vehicle.getById(req.params.id, (err, foundVehicle) => {
        if(err) return res.status(500).json({ message: err.message})
        if(!foundVehicle) return res.status(404).json({ message: 'Vehicle not found'})

        //Ensure only the owner can update
        if(foundVehicle.user_id!== user_id) {
            return res.status(403).json({ message: 'You can only update your own listings'})
        }

        const vehicelData = { title, price, description, location, images, user_id }
        Vehicle.update(req.params.id, vehicelData, (err, result) => {
            if(err) return res.status(500).json({ message: err.message })
            res.json({ message: 'Vehicle updated successfully'})
        })
    })
});

// DELETE: Delete a Vehicle listing (Authenticated User)
router.delete('/:id', authMiddleWare, (req, res) => {
    const user_id = req.user.id

    Vehicle.getById(req.params.id, (err, foundVehicle) => {
        if(err) return res.status(500).json({ message: err.message})
        if(!foundVehicle) return res.status(404).json({ message: 'Vehicle not found'})

        //Ensure only the owner can delete
        if(foundVehicle.user_id!== user_id) {
            return res.status(403).json({ message: 'You can only delete your own listings'})
        }

        Vehicle.delete(req.params.id, user_id, (err, result) => {
            if(err) return res.status(500).json({ message: err.message })
            res.json({ message: 'Vehicle deleted successfully'})
        })
    })
});

module.exports = router;