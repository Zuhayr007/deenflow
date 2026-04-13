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
      className="rounded-2xl bg-card p-5 card-elevated"
    >
      <p className="font-arabic text-right text-xl leading-[2.4] text-foreground" dir="rtl">
        {dua.arabic}
      </p>
      <div className="mt-4 border-t border-border pt-3 space-y-2">
        <p className="text-sm leading-relaxed text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
          {dua.english}
        </p>
        <p className="text-[11px] font-semibold text-gradient-gold inline-block" style={{ fontFamily: 'var(--font-body)' }}>
          {dua.reference}
        </p>
      </div>
    </motion.div>
  );
}
