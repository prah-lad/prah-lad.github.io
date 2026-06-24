"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { data } from "@/lib/data";

function BinaryStream({ column }: { column: number }) {
  const bits = Array.from({ length: 20 }, () => Math.round(Math.random()));
  return (
    <div className="absolute top-0 bottom-0 flex flex-col gap-1 pointer-events-none"
         style={{ left: `${column * 5}%`, opacity: 0.06 + Math.random() * 0.06 }}>
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="font-mono text-[10px] text-primary leading-none"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5 + Math.random(), delay: i * 0.1 + Math.random(), repeat: Infinity }}
        >
          {b}
        </motion.span>
      ))}
    </div>
  );
}

function LogicGate({ type, x, y }: { type: string; x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x="0" y="0" fontSize="10" fill="rgba(0,255,136,0.3)" fontFamily="monospace">{type}</text>
    </g>
  );
}

function AwardCard({ award, index }: { award: typeof data.awards[0]; index: number }) {
  const done = award.result === "SUCCESS";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="relative rounded-xl overflow-hidden group"
      style={{
        background: "rgba(10,16,25,0.9)",
        border: "1px solid rgba(0,255,136,0.1)",
      }}
    >
      {/* Gradient top border on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Hex opcode badge */}
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-mono text-xs text-primary font-bold">
              {award.opcode}
            </div>
            <div>
              <div className="text-xs font-mono text-white/30 mb-0.5">{award.id}</div>
              <h3 className="font-bold text-white font-mono text-base leading-tight">{award.title}</h3>
            </div>
          </div>

          {/* Result indicator */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={done ? { boxShadow: ["0 0 4px #00FF88", "0 0 12px #00FF88", "0 0 4px #00FF88"] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ background: done ? "#00FF88" : "#FFB347" }}
            />
            <span className="text-[10px] font-mono" style={{ color: done ? "#00FF88" : "#FFB347" }}>
              {award.result}
            </span>
          </div>
        </div>

        <div className="text-xs font-mono text-secondary mb-3">{award.org}</div>
        <p className="text-sm text-white/55 leading-relaxed">{award.desc}</p>

        {/* Computation result metaphor */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="font-mono text-xs text-white/25">
            <span className="text-primary/50">ALU</span>
            <span className="text-white/30"> → </span>
            <span className="text-[#86efac]/60">Achievement.compute({award.id})</span>
            <span className="text-white/30"> = </span>
            <span style={{ color: done ? "#00FF88" : "#FFB347" }}>{award.result}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Awards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="awards" ref={ref} className="relative py-20 bg-[#070b10] overflow-hidden">
      {/* Binary stream background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => <BinaryStream key={i} column={i} />)}
      </div>

      {/* Circuit SVG overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%">
          <LogicGate type="AND" x={50} y={100} />
          <LogicGate type="OR" x={200} y={250} />
          <LogicGate type="XOR" x={400} y={150} />
          <LogicGate type="NOT" x={600} y={300} />
          <LogicGate type="NAND" x={100} y={400} />
          <LogicGate type="NOR" x={500} y={50} />
          {/* Animated traces */}
          {[[0,200,300,200],[300,200,500,300],[100,100,300,100]].map(([x1,y1,x2,y2],i) => (
            <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#00FF88" strokeWidth="0.5" strokeDasharray="4 8"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            />
          ))}
        </svg>
      </div>

      {/* Section header */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs text-secondary">
            <div className="w-6 h-px bg-secondary" />
            <span>DEVICE_05 / ALU</span>
            <div className="w-6 h-px bg-secondary" />
          </div>
          <h2 className="text-4xl font-bold font-mono text-white mb-2">
            <span className="text-secondary">ALU</span> — Awards & Recognition
          </h2>
          <p className="text-white/40 font-mono text-sm">// arithmetic logic unit — computing achievements...</p>
        </motion.div>
      </div>

      {/* ALU visual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        className="relative z-10 max-w-6xl mx-auto px-6 mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-8 font-mono text-xs text-white/25">
          {["INPUT_A", "→", "ALU", "→", "OUTPUT", "OVERFLOW: 0", "CARRY: 1", "ZERO: 0"].map((t, i) => (
            <span key={i} style={{ color: t === "ALU" ? "#00C8FF" : t.includes(":") ? "#00FF88" : undefined }}>
              {t}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Award cards */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.awards.map((award, i) => (
            <AwardCard key={award.id} award={award} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
