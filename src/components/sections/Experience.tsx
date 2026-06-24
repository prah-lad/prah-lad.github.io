"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { data } from "@/lib/data";

function CPUDie({ activeCore, onCoreClick }: {
  activeCore: number | null;
  onCoreClick: (i: number) => void;
}) {
  return (
    <div className="relative mx-auto" style={{ width: 320, height: 320 }}>
      {/* Die substrate */}
      <div className="absolute inset-0 rounded-lg border-2 border-white/10 bg-gradient-to-br from-[#1a2535] to-[#0d1520]"
           style={{ boxShadow: "0 0 60px rgba(0,255,136,0.08), inset 0 0 40px rgba(0,0,0,0.5)" }}>

        {/* Circuit traces - decorative */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
          {/* Horizontal traces */}
          {[80, 160, 240].map(y => (
            <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(0,255,136,0.06)" strokeWidth="1" strokeDasharray="4 8" />
          ))}
          {/* Vertical traces */}
          {[80, 160, 240].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="320" stroke="rgba(0,200,255,0.06)" strokeWidth="1" strokeDasharray="4 8" />
          ))}
          {/* Corner pads */}
          {[[20,20],[300,20],[20,300],[300,300]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          ))}
        </svg>

        {/* Central bus indicator */}
        <div className="absolute inset-[38%] rounded bg-[#0a1420] border border-white/10 flex items-center justify-center">
          <div className="text-[8px] font-mono text-white/30 text-center leading-tight">
            BUS<br/>64-bit
          </div>
        </div>

        {/* 4 CPU Cores — positioned in quadrants */}
        {data.experience.map((exp, i) => {
          const positions = [
            { top: "8%", left: "8%" },
            { top: "8%", right: "8%" },
            { bottom: "8%", left: "8%" },
            { bottom: "8%", right: "8%" },
          ];
          const active = activeCore === i;
          return (
            <motion.button
              key={exp.id}
              onClick={() => onCoreClick(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="absolute w-[34%] h-[34%] rounded-lg font-mono text-xs cursor-pointer transition-all duration-300"
              style={{
                ...positions[i],
                background: active ? `${exp.color}18` : "rgba(15,25,35,0.9)",
                border: `1px solid ${active ? exp.color : "rgba(255,255,255,0.08)"}`,
                boxShadow: active ? `0 0 20px ${exp.color}40, inset 0 0 15px ${exp.color}10` : "none",
              }}
            >
              <div className="flex flex-col items-center justify-center h-full gap-1 p-1">
                {/* Core activity bars */}
                <div className="flex gap-0.5 mb-1">
                  {[...Array(4)].map((_, j) => (
                    <motion.div
                      key={j}
                      className="w-1 rounded-full"
                      style={{ background: exp.color }}
                      animate={active ? {
                        height: ["4px", `${8 + Math.random() * 12}px`, "4px"],
                      } : { height: "3px", opacity: 0.3 }}
                      transition={{ duration: 0.3 + j * 0.1, repeat: Infinity, repeatType: "reverse" }}
                    />
                  ))}
                </div>
                <div className="text-[9px] font-bold" style={{ color: exp.color }}>{exp.id}</div>
                <div className="text-white/30 text-[8px] text-center leading-tight px-1 hidden sm:block">
                  {exp.title.split(" ").slice(0, 2).join(" ")}
                </div>
                {/* Load indicator */}
                <div className="w-full px-2 mt-1">
                  <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: exp.color }}
                      animate={active ? { width: ["20%", "90%", "40%", "70%"] } : { width: "20%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}

        {/* Pin rows (decorative) */}
        {["top", "bottom"].map(side => (
          <div key={side} className={`absolute inset-x-0 flex justify-around px-4 ${side === "top" ? "-top-2" : "-bottom-2"}`}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-1 h-2 bg-[#888] rounded-full opacity-60" />
            ))}
          </div>
        ))}
        {["left", "right"].map(side => (
          <div key={side} className={`absolute inset-y-0 flex flex-col justify-around py-4 ${side === "left" ? "-left-2" : "-right-2"}`}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2 h-1 bg-[#888] rounded-full opacity-60" />
            ))}
          </div>
        ))}
      </div>

      {/* CPU label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-white/30 whitespace-nowrap">
        PPR-CPU-X86 @ 3.6GHz · 4-Core
      </div>
    </div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCore, setActiveCore] = useState<number | null>(0);

  const handleCoreClick = (i: number) => setActiveCore(prev => prev === i ? null : i);
  const active = activeCore !== null ? data.experience[activeCore] : null;

  return (
    <section id="experience" ref={ref} className="relative py-20 bg-[#070b10] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />
      </div>

      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 mb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs text-primary">
            <div className="w-6 h-px bg-primary" />
            <span>DEVICE_03 / CPU</span>
            <div className="w-6 h-px bg-primary" />
          </div>
          <h2 className="text-4xl font-bold font-mono text-white mb-2">
            <span className="text-primary">CPU</span> — Experience
          </h2>
          <p className="text-white/40 font-mono text-sm">// click a core to inspect</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* CPU visualization */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex justify-center pt-10"
          >
            <CPUDie activeCore={activeCore} onCoreClick={handleCoreClick} />
          </motion.div>

          {/* Core detail panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Core selector tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {data.experience.map((exp, i) => (
                <button
                  key={exp.id}
                  onClick={() => handleCoreClick(i)}
                  className="px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 cursor-pointer"
                  style={{
                    background: activeCore === i ? `${exp.color}18` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${activeCore === i ? exp.color : "rgba(255,255,255,0.1)"}`,
                    color: activeCore === i ? exp.color : "rgba(255,255,255,0.4)",
                  }}
                >
                  {exp.id}
                </button>
              ))}
            </div>

            {/* Active core details */}
            <div className="glass rounded-xl p-6 min-h-[300px]" style={{ borderColor: active ? `${active.color}25` : undefined }}>
              {active ? (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Core status header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: active.color, boxShadow: `0 0 6px ${active.color}` }} />
                      <span className="font-mono text-xs" style={{ color: active.color }}>CORE {active.id} — ACTIVE</span>
                    </div>
                    <span className="font-mono text-xs text-white/30">{active.period}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-xl font-mono leading-tight">{active.title}</h3>
                    <div className="text-sm text-white/50 font-mono mt-1">{active.org} · {active.location}</div>
                  </div>

                  {/* Instruction register metaphor */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-white/30 uppercase tracking-widest">// instruction log</div>
                    {active.bullets.map((b, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex gap-3 text-sm"
                      >
                        <span className="font-mono text-xs mt-0.5 flex-shrink-0" style={{ color: active.color }}>→</span>
                        <span className="text-white/70 leading-relaxed">{b}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CPU registers visual */}
                  <div className="grid grid-cols-4 gap-1.5 pt-2">
                    {["EAX", "EBX", "ECX", "EDX"].map(reg => (
                      <div key={reg} className="text-center p-1.5 rounded bg-white/3 border border-white/5">
                        <div className="text-[10px] font-mono text-white/30">{reg}</div>
                        <div className="text-[9px] font-mono mt-0.5" style={{ color: active.color }}>
                          0x{Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, "0").toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-white/20 font-mono text-sm">
                  — select a core —
                </div>
              )}
            </div>

            {/* Clock cycle indicator */}
            <div className="flex items-center gap-3 font-mono text-xs text-white/30">
              <div className="flex gap-0.5">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-primary"
                    animate={{ height: ["4px", "12px", "4px"] }}
                    transition={{ duration: 0.4, delay: i * 0.05, repeat: Infinity }}
                  />
                ))}
              </div>
              <span>3.6 GHz · {data.experience.length} cores · 64-bit</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
