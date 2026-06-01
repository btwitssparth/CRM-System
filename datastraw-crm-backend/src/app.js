import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
//import ticketRouter from './src/routes/ticket.routes.js';

// Declare routes
//app.use('/api/tickets', ticketRouter);

export { app };