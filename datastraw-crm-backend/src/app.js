import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Import routes
import ticketRouter from './routes/ticket.route.js';
import authRouter from './routes/auth.route.js'

// Declare routes
app.use('/api/tickets', ticketRouter);
app.use('/api/auth', authRouter);

export { app };