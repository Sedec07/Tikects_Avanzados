import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Rutas de la API
app.use('/api', authRoutes); // Esto crea /api/login
app.use('/api/tickets', authenticateToken, ticketRoutes); // Esto crea /api/tickets

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));