import { Router } from 'express';
import { createTicket, getTickets, getTicketById, updateTicket } from '../controllers/ticket.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'; // 1. Import the middleware

const router = Router();

// 2. CRITICAL: Force all ticket routes to pass through the security bouncer
router.use(verifyJWT); 

router.route('/').post(createTicket);
router.route('/').get(getTickets);
router.route('/:ticket_id').get(getTicketById);
router.route('/:ticket_id').put(updateTicket);

export default router;