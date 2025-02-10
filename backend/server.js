const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes")

dotenv.config()
const app = express();


app.use(express.json());
app.use(cors());

// use auth routes
app.use("/api/auth", authRoutes);

// use vehicle routes
app.use("/api/vehicles", vehicleRoutes);
app.get("/", (req, res) => {
    res.send("API is running")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))