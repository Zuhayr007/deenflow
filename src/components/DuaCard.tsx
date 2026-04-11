import { motion } from "framer-motion";
import type { Dua } from "@/lib/duas-data";

interface Props {
  dua: Dua;
  index: number;
}

export default function DuaCard({ dua, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <p className="font-arabic text-right text-xl leading-[2.2] text-foreground" dir="rtl">
        {dua.arabic}
      </p>
      <div className="mt-4 border-t border-border pt-3">
        <p className="text-sm leading-relaxed text-muted-foreground">{dua.english}</p>
        <p className="mt-2 text-xs font-medium text-gold">{dua.reference}</p>
      </div>
    </motion.div>
  );
}
