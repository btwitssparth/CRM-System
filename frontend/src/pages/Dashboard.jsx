import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, PlusCircle, Inbox, Loader2, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [status, search]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // FIX: Changed '/' to '/tickets'
      let url = '/tickets'; 
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      
      // We check if params exist. If they do, we add them with a ? 
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await api.get(url);
      setTickets(response.data.data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Open': return <Badge variant="primary">Open</Badge>;
      case 'In Progress': return <Badge variant="warning">In Progress</Badge>;
      case 'Closed': return <Badge variant="success">Closed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Support Tickets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track customer inquiries in real-time.</p>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="p-4 flex flex-col sm:flex-row gap-4 border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID, name, or subject..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-black transition-all dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            className="w-full pl-10 pr-8 py-2 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer dark:text-white transition-all"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </Card>

      {/* Data Table / Mobile Cards */}
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          {/* Desktop View */}
          <table className="hidden md:table w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 dark:bg-black text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="px-6 py-4">Ticket ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-black dark:text-white animate-spin mx-auto" />
                    <p className="text-slate-500 mt-2 font-medium">Loading tickets...</p>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-500">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                      <p className="text-lg font-bold text-slate-900 dark:text-white">No tickets found</p>
                      <p className="text-sm">Try adjusting your search or filters.</p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {tickets.map((ticket) => (
                    <motion.tr 
                      key={ticket.ticket_id} 
                      variants={itemVariants}
                      layout
                      onClick={() => navigate(`/ticket/${ticket.ticket_id}`)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-5 font-bold text-black dark:text-white">
                        #{ticket.ticket_id}
                      </td>
                      <td className="px-6 py-5 font-semibold text-slate-900 dark:text-slate-200">
                        {ticket.customer_name}
                      </td>
                      <td className="px-6 py-5 text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-5 text-slate-500 dark:text-slate-500 font-medium">
                        {new Date(ticket.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-black dark:text-white animate-spin mx-auto" />
                <p className="text-slate-500 mt-2">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <p className="font-bold dark:text-white">No tickets found</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div 
                  key={ticket.ticket_id}
                  onClick={() => navigate(`/ticket/${ticket.ticket_id}`)}
                  className="p-4 space-y-3 active:bg-slate-50 dark:active:bg-zinc-900 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-black dark:text-white">#{ticket.ticket_id}</span>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-200">{ticket.customer_name}</p>
                    <p className="text-sm text-slate-500 truncate">{ticket.subject}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}