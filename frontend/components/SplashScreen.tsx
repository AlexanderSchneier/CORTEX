"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Typewriter from "@/components/Typewriter";

export type SplashScreenProps = {
  logoSrc?: string;
  companyName: string;
  bgClassName?: string; // tailwind classes for background
  textClassName?: string; // tailwind classes for text
  minDisplayMs?: number; // minimum time to show splash
  maxDisplayMs?: number; // maximum time before auto-dismiss
  dismissOnClick?: boolean;
  onFinish?: () => void;
};

/**
 * Fullscreen splash with logo and typewriter title.
 * Provides reduced-motion support and keyboard/click dismissal.
 */
export default function SplashScreen({
  logoSrc = "/logo.png",
  companyName,
  bgClassName = "bg-white",
  textClassName = "text-gray-900",
  minDisplayMs = 900,
  maxDisplayMs = 3000,
  dismissOnClick = true,
  onFinish,
}: SplashScreenProps) {
  const [typeDone, setTypeDone] = useState(false);
  const [canDismissAt, setCanDismissAt] = useState<number>(() => Date.now() + minDisplayMs);
  const finishedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // set an absolute guard to dismiss at maxDisplayMs
    timeoutRef.current = window.setTimeout(() => {
      complete();
    }, maxDisplayMs);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [maxDisplayMs]);

  useEffect(() => {
    // allow dismissal after min display time
    const t = window.setTimeout(() => setCanDismissAt(Date.now()), minDisplayMs);
    return () => window.clearTimeout(t);
  }, [minDisplayMs]);

  const tryDismiss = useCallback(() => {
    if (Date.now() >= canDismissAt && typeDone) {
      complete();
    }
  }, [canDismissAt, typeDone]);

  const complete = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish?.();
  }, [onFinish]);

  // Keyboard skip support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tryDismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tryDismiss]);

  const handleTypeDone = useCallback(() => {
    setTypeDone(true);
    // in case min time already elapsed, try to dismiss
    if (Date.now() >= canDismissAt) complete();
  }, [canDismissAt, complete]);

  return (
    <div
      role="dialog"
      aria-label="Welcome"
      aria-modal="true"
      className={`${bgClassName} fixed inset-0 z-50 flex items-center justify-center`} 
      onClick={dismissOnClick ? tryDismiss : undefined}
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center select-none">
        <img
          src={logoSrc}
          alt="Company logo"
          className="w-24 h-24 object-contain drop-shadow-sm"
          draggable={false}
        />
        <Typewriter
          text={companyName}
          speedMs={65}
          startDelayMs={300}
          showCursor
          onDone={handleTypeDone}
          className={`text-3xl sm:text-4xl md:text-5xl font-semibold ${textClassName}`}
        />
        <div className="text-xs text-gray-500 mt-2" aria-hidden>
          {"Press Enter or click to continue"}
        </div>
      </div>
    </div>
  );
}
