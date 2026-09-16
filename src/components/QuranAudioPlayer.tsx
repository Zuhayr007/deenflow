import { useEffect, useRef, useState } from "react";
import { SURAHS } from "@/lib/quran-api";
export default function QuranAudioPlayer({
  surahNumber,
  surahName,
  totalAyahs,
  currentAyah,
  onAyahChange,
}: {
  surahNumber: number;
  surahName: string;
  totalAyahs: number;
  currentAyah: number;
  onAyahChange: (n: number) => void;
}) {
  const audio = useRef<HTMLAudioElement>(null),
    callback = useRef(onAyahChange);
  callback.current = onAyahChange;
  const [playing, setPlaying] = useState(false),
    [progress, setProgress] = useState(0),
    [duration, setDuration] = useState(0),
    [error, setError] = useState("");
  const [reciter, setReciter] = useState("ar.alafasy"),
    [speed, setSpeed] = useState(1),
    [repeat, setRepeat] = useState("off"),
    [start, setStart] = useState(1),
    [end, setEnd] = useState(totalAyahs);
  const shouldPlay = useRef(false);
  const global =
    SURAHS.slice(0, surahNumber - 1).reduce((n, s) => n + s.numberOfAyahs, 0) +
    currentAyah;
  const url =
    "https://cdn.islamic.network/quran/audio/128/" +
    reciter +
    "/" +
    global +
    ".mp3";
  useEffect(() => {
    const element = audio.current;
    return () => {
      shouldPlay.current = false;
      element?.pause();
      element?.removeAttribute("src");
      element?.load();
    };
  }, []);
  useEffect(() => {
    setProgress(0);
    setDuration(0);
    setError("");
    const a = audio.current;
    if (a) {
      a.load();
      if (shouldPlay.current)
        void a.play().catch(() => {
          setError("Tap play to start audio.");
          setPlaying(false);
        });
    }
  }, [url]);
  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed, url]);
  const play = async () => {
    const a = audio.current;
    if (!a) return;
    setError("");
    if (!a.paused) {
      shouldPlay.current = false;
      a.pause();
    } else {
      shouldPlay.current = true;
      try {
        await a.play();
      } catch {
        setError("Audio could not play. Check your connection and try again.");
        shouldPlay.current = false;
      }
    }
  };
  const jump = (n: number) => {
    if (n >= 1 && n <= totalAyahs) callback.current(n);
  };
  return (
    <aside
      className="fixed left-0 right-0 z-40 px-3"
      style={{ bottom: "calc(74px + env(safe-area-inset-bottom, 0px))" }}
      aria-label="Quran audio"
    >
      <div className="max-w-lg max-h-[55dvh] overflow-y-auto mx-auto bg-card rounded-2xl border p-3 shadow-xl">
        <audio
          ref={audio}
          src={url}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onError={() => {
            setError("Recitation unavailable. Reconnect and retry.");
            setPlaying(false);
          }}
          onEnded={() => {
            if (
              repeat === "ayah" ||
              (repeat === "range" && currentAyah >= end)
            ) {
              if (repeat === "ayah" || currentAyah === start) {
                if (audio.current) {
                  audio.current.currentTime = 0;
                  void audio.current
                    .play()
                    .catch(() => setError("Tap play to continue."));
                }
              } else jump(start);
            } else if (currentAyah < totalAyahs) jump(currentAyah + 1);
            else {
              shouldPlay.current = false;
              setPlaying(false);
            }
          }}
        />
        <div className="flex items-center gap-3">
          <button
            className="action"
            onClick={() => void play()}
            aria-label={playing ? "Pause recitation" : "Play recitation"}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <div className="flex-1 text-sm">
            <p className="font-semibold">
              {surahName} · {currentAyah}/{totalAyahs}
            </p>
            <p className="text-xs text-muted-foreground">
              Verse-by-verse recitation
            </p>
          </div>
          <button
            aria-label="Previous ayah"
            disabled={currentAyah === 1}
            onClick={() => jump(currentAyah - 1)}
          >
            ←
          </button>
          <button
            aria-label="Next ayah"
            disabled={currentAyah === totalAyahs}
            onClick={() => jump(currentAyah + 1)}
          >
            →
          </button>
        </div>
        <details className="mt-2 text-xs">
          <summary>Audio & memorization controls</summary>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <label className="field col-span-2">
              Seek
              <input
                type="range"
                min="0"
                max={duration || 1}
                step=".1"
                value={Math.min(progress, duration || 1)}
                onChange={(e) => {
                  if (audio.current)
                    audio.current.currentTime = Number(e.target.value);
                }}
              />
            </label>
            <label className="field">
              Reciter
              <select
                value={reciter}
                onChange={(e) => setReciter(e.target.value)}
              >
                <option value="ar.alafasy">Mishary Alafasy</option>
                <option value="ar.abdurrahmaansudais">
                  Abdurrahman As-Sudais
                </option>
                <option value="ar.husary">Mahmoud Khalil Al-Husary</option>
              </select>
            </label>
            <label className="field">
              Playback speed
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                {[0.75, 1, 1.25, 1.5].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Repeat
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
              >
                <option value="off">Off</option>
                <option value="ayah">This ayah</option>
                <option value="range">Verse range</option>
              </select>
            </label>
            {repeat === "range" && (
              <>
                <label className="field">
                  From ayah
                  <input
                    type="number"
                    min="1"
                    max={end}
                    value={start}
                    onChange={(e) =>
                      setStart(
                        Math.max(1, Math.min(end, Number(e.target.value))),
                      )
                    }
                  />
                </label>
                <label className="field">
                  Through ayah
                  <input
                    type="number"
                    min={start}
                    max={totalAyahs}
                    value={end}
                    onChange={(e) =>
                      setEnd(
                        Math.max(
                          start,
                          Math.min(totalAyahs, Number(e.target.value)),
                        ),
                      )
                    }
                  />
                </label>
                <button
                  className="action secondary"
                  onClick={() => {
                    shouldPlay.current = true;
                    jump(start);
                    if (currentAyah === start && audio.current) {
                      audio.current.currentTime = 0;
                      void audio.current
                        .play()
                        .catch(() => setError("Tap play to start the range."));
                    }
                  }}
                >
                  Play range
                </button>
              </>
            )}
          </div>
        </details>
        {error && (
          <p role="alert" className="text-xs mt-2">
            {error}
          </p>
        )}
      </div>
    </aside>
  );
}
