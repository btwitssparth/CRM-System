import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, MessageSquare, Clock, User, Mail, FileText, Settings } from 'lucide-react';
import api from '../api/axios';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  const fetchTicketData = async () => {
    try {
      const response = await api.get(`/${id}`);
      setTicket(response.data.data);
      setStatusUpdate(response.data.data.status);
    } catch (error) {
      console.error("Failed to fetch ticket", error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/${id}`, {
        status: statusUpdate,
        notes: newNote
      });
      setNewNote('');
      await fetchTicketData();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" />
        <p className="text-slate-500 font-medium">Loading ticket details...</p>
      </div>
    );
  }

  const inputClasses = "flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-900 dark:text-slate-100 shadow-sm";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')} 
            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">#{ticket.ticket_id}</h1>
              <Badge variant={ticket.status === 'Open' ? 'primary' : ticket.status === 'In Progress' ? 'warning' : 'success'}>
                {ticket.status}
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{ticket.subject}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Ticket Info */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <Card className="p-5 md:p-8 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-black dark:text-white" />
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Customer Details</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-8">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-black border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Name</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-base md:text-lg">{ticket.customer_name}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-black border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Email</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-base md:text-lg break-all">{ticket.customer_email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-black dark:text-white" />
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Description</h3>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-950 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                {ticket.description}
              </p>
            </div>
          </Card>

          {/* Notes History */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <MessageSquare className="w-5 h-5 text-black dark:text-white" />
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Internal Notes</h3>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {ticket.notes && ticket.notes.length > 0 ? (
                  ticket.notes.map((note, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <div className="shrink-0">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700">
                          <span className="text-black dark:text-white text-xs md:text-sm font-bold">SA</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                          <span className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100">Support Agent</span>
                          <div className="flex items-center text-[10px] md:text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-black px-2 py-1 rounded-lg gap-1.5 border border-transparent dark:border-slate-800">
                            <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" />
                            {new Date(note.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                        </div>
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">{note.text}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <Card className="p-12 text-center border-dashed border-2">
                    <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium italic">No internal notes added yet.</p>
                  </Card>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <Card className="p-5 md:p-8 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-black dark:text-white" />
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Actions</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Update Status</label>
                <select 
                  className={`${inputClasses} h-11 cursor-pointer`}
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Add Note</label>
                <textarea 
                  rows={4}
                  placeholder="Type an internal note..."
                  className={`${inputClasses} resize-none`}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleUpdate} 
                disabled={updating || (statusUpdate === ticket.status && !newNote.trim())}
                className="w-full h-12 text-base shadow-lg shadow-black/10 dark:shadow-white/5"
              >
                {updating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Update Ticket
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}