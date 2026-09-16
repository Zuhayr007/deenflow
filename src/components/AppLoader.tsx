import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie, EventListener } from "@lottiefiles/dotlottie-web";

export function AppLoader({ onComplete }: { onComplete: () => void }) {
  const [isClosing, setIsClosing] = useState(false);
  const dotLottieRef = useRef<DotLottie | null>(null);

  useEffect(() => {
    const animation = dotLottieRef.current;
    if (!animation) return;

    const handleComplete: EventListener<"complete"> = () => {
      setIsClosing(true);
      window.setTimeout(() => onComplete(), 420);
    };

    animation.addEventListener("complete", handleComplete);

    return () => {
      animation.removeEventListener("complete", handleComplete);
    };
  }, [onComplete]);

  return (
    <div
      className={`app-loader-shell ${isClosing ? "app-loader-shell--closing" : ""}`}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="app-loader-content">
        <div className="app-loader-viewport">
          <DotLottieReact
            src="https://lottie.host/ebf1ee70-0bbb-41d0-a172-93934d4d9387/Y9iq0pXuMe.lottie"
            autoplay
            loop={false}
            speed={1}
            renderConfig={{ autoResize: true }}
            className="app-loader-animation"
            dotLottieRefCallback={(dotLottie) => {
              dotLottieRef.current = dotLottie;
            }}
          />
        </div>

        <div className="app-loader-brand-wrap">
          <span className="app-loader-brand">Deen Flow</span>
        </div>
      </div>
    </div>
  );
}
