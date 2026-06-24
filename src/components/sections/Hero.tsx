"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { data } from "@/lib/data";

const TERMINAL_LINES = [
  { prompt: "$ ", cmd: "whoami", output: "Prahlad Regmi" },
  { prompt: "$ ", cmd: "cat university.txt", output: "Youngstown State University — CS, Dec 2026" },
  { prompt: "$ ", cmd: "ls skills/", output: data.skills.join("  ") },
  { prompt: "$ ", cmd: "cat status.txt", output: "✓ open_to_internships = true" },
  { prompt: "$ ", cmd: "", output: "" },
];

function useTypingEffect(lines: typeof TERMINAL_LINES) {
  const [displayed, setDisplayed] = useState<{ prompt: string; cmd: string; output: string; done: boolean }[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "output" | "pause">("typing");

  useEffect(() => {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];

    if (phase === "typing") {
      if (charIdx < line.cmd.length) {
        const t = setTimeout(() => {
          setDisplayed(prev => {
            const next = [...prev];
            if (next[lineIdx]) {
              next[lineIdx] = { ...next[lineIdx], cmd: line.cmd.slice(0, charIdx + 1), done: false };
            } else {
              next.push({ prompt: line.prompt, cmd: line.cmd.slice(0, charIdx + 1), output: "", done: false });
            }
            return next;
          });
          setCharIdx(c => c + 1);
        }, 60 + Math.random() * 40);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("output"), 200);
        return () => clearTimeout(t);
      }
    }

    if (phase === "output") {
      setDisplayed(prev => {
        const next = [...prev];
        if (next[lineIdx]) next[lineIdx] = { ...next[lineIdx], output: line.output, done: true };
        return next;
      });
      const t = setTimeout(() => setPhase("pause"), 400);
      return () => clearTimeout(t);
    }

    if (phase === "pause") {
      const t = setTimeout(() => {
        setLineIdx(i => i + 1);
        setCharIdx(0);
        setPhase("typing");
      }, 500);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx, phase, lines]);

  return { displayed, currentLine: lineIdx, phase };
}

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-sm text-white/80">{time}</span>;
}

function DesktopIcon({ label, icon, delay }: { label: string; icon: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="flex flex-col items-center gap-1.5 cursor-pointer group"
    >
      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl
                      group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-200
                      group-hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]">
        {icon}
      </div>
      <span className="text-xs text-white/70 group-hover:text-primary transition-colors font-mono">{label}</span>
    </motion.div>
  );
}

