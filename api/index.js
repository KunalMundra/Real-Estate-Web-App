import express from 'express';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors'; // Import cors using ES module syntax
dotenv.config();


import sequelize from './models/db.js';
sequelize.authenticate()
    .then(() => {
        console.log('Connected to MySQL database');
        // Optionally sync models
        return sequelize.sync();
    })
    .catch((err) => {
        console.error('Unable to connect to MySQL:', err);
    });

const __dirname = path.resolve();

const app = express();


app.listen(3010, () => {
    console.log("Server is running on port 3010");
})
app.use(cors());


app.use(express.json())
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})