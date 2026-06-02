import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import api from '../api/axios';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/', formData);
      navigate('/');
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-slate-900 dark:text-slate-100 shadow-sm";

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="p-2 md:p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white tracking-tight">Create Ticket</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5 md:mt-1">Fill out the information below to submit a new request.</p>
        </div>
      </div>

      <Card className="p-5 md:p-8 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Customer Name</label>
              <input 
                required
                type="text" 
                placeholder="John Doe"
                className={inputClasses}
                value={formData.customer_name}
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <input 
                required
                type="email" 
                placeholder="john@example.com"
                className={inputClasses}
                value={formData.customer_email}
                onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Subject</label>
            <input 
              required
              type="text" 
              placeholder="Brief summary of the issue"
              className={inputClasses}
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Description</label>
            <textarea 
              required
              rows={5}
              placeholder="Provide detailed information about the issue..."
              className={`${inputClasses} resize-none`}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
            <Button type="submit" disabled={loading} className="gap-2 min-w-[140px] shadow-lg shadow-black/10 dark:shadow-white/5">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Ticket
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}