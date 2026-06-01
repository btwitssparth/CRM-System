import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  ticket_id: { 
    type: String, 
    required: true, 
    ref: 'Ticket' 
  },
  note_text: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);