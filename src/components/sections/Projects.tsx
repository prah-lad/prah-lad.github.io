"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { data } from "@/lib/data";

const STATUS_COLORS: Record<string, string> = {
  LIVE: "#00FF88",
  COMPLETE: "#00C8FF",
  IN_DEV: "#FFB347",
};

function DataPacket({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-primary"
      style={{ boxShadow: "0 0 6px #00FF88" }}
      initial={{ left: "0%", top: "50%", opacity: 0 }}
      animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.5, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

function ProjectCard({ project, index }: { project: typeof data.projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const statusColor = STATUS_COLORS[project.status] || "#00FF88";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.01 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`relative rounded-xl overflow-hidden cursor-default ${project.featured ? "lg:col-span-2" : ""}`}
      style={{
        background: hovered ? "rgba(15,25,38,0.98)" : "rgba(12,18,28,0.9)",
        border: `1px solid ${hovered ? statusColor + "40" : "rgba(255,255,255,0.06)"}`,
        boxShadow: hovered ? `0 0 30px ${statusColor}15, 0 20px 60px rgba(0,0,0,0.4)` : "0 4px 20px rgba(0,0,0,0.3)",
        transition: "all 0.25s ease",
      }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${statusColor}, transparent)` }} />

      {/* Data flow animation (on hover) */}
      <AnimatePresence>
        {hovered && (
          <div className="absolute inset-x-0 top-0.5 h-0.5 overflow-hidden pointer-events-none">
            {[0, 0.4, 0.8].map(d => <DataPacket key={d} delay={d} />)}
          </div>
        )}
      </AnimatePresence>

      <div className="p-6">
        {/* Module header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            {project.featured && (
              <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded mb-2"
                    style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40` }}>
                FEATURED MODULE
              </span>
            )}
            <div className="text-xs font-mono text-white/30 mb-1">{project.id} · {project.category}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
            <span className="text-[10px] font-mono" style={{ color: statusColor }}>{project.status}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold font-mono text-white mb-2 leading-tight">{project.title}</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-5 font-sans">{project.description}</p>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.stack.map(s => (
            <span key={s} className="text-xs font-mono px-2 py-0.5 rounded border border-white/8 bg-white/3 text-white/50">
              {s}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-primary transition-colors group">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-secondary transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState("ALL");

  const categories = ["ALL", "AI", "IoT", "Full-Stack", "Data", "Algorithms"];
  const filtered = filter === "ALL" ? data.projects :
    data.projects.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section id="projects" ref={ref} className="relative py-20 overflow-hidden">
      {/* Background circuit pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 0 L10 8 M10 12 L10 20 M0 10 L8 10 M12 10 L20 10" stroke="rgba(0,255,136,0.06)" strokeWidth="0.5" fill="none"/>
              <circle cx="10" cy="10" r="1.5" fill="none" stroke="rgba(0,255,136,0.06)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs text-warn">
            <div className="w-6 h-px bg-warn" />
            <span>DEVICE_04 / CONTROL_UNIT</span>
            <div className="w-6 h-px bg-warn" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <div>
              <h2 className="text-4xl font-bold font-mono text-white mb-2">
                <span className="text-warn">Control Unit</span> — Projects
              </h2>
              <p className="text-white/40 font-mono text-sm">// {data.projects.length} instruction modules loaded</p>
            </div>
            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-3 py-1 rounded font-mono text-xs transition-all duration-200 cursor-pointer"
                  style={{
                    background: filter === cat ? "rgba(255,179,71,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${filter === cat ? "#FFB34780" : "rgba(255,255,255,0.1)"}`,
                    color: filter === cat ? "#FFB347" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
