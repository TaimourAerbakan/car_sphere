const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config()
const app = express();


app.use(express.json());
app.use(cors());

// use auth routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("API is running")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))