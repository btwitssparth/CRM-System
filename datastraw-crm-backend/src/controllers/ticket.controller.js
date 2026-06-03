import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError}from '../utils/ApiError.js';
import {ApiResponse}from '../utils/ApiResponse.js';
import Ticket from '../models/Tickets.model.js'
import Note from '../models/Note.model.js'


// Utility to generate custom ticket IDs (e.g., TKT-001)
const generateTicketId = async () => {
    const count = await Ticket.countDocuments();
    const nextId = (count + 1).toString().padStart(3, '0');
    return `TKT-${nextId}`;
};

// @desc    Create a new ticket
export const createTicket = asyncHandler(async (req, res) => {
    const { customer_name, customer_email, subject, description } = req.body;

    if (!customer_name || !customer_email || !subject || !description) {
        throw new ApiError(400, "All fields are required to create a ticket");
    }

    const ticket_id = await generateTicketId();

    const newTicket = await Ticket.create({
        ticket_id,
        customer_name,
        customer_email,
        subject,
        description,
        status: 'Open',
        createdBy: req.user._id

    });

    const responseData = { 
        ticket_id: newTicket.ticket_id, 
        created_at: newTicket.createdAt 
    };

    return res.status(201).json(new ApiResponse(201, responseData, "Ticket created successfully"));
});

// @desc    Get all tickets (Includes Search & Filter features)
export const getTickets = asyncHandler(async (req, res) => {
    const { status, search } = req.query;
    let query = {};
    if (req.user.role === 'customer') {
        query.createdBy = req.user._id;
    }

    if (status) query.status = status;

    if (search) {
        query.$or = [
            { customer_name: { $regex: search, $options: 'i' } },
            { subject: { $regex: search, $options: 'i' } },
            { ticket_id: { $regex: search, $options: 'i' } } // Added ID search for extra functionality
        ];
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });

    const formattedTickets = tickets.map(ticket => ({
        ticket_id: ticket.ticket_id,
        customer_name: ticket.customer_name,
        subject: ticket.subject,
        status: ticket.status,
        created_at: ticket.createdAt
    }));

    return res.status(200).json(new ApiResponse(200, formattedTickets, "Tickets fetched successfully"));
});

// @desc    Get single ticket details along with notes history
// @desc    Get single ticket details along with notes history
export const getTicketById = asyncHandler(async (req, res) => {
    const { ticket_id } = req.params;

    const ticket = await Ticket.findOne({ ticket_id });
    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }

    // 
    if (req.user.role === 'customer' && ticket.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access Denied: You do not have permission to view this ticket.");
    }

    const notes = await Note.find({ ticket_id }).sort({ createdAt: 1 });

    const responseData = {
        ticket_id: ticket.ticket_id,
        customer_name: ticket.customer_name,
        customer_email: ticket.customer_email,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        notes: notes.map(n => ({ text: n.note_text, date: n.createdAt }))
    };

    return res.status(200).json(new ApiResponse(200, responseData, "Ticket details fetched successfully"));
});
// @desc    Update ticket status and/or add a new note
export const updateTicket = asyncHandler(async (req, res) => {
    const { ticket_id } = req.params;
    const { status, notes } = req.body; 

    const ticket = await Ticket.findOne({ ticket_id });
    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }

    // 1. SECURITY CHECK (IDOR Prevention)
    // If the user is a customer, verify they actually own this ticket
    if (req.user.role === 'customer' && ticket.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access Denied: You do not have permission to view or modify this ticket.");
    }

    // 2. STATUS UPDATE (Admin Only)
    if (status) {
        if (req.user.role !== 'admin') {
            throw new ApiError(403, "Access Denied: Only admins can change a ticket's status.");
        }

        const validStatuses = ['Open', 'In Progress', 'Closed'];
        if (!validStatuses.includes(status)) {
            throw new ApiError(400, "Invalid status value");
        }
        ticket.status = status;
        await ticket.save();
    }

    // 3. INTERNAL NOTES (Admin Only)
    if (notes && notes.trim() !== "") {
        if (req.user.role !== 'admin') {
            throw new ApiError(403, "Access Denied: Only admins can add internal notes.");
        }

        await Note.create({
            ticket_id,
            note_text: notes
        });
    }

    return res.status(200).json(
        new ApiResponse(200, { success: true, updated_at: ticket.updatedAt }, "Ticket updated successfully")
    );
});