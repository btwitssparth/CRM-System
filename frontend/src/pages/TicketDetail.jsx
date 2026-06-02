import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Clock, User, Mail, Loader2, AlertCircle, Save } from 'lucide-react';
import api from '../api/axios';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/${id}`);
      const data = response.data.data;
      setTicket(data);
      setNewStatus(data.status);
      setError(null);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      setError('Failed to load ticket details. It may not exist or the server is down.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus && !newNote.trim()) return;

    try {
      setUpdating(true);
      await api.put(`/${id}`, {
        status: newStatus,
        notes: newNote.trim() || undefined,
      });
      setNewNote('');
      await fetchTicket(); // Refresh ticket data
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError('Failed to update ticket. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">{error || 'Ticket not found'}</h2>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{ticket.subject}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
          <p className="text-slate-500 mt-1">Ticket #{ticket.ticket_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Ticket Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <h2 className="text-lg font-semibold text-slate-900">Notes & History</h2>
            </div>
            <div className="p-6">
              {ticket.notes && ticket.notes.length > 0 ? (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                  {ticket.notes.map((note, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-white text-slate-500 z-10">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-1 pt-1.5">
                        <div className="text-sm font-medium text-slate-900">Support Agent Note</div>
                        <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {note.text}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(note.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 italic">
                  No notes added to this ticket yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Details */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Customer Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-sm font-medium text-slate-900">{ticket.customer_name}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-sm text-slate-600">{ticket.customer_email}</div>
              </div>
            </div>
          </div>

          {/* Update Ticket Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Update Ticket</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Change Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Add Internal Note</label>
                <textarea
                  placeholder="Type a note for this ticket..."
                  rows={4}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
