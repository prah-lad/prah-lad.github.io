"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { data } from "@/lib/data";

const ICONS: Record<string, JSX.Element> = {
  mail: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
    </svg>
  ),
  link: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
    </svg>
  ),
  download: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
    </svg>
  ),
};

function RegisterRow({ reg, index, active, onActivate }: {
  reg: typeof data.registers[0];
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <motion.a
      href={reg.href}
      target={reg.type === "mail" ? undefined : "_blank"}
      rel="noopener noreferrer"
      download={reg.type === "download" ? true : undefined}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={onActivate}
      className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer"
      style={{
        background: active ? "rgba(0,255,136,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "rgba(0,255,136,0.35)" : "rgba(255,255,255,0.07)"}`,
        boxShadow: active ? "0 0 20px rgba(0,255,136,0.1), inset 0 0 20px rgba(0,255,136,0.03)" : "none",
      }}
    >
      {/* Register label */}
      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm"
           style={{
             background: active ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.04)",
             border: `1px solid ${active ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.08)"}`,
             color: active ? "#00FF88" : "rgba(255,255,255,0.4)",
             boxShadow: active ? "0 0 12px rgba(0,255,136,0.3)" : "none",
           }}>
        {reg.id}
      </div>

      {/* Value bus */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono text-white/30 mb-1 uppercase tracking-widest">{reg.label}</div>
        <div className="font-mono text-sm truncate" style={{ color: active ? "#E5E5E5" : "rgba(255,255,255,0.5)" }}>
          {reg.value}
        </div>

        {/* Data bus visualization */}
        {active && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.4 }}
            className="mt-2 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary"
          />
        )}
      </div>

      {/* Access indicator */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <div className="text-white/20 group-hover:text-primary transition-colors">{ICONS[reg.type]}</div>
        <svg className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-200"
             fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
        </svg>
      </div>
    </motion.a>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeReg, setActiveReg] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    try {
      const res = await fetch("https://formspree.io/f/xpqyybap", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) setSubmitted(true);
    } catch { /* silent */ }
    finally { setSending(false); }
  }

  return (
    <section id="contact" ref={ref} className="relative py-20 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/4 rounded-full blur-[150px]" />
      </div>

      {/* Section header */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs text-primary">
            <div className="w-6 h-px bg-primary" />
            <span>DEVICE_06 / REGISTERS</span>
            <div className="w-6 h-px bg-primary" />
          </div>
          <h2 className="text-4xl font-bold font-mono text-white mb-2">
            <span className="text-primary">Registers</span> — Contact
          </h2>
          <p className="text-white/40 font-mono text-sm">// 4 registers loaded · ready for I/O operations</p>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Registers panel */}
          <div>
            {/* Register file header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-5 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest">Register File</span>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="font-mono text-xs text-primary">ACTIVE</span>
                </div>
              </div>

              <div className="space-y-3">
                {data.registers.map((reg, i) => (
                  <RegisterRow
                    key={reg.id}
                    reg={reg}
                    index={i}
                    active={activeReg === i}
                    onActivate={() => setActiveReg(i)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Status block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="font-mono text-xs text-white/25 space-y-1"
            >
              <div><span className="text-primary/50">STATUS</span>: seeking_internships=<span className="text-primary">true</span></div>
              <div><span className="text-primary/50">PREF</span>: backend | data_analytics | software_dev</div>
              <div><span className="text-primary/50">AVAIL</span>: {data.personal.graduation} → ∞</div>
            </motion.div>
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass rounded-xl overflow-hidden">
              {/* Form title bar */}
              <div className="flex items-center gap-2 px-5 py-3 bg-black/20 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                </div>
                <span className="mx-auto font-mono text-xs text-white/30">send_message.sh</span>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="text-4xl mb-4">✓</div>
                      <div className="font-mono text-primary text-lg mb-2">Message transmitted</div>
                      <div className="font-mono text-xs text-white/40">I'll reply soon.</div>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                      <div className="text-xs font-mono text-white/30 mb-4">// compose transmission</div>

                      {[
                        { name: "name", label: "NAME", type: "text", placeholder: "your name", id: "f-name" },
                        { name: "email", label: "EMAIL", type: "email", placeholder: "your@email.com", id: "f-email" },
                      ].map(f => (
                        <div key={f.name}>
                          <label htmlFor={f.id} className="block font-mono text-xs text-white/40 mb-1.5 uppercase tracking-widest">{f.label}</label>
                          <input
                            id={f.id}
                            type={f.type}
                            name={f.name}
                            required
                            placeholder={f.placeholder}
                            autoComplete={f.name === "name" ? "name" : "email"}
                            className="w-full bg-white/3 border border-white/8 rounded-lg px-4 py-3 font-mono text-sm text-white/80
                                       placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/3
                                       transition-all duration-200"
                          />
                        </div>
                      ))}

                      <div>
                        <label htmlFor="f-msg" className="block font-mono text-xs text-white/40 mb-1.5 uppercase tracking-widest">MESSAGE</label>
                        <textarea
                          id="f-msg"
                          name="message"
                          required
                          rows={4}
                          placeholder="tell me about the opportunity..."
                          className="w-full bg-white/3 border border-white/8 rounded-lg px-4 py-3 font-mono text-sm text-white/80
                                     placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/3
                                     transition-all duration-200 resize-none"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={sending}
                        whileHover={!sending ? { scale: 1.01 } : {}}
                        whileTap={!sending ? { scale: 0.99 } : {}}
                        className="w-full py-3.5 rounded-lg font-mono text-sm font-bold text-black cursor-pointer
                                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative overflow-hidden"
                        style={{
                          background: sending ? "rgba(0,255,136,0.5)" : "linear-gradient(135deg, #00FF88, #00d97e)",
                          boxShadow: "0 4px 0 rgba(0,90,50,0.5), 0 8px 30px rgba(0,255,136,0.2)",
                        }}
                      >
                        {sending ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin text-base">⟳</span> transmitting...
                          </span>
                        ) : "Send Message →"}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="relative z-10 max-w-6xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <span className="font-mono text-sm font-bold text-primary">PPR/</span>
        <span className="font-mono text-xs text-white/30">© {new Date().getFullYear()} Prahlad Puspa Regmi · Portfolio OS v2.0</span>
        <div className="flex gap-6">
          {[
            { label: "GitHub", href: data.personal.github },
            { label: "LinkedIn", href: data.personal.linkedin },
            { label: "Email", href: `mailto:${data.personal.email}` },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
               className="font-mono text-xs text-white/40 hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      </motion.footer>
    </section>
  );
}
