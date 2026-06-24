"use client";
import { motion } from "framer-motion";

export default function WireTransition({ label, color = "#00FF88" }: { label?: string; color?: string }) {
  return (
    <div className="relative flex flex-col items-center py-2" aria-hidden="true">
      {/* Vertical wire */}
      <div className="relative w-px h-24" style={{ background: `linear-gradient(180deg, transparent, ${color}60, ${color}, ${color}60, transparent)` }}>
        {/* Traveling data packet */}
        {[0, 0.6, 1.2].map(delay => (
          <motion.div
            key={delay}
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px ${color}, 0 0 16px ${color}60` }}
            animate={{ top: ["-4px", "calc(100% + 4px)"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* Node connector */}
      {label && (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <div className="px-3 py-1 rounded-full font-mono text-[10px] whitespace-nowrap"
               style={{
                 background: `${color}15`,
                 border: `1px solid ${color}40`,
                 color: color,
               }}>
            {label}
          </div>
        </div>
      )}
    </div>
  );
}
