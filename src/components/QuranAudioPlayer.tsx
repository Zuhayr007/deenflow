import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface QuranAudioPlayerProps {
  surahNumber: number;
  surahName: string;
  totalAyahs: number;
  currentAyah: number;
  onAyahChange: (ayahNumber: number) => void;
}

const RECITER = "ar.alafasy"; // Mishary Rashid Alafasy

export default function QuranAudioPlayer({
  surahNumber,
  surahName,
  totalAyahs,
  currentAyah,
  onAyahChange,
}: QuranAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playingAyah, setPlayingAyah] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getAudioUrl = useCallback(
    (ayah: number) =>
      `https://cdn.islamic.network/quran/audio/128/${RECITER}/${getGlobalAyahNumber(surahNumber, ayah)}.mp3`,
    [surahNumber]
  );

  // Precompute global ayah number (cumulative)
  function getGlobalAyahNumber(surah: number, ayahInSurah: number): number {
    const ayahCounts = [0,7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
    let global = 0;
    for (let i = 1; i < surah; i++) global += ayahCounts[i] || 0;
    return global + ayahInSurah;
  }

  const playAyah = useCallback(
    (ayah: number) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setLoading(true);
      const audio = new Audio(getAudioUrl(ayah));
      audioRef.current = audio;
      setPlayingAyah(ayah);
      onAyahChange(ayah);

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        setLoading(false);
      });
      audio.addEventListener("timeupdate", () => {
        setProgress(audio.currentTime);
      });
      audio.addEventListener("ended", () => {
        if (ayah < totalAyahs) {
          playAyah(ayah + 1);
        } else {
          setPlaying(false);
          setProgress(0);
        }
      });
      audio.addEventListener("error", () => {
        setLoading(false);
        setPlaying(false);
      });

      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    },
    [getAudioUrl, totalAyahs, onAyahChange]
  );

  const togglePlay = () => {
    if (!audioRef.current || !playing) {
      playAyah(playingAyah);
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const resumeOrPause = () => {
    if (!audioRef.current) {
      playAyah(playingAyah);
      return;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true));
    }
  };

  const skipNext = () => {
    if (playingAyah < totalAyahs) playAyah(playingAyah + 1);
  };

  const skipPrev = () => {
    if (playingAyah > 1) playAyah(playingAyah - 1);
  };

  const seekTo = (val: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val[0];
      setProgress(val[0]);
    }
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      layout
      className="fixed bottom-[72px] left-0 right-0 z-40 px-3"
    >
      <motion.div
        layout
        className="mx-auto max-w-lg rounded-2xl glass border border-border/50 shadow-xl overflow-hidden"
      >
        {/* Compact bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Play/Pause */}
          <button
            onClick={(e) => { e.stopPropagation(); resumeOrPause(); }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform active:scale-90"
            aria-label={playing ? "Pause" : "Play"}
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            ) : playing ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="h-4 w-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate" style={{ fontFamily: "var(--font-body)" }}>
              {surahName} — Ayah {playingAyah}
            </p>
            <p className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
              Mishary Rashid Alafasy
            </p>
          </div>

          {/* Mini progress */}
          <div className="w-16 h-1 rounded-full bg-primary/20 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Expand chevron */}
          <motion.svg
            animate={{ rotate: expanded ? 180 : 0 }}
            className="h-4 w-4 text-muted-foreground shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m18 15-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>

        {/* Expanded controls */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                {/* Seek slider */}
                <Slider
                  value={[progress]}
                  max={duration || 1}
                  step={0.1}
                  onValueChange={seekTo}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Transport controls */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={skipPrev}
                    disabled={playingAyah <= 1}
                    className="text-foreground disabled:text-muted-foreground/30 transition-colors active:scale-90"
                    aria-label="Previous ayah"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                    </svg>
                  </button>

                  <button
                    onClick={resumeOrPause}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-90"
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {loading ? (
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                      </svg>
                    ) : playing ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={skipNext}
                    disabled={playingAyah >= totalAyahs}
                    className="text-foreground disabled:text-muted-foreground/30 transition-colors active:scale-90"
                    aria-label="Next ayah"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 18h2V6h-2zm-8.5-6 8.5 6V6z" transform="scale(-1,1) translate(-24,0)" />
                      <path d="M16 18h2V6h-2zM4 6l8.5 6L4 18z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
