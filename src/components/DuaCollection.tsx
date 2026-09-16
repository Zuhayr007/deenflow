import { useEffect, useState } from "react";
import { DUA_CONTENT, CATEGORIES } from "@/lib/dua-content";
import { readLocal } from "@/lib/storage";
import DuaCard from "./DuaCard";
export default function DuaCollection({ category }: { category?: string }) {
  const [search, setSearch] = useState(""),
    [saved, setSaved] = useState(false),
    [favourites, setFavourites] = useState<number[]>([]);
  useEffect(() => {
    const sync = () => setFavourites(readLocal("deenflow-dua-favourites", []));
    sync();
    window.addEventListener("deenflow-storage", sync);
    return () => window.removeEventListener("deenflow-storage", sync);
  }, []);
  const filtered = DUA_CONTENT.filter(
    (d) =>
      (!category || d.category === category) &&
      (!saved || favourites.includes(d.id)) &&
      [d.title, d.arabic, d.english, d.category].some((s) =>
        s.toLowerCase().includes(search.toLowerCase()),
      ),
  );
  return (
    <>
      <nav aria-label="Dua topics" className="flex flex-wrap gap-2">
        <a className="action secondary" href="/duas">
          All duas
        </a>
        {CATEGORIES.map((c) => (
          <a className="action secondary" key={c.slug} href={"/duas/" + c.slug}>
            {c.name}
          </a>
        ))}
      </nav>
      <label className="field">
        Find a dua
        <input
          type="search"
          placeholder="Anxiety, forgiveness, travel…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={saved}
          onChange={(e) => setSaved(e.target.checked)}
        />
        Favourites only
      </label>
      {filtered.length ? (
        filtered.map((dua, i) => <DuaCard key={dua.id} dua={dua} index={i} />)
      ) : (
        <p>No matching duas. Try another search or save a favourite.</p>
      )}
    </>
  );
}
