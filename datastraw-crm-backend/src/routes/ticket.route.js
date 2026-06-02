import { Router } from 'express';
import { 
    createTicket, 
    getTickets, 
    getTicketById, 
    updateTicket 
} from '../controllers/ticket.controller.js';

const router = Router();

router.route('/').post(createTicket);
router.route('/').get(getTickets);
router.route('/:ticket_id').get(getTicketById);
router.route('/:ticket_id').put(updateTicket);

export default router;