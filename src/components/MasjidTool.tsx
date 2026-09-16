import { useEffect, useState } from "react";
import { readLocal, writeLocal } from "@/lib/storage";
import { PRAYERS } from "@/lib/prayer-api";
interface Masjid {
  name: string;
  address: string;
  source: string;
  confirmed: string;
  jummah: string;
  times: Record<string, string>;
}
const EMPTY: Masjid = {
  name: "",
  address: "",
  source: "",
  confirmed: "",
  jummah: "",
  times: {},
};
export default function MasjidTool() {
  const [masjid, setMasjid] = useState(EMPTY),
    [message, setMessage] = useState("");
  useEffect(() => setMasjid(readLocal("deenflow-masjid", EMPTY)), []);
  return (
    <>
      <p className="text-sm">
        Save your masjid's congregation times after checking its noticeboard or
        contacting it. These personal entries are not independently verified by
        DeenFlow.
      </p>
      <form
        className="panel space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          writeLocal("deenflow-masjid", masjid);
          setMessage(
            "Saved on this device. Reconfirm when your masjid changes its timetable.",
          );
        }}
      >
        <label className="field">
          Masjid name
          <input
            required
            maxLength={120}
            value={masjid.name}
            onChange={(e) => setMasjid({ ...masjid, name: e.target.value })}
          />
        </label>
        <label className="field">
          Address
          <input
            maxLength={240}
            value={masjid.address}
            onChange={(e) => setMasjid({ ...masjid, address: e.target.value })}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PRAYERS.map((p) => (
            <label className="field" key={p}>
              {p} iqamah
              <input
                type="time"
                value={masjid.times[p] || ""}
                onChange={(e) =>
                  setMasjid({
                    ...masjid,
                    times: { ...masjid.times, [p]: e.target.value },
                  })
                }
              />
            </label>
          ))}
        </div>
        <label className="field">
          Jumu'ah sessions / notes
          <textarea
            maxLength={1000}
            placeholder="Khutbah and congregation times, including multiple sessions"
            value={masjid.jummah}
            onChange={(e) => setMasjid({ ...masjid, jummah: e.target.value })}
          />
        </label>
        <label className="field">
          Source (website, noticeboard or contact)
          <input
            maxLength={300}
            value={masjid.source}
            onChange={(e) => setMasjid({ ...masjid, source: e.target.value })}
          />
        </label>
        <label className="field">
          Last confirmed
          <input
            type="date"
            required
            value={masjid.confirmed}
            onChange={(e) =>
              setMasjid({ ...masjid, confirmed: e.target.value })
            }
          />
        </label>
        <button className="action">Save my masjid</button>
      </form>
      {message && <p role="status">{message}</p>}
      {masjid.address && (
        <a
          className="action secondary"
          target="_blank"
          rel="noopener noreferrer"
          href={
            "https://www.openstreetmap.org/search?query=" +
            encodeURIComponent(masjid.address)
          }
        >
          Find on map
        </a>
      )}
    </>
  );
}
