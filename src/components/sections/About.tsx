"use client";
import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { data } from "@/lib/data";

function Monitor3D({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <div ref={ref} className="perspective-[1200px]" onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Monitor body */}
        <div className="relative mx-auto" style={{ maxWidth: 680 }}>
          {/* Screen bezel */}
          <div className="relative rounded-2xl p-3 bg-gradient-to-b from-[#1a2030] to-[#0d141f]"
               style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.8), 0 0 80px rgba(0,255,136,0.06)" }}>

            {/* Screen glow ring */}
            <div className="absolute -inset-1 rounded-2xl blur-lg bg-gradient-to-b from-primary/10 to-secondary/5 -z-10" />

            {/* Screen */}
            <div className="rounded-xl overflow-hidden relative bg-[#0B0F14] scanlines crt"
                 style={{ minHeight: 420 }}>
              {/* Screen reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-20" />
              {/* Scan line animation */}
              <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none z-30"
                   style={{ animation: "scanLine 4s linear infinite", top: 0 }} />
              {children}
            </div>

            {/* Webcam dot */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#222] border border-white/10">
              <div className="absolute inset-0.5 rounded-full bg-[#0a1a0a] flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-primary/50 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Monitor stand neck */}
          <div className="mx-auto mt-0 w-24 h-8 bg-gradient-to-b from-[#1a2030] to-[#141c28] clip-path-trapezoid"
               style={{ clipPath: "polygon(30% 0, 70% 0, 85% 100%, 15% 100%)" }} />

          {/* Monitor base */}
          <div className="mx-auto w-56 h-4 rounded-full bg-gradient-to-b from-[#1a2030] to-[#0d141f]"
               style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }} />
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ n, label, color }: { n: string; label: string; color: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/3 border border-white/5 text-center hover:border-primary/20 transition-colors">
      <div className="text-2xl font-bold font-mono" style={{ color }}>{n}</div>
      <div className="text-xs text-white/40 font-mono mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const skillCategories = [
    { label: "Languages", color: "#00FF88", items: ["Python", "JavaScript", "TypeScript", "C++", "Java", "SQL", "C#"] },
    { label: "Data & Analytics", color: "#00C8FF", items: ["Pandas", "NumPy", "Excel", "Tableau", "Data Cleaning"] },
    { label: "Backend & Tools", color: "#FFB347", items: ["Flask", "REST APIs", "Git/GitHub", "Jupyter", "Oracle DB"] },
    { label: "Hardware / IoT", color: "#a855f7", items: ["ESP32", "HC-SR04", "Arduino", "WiFi HTTP"] },
  ];

  return (
    <section id="about" ref={ref} className="relative py-20 overflow-hidden">
      {/* Section header */}
      <div className="max-w-5xl mx-auto px-6 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs text-secondary">
            <div className="w-6 h-px bg-secondary" />
            <span>DEVICE_02 / DISPLAY</span>
            <div className="w-6 h-px bg-secondary" />
          </div>
          <h2 className="text-4xl font-bold font-mono text-white mb-2">
            <span className="text-secondary">Monitor</span> — About Me
          </h2>
          <p className="text-white/40 font-mono text-sm">// rendering profile data...</p>
        </motion.div>
      </div>

      {/* 3D Monitor */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto px-6 mb-16"
      >
        <Monitor3D>
          {/* Screen content — looks like a Linux desktop/app */}
          <div className="p-6 h-full">
            {/* Fake window title bar */}
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
              </div>
              <span className="font-mono text-xs text-white/30 mx-auto">profile.json — Text Editor</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-sm">
              {/* JSON-style about */}
              <div className="md:col-span-2 text-left">
                <div className="text-white/30 text-xs mb-3">// prahlad.profile</div>
                <div className="space-y-1 text-xs leading-relaxed">
                  <div><span className="text-secondary">"name"</span><span className="text-white/40">: </span><span className="text-[#86efac]">"{data.personal.name}"</span></div>
                  <div><span className="text-secondary">"university"</span><span className="text-white/40">: </span><span className="text-[#86efac]">"{data.personal.university}"</span></div>
                  <div><span className="text-secondary">"degree"</span><span className="text-white/40">: </span><span className="text-[#86efac]">"{data.personal.degree}"</span></div>
                  <div><span className="text-secondary">"gpa"</span><span className="text-white/40">: </span><span className="text-warn">{data.personal.gpa}</span></div>
                  <div><span className="text-secondary">"graduation"</span><span className="text-white/40">: </span><span className="text-[#86efac]">"{data.personal.graduation}"</span></div>
                  <div><span className="text-secondary">"location"</span><span className="text-white/40">: </span><span className="text-[#86efac]">"{data.personal.location}"</span></div>
                  <div className="mt-3 pt-3 border-t border-white/5 text-white/50 leading-relaxed">
                    {data.personal.about}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 content-start">
                <StatCard n="3.56" label="GPA" color="#00FF88" />
                <StatCard n="2+" label="Yrs Exp" color="#00C8FF" />
                <StatCard n="6+" label="Projects" color="#FFB347" />
                <StatCard n="3" label="Roles" color="#a855f7" />
              </div>
            </div>
          </div>
        </Monitor3D>
      </motion.div>

      {/* Skills grid */}
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + ci * 0.1 }}
              className="glass rounded-xl p-4"
              style={{ borderColor: `${cat.color}20` }}
            >
              <div className="text-xs font-mono mb-3 uppercase tracking-widest" style={{ color: cat.color }}>
                {cat.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map(skill => (
                  <button
                    key={skill}
                    onMouseEnter={() => setActiveSkill(skill)}
                    onMouseLeave={() => setActiveSkill(null)}
                    className="text-xs font-mono px-2 py-1 rounded border border-white/8 bg-white/3 text-white/60
                               hover:text-white hover:border-current transition-all duration-150 cursor-pointer"
                    style={{ color: activeSkill === skill ? cat.color : undefined, borderColor: activeSkill === skill ? `${cat.color}60` : undefined }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
