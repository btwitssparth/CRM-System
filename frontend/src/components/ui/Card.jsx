import { motion } from 'framer-motion';

export function Card({ children, className = '', hover = false }) {
  const base = "bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all";
  const hoverEffect = hover ? "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700" : "";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${base} ${hoverEffect} ${className}`}
    >
      {children}
    </motion.div>
  );
}