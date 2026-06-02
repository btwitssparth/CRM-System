import { Link } from 'react-router-dom';
import { Ticket, PlusCircle, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="bg-black dark:bg-white p-2 rounded-xl shadow-lg shadow-black/10 dark:shadow-white/10 border border-transparent dark:border-white"
            >
              <Ticket className="w-5 h-5 text-white dark:text-black" />
            </motion.div>
            <span className="font-bold text-xl text-black dark:text-white tracking-tight">Datastraw</span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/create">
              <Button className="gap-2 shadow-lg shadow-black/10">
                <PlusCircle className="w-4 h-4" />
                New Ticket
              </Button>
            </Link>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-zinc-900 shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 dark:text-slate-400"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-black overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              <Link to="/create" onClick={() => setIsOpen(false)}>
                <Button className="w-full gap-2 py-6 text-lg">
                  <PlusCircle className="w-5 h-5" />
                  New Ticket
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}