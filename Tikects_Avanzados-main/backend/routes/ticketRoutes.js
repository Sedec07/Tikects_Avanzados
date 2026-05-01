import express from 'express';
import { 
  getTickets, 
  getTicketById, 
  createTicket,
  escalarTicket,
  cambiarEstado
} from '../controllers/ticketController.js';

const router = express.Router();

// 🔵 RUTAS EXISTENTES
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);

// 🔴 NUEVAS FUNCIONALIDADES
router.put('/:id/escalar', escalarTicket);
router.put('/:id/estado', cambiarEstado);

export default router;