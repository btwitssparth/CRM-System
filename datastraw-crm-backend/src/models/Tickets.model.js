import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticket_id: { 
    type: String, 
    required: true, 
    unique: true 
  }, // e.g., TKT-001
  customer_name: { 
    type: String, 
    required: true 
  },
  customer_email: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Closed'], 
    default: 'Open' 
  },
  createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
  
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);