require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const connectDB = require("./config/db");

// middleware to handle cors
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongoDB connection
connectDB();

// nft routes
app.use('/api/v1/collections', collectionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});



