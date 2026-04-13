import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DUAS, DUA_CATEGORIES } from "@/lib/duas-data";
import DuaCard from "@/components/DuaCard";
import AppHeader from "@/components/AppHeader";

export const Route = createFileRoute("/duas")({
  head: () => ({
    meta: [
      { title: "Duas — DeenFlow" },
      { name: "description", content: "Beautiful collection of Islamic duas for daily life, forgiveness, and more." },
      { property: "og:title", content: "Duas — DeenFlow" },
      { property: "og:description", content: "Beautiful collection of Islamic duas for daily life, forgiveness, and more." },
    ],
  }),
  component: DuasPage,
});

function DuasPage() {
  const [active, setActive] = useState<string>(DUA_CATEGORIES[0]);

  const filtered = DUAS.filter((d) => d.category === active);

  return (
    <div className="safe-bottom min-h-screen">
      <AppHeader />

      <div className="px-5 pb-2">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Duas</h2>
        <p className="mt-0.5 text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
          Supplications for every occasion
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 pb-1 pt-2 scrollbar-none">
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              active === cat
                ? "bg-primary text-primary-foreground shadow-md glow-primary"
                : "bg-card card-elevated text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3 px-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {filtered.map((dua, i) => (
              <DuaCard key={dua.id} dua={dua} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
