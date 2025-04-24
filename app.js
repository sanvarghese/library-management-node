import './helpers/errors/httpError.js';
import './helpers/errors/httpError.js'

// Packages Imports
import createError from 'http-errors'

import express from 'express';
import path from 'path';
// import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// File Imports
// import testRoutes from './api/testApis.js';
import userApis from './api/todoApis.js';
import { errorHandler } from './middlewares/error/handleError.js';
import connectDB from './config/db.js';
import todoApis from './api/todoApis.js';
// import connectDB from './config/connectDb.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Connect Database
connectDB();

// CORS Configuration
const corsOptions = {
    // origin: process.env.CLIENT_URL,
    origin: "http://localhost:3000", // Allow frontend

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define Static Files Directory (if needed)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'uploads')));

// API Routes
app.get("/", (req, res) => {
    res.send("API IS RUNNING...");
});

// app.use("/api/test", testRoutes);
app.use("/api/", todoApis);

// Middleware for Handling 404
app.use(function (req, res, next) {
    next(createError(404));
});


// error handler
app.use(errorHandler);

// Start the Server
app.listen(port, () => console.log(`Server running on port ${port}`));
