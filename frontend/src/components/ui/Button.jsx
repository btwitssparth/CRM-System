import { motion } from 'framer-motion';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-5 py-2 cursor-pointer shadow-sm";
  
  const variants = {
    primary: "bg-black text-white hover:bg-slate-800 focus:ring-black dark:bg-white dark:text-black dark:hover:bg-slate-200",
    secondary: "bg-white text-black border border-black hover:bg-slate-50 focus:ring-black dark:bg-black dark:text-white dark:border-white dark:hover:bg-slate-900",
    outline: "border border-slate-300 bg-transparent hover:bg-slate-50 focus:ring-slate-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:ring-slate-500"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </motion.button>
  );
}