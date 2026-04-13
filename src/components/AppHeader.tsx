import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

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
          <img src={logo} alt="DeenFlow logo" className="h-5 w-5" />
          <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold shadow-sm" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Deen<span className="text-green-700">Flow</span>
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
