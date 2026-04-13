import { motion } from "framer-motion";

export default function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-5 pt-14 pb-2"
    >
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-islamic shadow-md">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.41 0 2.76-.3 3.98-.84C13.15 19.45 11 16.96 11 14c0-4.42 3.58-8 8-8 .35 0 .69.03 1.03.07C18.97 3.55 15.75 2 12 2z" />
          </svg>
          <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold shadow-sm" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            DeenFlow
          </h1>
        </div>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
        </svg>
      </div>
    </motion.header>
  );
}