export default function Hero({ onScrollDown }: { onScrollDown?: () => void }) {
  const { displayed, currentLine, phase } = useTypingEffect(TERMINAL_LINES);
  const [bootDone, setBootDone] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [displayed]);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden hex-bg" id="home">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      {/* ── TOP BAR (GNOME-style panel) ── */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="desktop-panel z-50 flex items-center justify-between px-6 py-2 relative"
      >
        {/* Left: App menu + Activities */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary/80 shadow-[0_0_8px_#00FF88]" />
            <span className="font-mono text-sm text-primary font-medium">Portfolio OS</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex gap-3">
            {["Applications", "Places", "System"].map(m => (
              <span key={m} className="text-xs text-white/50 hover:text-white/90 cursor-pointer transition-colors font-mono">{m}</span>
            ))}
          </div>
        </div>

        {/* Center: workspace */}
        <div className="hidden sm:flex items-center gap-2">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={`w-6 h-4 rounded-sm text-[9px] font-mono flex items-center justify-center
              ${n === 1 ? "bg-primary/20 border border-primary/50 text-primary" : "bg-white/5 border border-white/10 text-white/30"}`}>
              {n}
            </div>
          ))}
        </div>

        {/* Right: system tray */}
        <div className="flex items-center gap-4">
          {/* WiFi */}
          <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 7.5C5.143 3.357 10.143 1.5 12 1.5s6.857 1.857 11 6L12 22.5 1 7.5z" opacity="0.3"/>
            <path d="M5 11.5C7.5 9 10 7.5 12 7.5s4.5 1.5 7 4L12 18.5 5 11.5z" opacity="0.6"/>
            <path d="M8.5 14.5C9.8 13.2 11 12.5 12 12.5s2.2.7 3.5 2L12 18l-3.5-3.5z"/>
          </svg>
          {/* Battery */}
          <div className="flex items-center gap-1">
            <div className="w-6 h-3 border border-white/40 rounded-sm relative">
              <div className="absolute inset-0.5 right-1 bg-primary/70 rounded-sm" style={{ width: "75%" }} />
            </div>
            <div className="w-0.5 h-1.5 bg-white/40 rounded-r-sm" />
            <span className="text-[10px] text-white/50 font-mono">75%</span>
          </div>
          <Clock />
        </div>
      </motion.div>

      {/* ── DESKTOP AREA ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">

        {/* Desktop icons (left side) */}
        <div className="absolute left-6 top-8 hidden lg:flex flex-col gap-4">
          <DesktopIcon label="Resume.pdf" icon="📄" delay={0.6} />
          <DesktopIcon label="Projects/" icon="📁" delay={0.7} />
          <DesktopIcon label="GitHub" icon="⬡" delay={0.8} />
          <DesktopIcon label="LinkedIn" icon="🔗" delay={0.9} />
        </div>

        {/* Main hero content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs text-primary">system online — seeking internships</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-mono mb-3 leading-none">
            <span className="text-white">My </span>
            <span className="text-primary glow-green">Portfolio</span>
            <span className="text-white"> OS</span>
          </h1>

          <div className="mt-4 mb-2 text-3xl sm:text-4xl font-mono font-semibold text-white/90">
            {data.personal.shortName}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {data.personal.titles.map((t, i) => (
              <span key={i} className="font-mono text-sm px-3 py-1 rounded border border-white/10 bg-white/5 text-white/60">
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── TERMINAL WINDOW ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full max-w-2xl glass rounded-xl overflow-hidden shadow-2xl border-gradient"
          style={{ boxShadow: "0 0 40px rgba(0,255,136,0.12), 0 30px 80px rgba(0,0,0,0.5)" }}
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-110" />
              <div className="w-3 h-3 rounded-full bg-[#28CA41] hover:brightness-110" />
            </div>
            <span className="mx-auto font-mono text-xs text-white/40">prahlad@portfolio-os: ~</span>
          </div>

          {/* Terminal body */}
          <div ref={termRef} className="p-5 font-mono text-sm space-y-2 min-h-[220px] max-h-[300px] overflow-y-auto scrollbar-none">
            {/* Boot message */}
            <AnimatePresence>
              {!bootDone && (
                <motion.div exit={{ opacity: 0 }} className="text-primary/60 text-xs mb-3">
                  Portfolio OS v1.0 — booting...
                </motion.div>
              )}
            </AnimatePresence>

            {displayed.map((line, i) => (
              <div key={i} className="space-y-0.5">
                <div className="flex">
                  <span className="text-primary">prahlad</span>
                  <span className="text-white/40">@portfolio-os</span>
                  <span className="text-white/40">:</span>
                  <span className="text-secondary">~</span>
                  <span className="text-white/40 mr-2">$</span>
                  <span className="text-white">{line.cmd}</span>
                  {i === currentLine && phase === "typing" && (
                    <span className="ml-0.5 text-primary animate-[blinkCursor_1s_step-end_infinite]">█</span>
                  )}
                </div>
                {line.output && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/70 pl-0 text-xs leading-relaxed"
                  >
                    {line.output}
                  </motion.div>
                )}
              </div>
            ))}

            {/* Active cursor at bottom */}
            {currentLine >= TERMINAL_LINES.length && (
              <div className="flex">
                <span className="text-primary">prahlad</span>
                <span className="text-white/40">@portfolio-os</span>
                <span className="text-white/40">:</span>
                <span className="text-secondary">~</span>
                <span className="text-white/40 mr-2">$</span>
                <span className="text-primary animate-[blinkCursor_1s_step-end_infinite]">█</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Scroll CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={onScrollDown}
          className="mt-10 flex flex-col items-center gap-2 text-white/40 hover:text-primary transition-colors font-mono text-xs group cursor-pointer"
        >
          <span>scroll to enter the system</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border border-white/20 rounded-full flex items-start justify-center pt-2 group-hover:border-primary/50"
          >
            <div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.button>
      </div>

      {/* Bottom dock */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="relative z-10 flex justify-center pb-4"
      >
        <div className="flex items-end gap-2 px-4 py-2 glass rounded-2xl">
          {[
            { icon: "⬛", label: "Terminal" },
            { icon: "📁", label: "Files" },
            { icon: "🌐", label: "Browser" },
            { icon: "⚙️", label: "Settings" },
            { icon: "👤", label: "About" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.3, y: -8 }}
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center
                         text-xl cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all"
              title={item.label}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
