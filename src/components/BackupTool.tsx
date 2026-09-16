import { useEffect, useState } from "react";
import {
  decryptBackup,
  encryptBackup,
  exportBackup,
  newRecoveryKey,
  restoreBackup,
  validateBackup,
  vaultToken,
} from "@/lib/backup";
import { saveDownload } from "./Timetable";
export default function BackupTool() {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [key, setKey] = useState(""),
    [pending, setPending] = useState<unknown>(null),
    [cloud, setCloud] = useState(false);
  useEffect(() => {
    void fetch("/api/push-config")
      .then((r) => (r.ok ? r.json() : { syncEnabled: false }))
      .then((c) => setCloud(Boolean(c.syncEnabled)))
      .catch(() => undefined);
  }, []);
  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setMessage("");
    try {
      await fn();
    } catch (e) {
      setMessage((e as Error).message || "Please retry.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <section className="panel space-y-4">
        <h2 className="text-xl">Take DeenFlow offline</h2>
        <p className="text-sm">
          Download the app and all 114 surahs with translations. Audio is
          streamed separately. Your browser may remove offline files when
          storage is low.
        </p>
        <button
          className="action"
          disabled={busy}
          onClick={() =>
            void run(async () => {
              if (!("caches" in window))
                throw Error("Offline storage is unavailable in this browser.");
              const r = await fetch("/offline-assets.json");
              if (!r.ok)
                throw Error(
                  "Offline downloads are available in the production build.",
                );
              const manifest: { cache: string; assets: string[] } =
                await r.json();
              const cache = await caches.open(manifest.cache);
              for (let i = 0; i < manifest.assets.length; i += 6) {
                await cache.addAll(manifest.assets.slice(i, i + 6));
                setMessage(
                  "Downloaded " +
                    Math.min(i + 6, manifest.assets.length) +
                    " of " +
                    manifest.assets.length +
                    " files",
                );
              }
              await navigator.storage?.persist?.();
              setMessage(
                "Offline download complete. Prayer calculations and downloaded reading tools are ready.",
              );
            })
          }
        >
          Download offline pack
        </button>
      </section>
      <section className="panel space-y-4">
        <h2 className="text-xl">Backup your reading</h2>
        <p className="text-sm">
          Includes bookmarks, favourites, reading progress, appearance and your
          saved masjid. Location and notification permissions stay on this
          device.
        </p>
        <button
          className="action"
          onClick={() =>
            saveDownload(
              "deenflow-backup.json",
              JSON.stringify(exportBackup(), null, 2),
              "application/json",
            )
          }
        >
          Download backup
        </button>
        <label className="field">
          Restore a backup file
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                void run(async () => {
                  if (file.size > 100000) throw Error("Backup is too large.");
                  const input = JSON.parse(await file.text());
                  validateBackup(input);
                  setPending(input);
                });
              e.target.value = "";
            }}
          />
        </label>
      </section>
      <section className="panel space-y-4">
        <h2 className="text-xl">Encrypted cross-device backup</h2>
        <p className="text-sm">
          Upload on one device and restore on another. Your recovery key
          encrypts the backup before upload. Keep it safe: anyone with the key
          can restore or replace the backup. Lost keys cannot be recovered.
        </p>
        {!cloud ? (
          <p className="text-sm text-muted-foreground">
            Cloud backup has not been enabled on this server. File backup works
            now.
          </p>
        ) : (
          <>
            <button
              className="action secondary"
              disabled={Boolean(key)}
              onClick={() => setKey(newRecoveryKey())}
            >
              Create a recovery key
            </button>
            <label className="field">
              Recovery key
              <input
                autoComplete="off"
                spellCheck={false}
                value={key}
                onChange={(e) => setKey(e.target.value.trim())}
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                className="action"
                disabled={busy || key.length !== 64}
                onClick={() =>
                  void run(async () => {
                    const payload = await encryptBackup(key, exportBackup());
                    const r = await fetch("/api/sync", {
                      method: "PUT",
                      headers: {
                        Authorization: "Bearer " + (await vaultToken(key)),
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(payload),
                    });
                    if (!r.ok) throw Error("Upload failed. Please retry.");
                    setMessage(
                      "Encrypted backup uploaded. Save your recovery key separately.",
                    );
                  })
                }
              >
                Upload / replace cloud backup
              </button>
              <button
                className="action secondary"
                disabled={busy || key.length !== 64}
                onClick={() =>
                  void run(async () => {
                    const r = await fetch("/api/sync", {
                      headers: {
                        Authorization: "Bearer " + (await vaultToken(key)),
                      },
                    });
                    if (!r.ok)
                      throw Error(
                        "Backup not found or server unavailable. Check your key.",
                      );
                    const input = await decryptBackup(key, await r.json());
                    validateBackup(input);
                    setPending(input);
                  })
                }
              >
                Preview restore
              </button>
              <button
                className="action secondary"
                disabled={busy || key.length !== 64}
                onClick={() =>
                  void run(async () => {
                    const r = await fetch("/api/sync", {
                      method: "DELETE",
                      headers: {
                        Authorization: "Bearer " + (await vaultToken(key)),
                      },
                    });
                    if (!r.ok) throw Error("Could not delete cloud backup.");
                    setMessage(
                      "Cloud backup deleted. Local reading data remains.",
                    );
                  })
                }
              >
                Delete cloud backup
              </button>
            </div>
          </>
        )}
      </section>
      {pending !== null && (
        <section className="panel space-y-3">
          <h2 className="font-semibold">
            Restore {Object.keys(validateBackup(pending)).length} saved
            collections?
          </h2>
          <p className="text-sm">
            This replaces the matching local collections. Download your current
            backup first if you want to keep both.
          </p>
          <button
            className="action"
            onClick={() => {
              try {
                restoreBackup(pending);
                setPending(null);
                setMessage("Backup restored.");
              } catch (e) {
                setMessage((e as Error).message);
              }
            }}
          >
            Restore now
          </button>
          <button className="action secondary" onClick={() => setPending(null)}>
            Cancel
          </button>
        </section>
      )}
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </>
  );
}
