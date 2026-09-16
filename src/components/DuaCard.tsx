import { useEffect, useState } from "react";
import type { Dua } from "@/lib/duas-data";
import { duaContent } from "@/lib/dua-content";
import { readLocal, writeLocal } from "@/lib/storage";
export default function DuaCard({ dua }: { dua: Dua; index: number }) {
  const d = duaContent(dua),
    [saved, setSaved] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    const sync = () =>
      setSaved(
        readLocal<number[]>("deenflow-dua-favourites", []).includes(d.id),
      );
    sync();
    window.addEventListener("deenflow-storage", sync);
    return () => window.removeEventListener("deenflow-storage", sync);
  }, [d.id]);
  return (
    <article className="panel">
      <h2 className="text-lg font-semibold">
        <a href={"/dua/" + d.id}>{d.title}</a>
      </h2>
      {d.excerpt && (
        <p className="text-xs text-muted-foreground mt-1">
          Excerpt — see the full source for context.
        </p>
      )}
      <p
        lang="ar"
        dir="rtl"
        className="font-arabic text-2xl leading-[2.3] mt-4"
      >
        {d.arabic}
      </p>
      {d.transliteration && (
        <p className="text-sm italic mt-3">{d.transliteration}</p>
      )}
      <p className="text-sm leading-relaxed border-t mt-4 pt-3">{d.english}</p>
      <p className="text-xs mt-3">
        {d.sourceUrl ? (
          <a
            className="text-primary underline"
            href={d.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {d.reference} ↗
          </a>
        ) : (
          d.reference
        )}
      </p>
      <p className="text-xs text-muted-foreground mt-2">{d.sourceStatus}</p>
      <div className="flex gap-3 mt-4">
        <button
          className="action secondary"
          aria-pressed={saved}
          onClick={() => {
            const all = readLocal<number[]>("deenflow-dua-favourites", []);
            writeLocal(
              "deenflow-dua-favourites",
              saved ? all.filter((n) => n !== d.id) : [...all, d.id],
            );
          }}
        >
          {saved ? "★ Saved" : "☆ Save"}
        </button>
        <button
          className="action secondary"
          onClick={async () => {
            const text = d.arabic + "\n\n" + d.english + "\n" + d.reference;
            const url = location.origin + "/dua/" + d.id;
            try {
              if (navigator.share)
                await navigator.share({ title: d.title, text, url });
              else {
                await navigator.clipboard.writeText(text + "\n" + url);
                setMessage("Copied with source.");
              }
            } catch (e) {
              if ((e as Error).name !== "AbortError")
                setMessage(
                  "Sharing unavailable. Copy the page link from your browser.",
                );
            }
          }}
        >
          Share
        </button>
      </div>
      {message && (
        <p role="status" className="text-xs mt-2">
          {message}
        </p>
      )}
    </article>
  );
}
