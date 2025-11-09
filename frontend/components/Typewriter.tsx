"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type TypewriterProps = {
  text: string;
  /** milliseconds per character */
  speedMs?: number;
  /** delay before starting */
  startDelayMs?: number;
  /** show blinking cursor */
  showCursor?: boolean;
  className?: string;
  onDone?: () => void;
};

/**
 * Accessible, lightweight typewriter effect.
 * Respects prefers-reduced-motion: in that case, it renders the full text after a brief delay.
 */
export default function Typewriter({
  text,
  speedMs = 60,
  startDelayMs = 300,
  showCursor = true,
  className,
  onDone,
}: TypewriterProps) {
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    // cleanup any timers on unmount
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, []);

  useEffect(() => {
    // reset when text changes
    setOutput("");
    setDone(false);

    const start = () => {
      if (reducedMotion) {
        const t = window.setTimeout(() => {
          setOutput(text);
          setDone(true);
          onDone?.();
        }, 150);
        timers.current.push(t);
        return;
      }

      let acc = "";
      for (let i = 0; i < text.length; i++) {
        const t = window.setTimeout(() => {
          acc += text[i];
          setOutput(acc);
          if (i === text.length - 1) {
            setDone(true);
            onDone?.();
          }
        }, startDelayMs + i * speedMs);
        timers.current.push(t);
      }
    };

    const t0 = window.setTimeout(start, 0);
    timers.current.push(t0);
  }, [text, speedMs, startDelayMs, reducedMotion, onDone]);

  return (
    <div aria-live="polite" aria-atomic className={className}>
      <span>{output}</span>
      {showCursor && (
        <span
          className={`inline-block w-[1ch] -ml-[1ch] ${done ? "opacity-0" : "animate-pulse"}`}
          aria-hidden
        >
          |
        </span>
      )}
    </div>
  );
}
