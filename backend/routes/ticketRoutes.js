import express from 'express';
import { getTickets, getTicketById, createTicket } from '../controllers/ticketController.js';

const router = express.Router();

// Estas rutas ya vienen con el prefijo /api/tickets desde server.js
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);

export default router;