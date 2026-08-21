import { useEffect, useState } from "react";
import { LogoLockup } from "@/components/brand/Logo";

/** Animated brand splash shown once per browser session. */
export function SplashLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    try {
      if (sessionStorage.getItem("hashem-splash") !== "seen") {
        setShow(true);
        sessionStorage.setItem("hashem-splash", "seen");
        timer = setTimeout(() => setShow(false), 1200);
      }
    } catch {
      setShow(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 animate-out fade-out fill-mode-forwards pointer-events-none">
      <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
        <LogoLockup size={92} stacked />
        <span className="h-0.5 w-36 rounded-full bg-gold-gradient" />
      </div>
    </div>
  );
}
