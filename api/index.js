import express from 'express';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import jwt from 'jsonwebtoken';
import { UserModel } from './models/User.js';
import cors from 'cors';

config();

connect(process.env.MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
);

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const createdUser = await UserModel.create({ username, password });
        jwt.sign({ userId: createdUser._id }, jwtSecret, {}, (err, token) => {
            if (err) throw err;

            res.cookie('token', token).status(201).json({
                _id: createdUser._id,
            });
        });
        res.json();
    } catch (error) {
        if (error) throw error;
    }
});

app.listen(4040);
