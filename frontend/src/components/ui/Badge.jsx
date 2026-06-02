export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    primary: 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white',
    warning: 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700',
    success: 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-black dark:border-zinc-100',
    error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${variants[variant]}`}>
      {children}
    </span>
  );
}