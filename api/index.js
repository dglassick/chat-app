import express from 'express';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { WebSocketServer } from 'ws';
import { UserModel } from './models/User.js';
import cors from 'cors';

config();

connect(process.env.MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
);

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.get('/profile', (req, res) => {
    const token = req.cookies?.token;

    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData);
        });
    } else {
        res.status(401).json('no token');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await UserModel.findOne({ username });

    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (passOk) {
            jwt.sign({ id: foundUser._id, username }, jwtSecret, {}, (err, token) => {
                if (err) throw err;

                res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                    id: foundUser._id,
                });
            });
        }
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await UserModel.create({ username, password: hashedPassword });
        jwt.sign({ id: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err;

            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: createdUser._id,
            });
        });
    } catch (error) {
        if (error) throw error;
    }
});

const server = app.listen(4040);

const wss = new WebSocketServer({ server });

wss.on('connection', (connection, req) => {
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));

        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];
            if (token) {
                jwt.verify(token, jwtSecret, {}, (err, res) => {
                    if (err) throw err;

                    const { id, username } = res;

                    connection.id = id;
                    connection.username = username;
                });
            }
        }
    }
    [...wss.clients].forEach(client => {
        client.send(
            JSON.stringify({
                online: [...wss.clients].map(c => ({ id: c.id, username: c.username })),
            })
        );
    });
});
