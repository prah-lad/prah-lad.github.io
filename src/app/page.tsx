"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Awards from "@/components/sections/Awards";
import Contact from "@/components/sections/Contact";
import WireTransition from "@/components/ui/WireTransition";

/* ── Floating Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const sections = ["home", "about", "experience", "projects", "awards", "contact"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "home", label: "~" },
    { id: "about", label: "Monitor" },
    { id: "experience", label: "CPU" },
    { id: "projects", label: "Control Unit" },
    { id: "awards", label: "ALU" },
    { id: "contact", label: "Registers" },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-[60] transition-all duration-400 ${scrolled ? "desktop-panel" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#home" className="font-mono text-sm font-bold text-primary">PPR/</a>
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" }); }}
              className="px-3 py-1.5 rounded font-mono text-xs transition-all duration-200"
              style={{
                color: active === item.id ? "#00FF88" : "rgba(255,255,255,0.4)",
                background: active === item.id ? "rgba(0,255,136,0.08)" : "transparent",
                border: `1px solid ${active === item.id ? "rgba(0,255,136,0.3)" : "transparent"}`,
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="./Prahlad_Resume.pdf"
          download
          className="font-mono text-xs px-3 py-1.5 rounded border border-primary/50 text-primary
                     hover:bg-primary hover:text-black transition-all duration-200"
        >
          Resume ↓
        </a>
      </div>
    </nav>
  );
}

/* ── Custom Cursor ── */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top  = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const animate = () => {
      pos.current.rx += (pos.current.x - pos.current.rx) * 0.12;
      pos.current.ry += (pos.current.y - pos.current.ry) * 0.12;
      if (ring.current) {
        ring.current.style.left = pos.current.rx + "px";
        ring.current.style.top  = pos.current.ry + "px";
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div id="cursor-dot"  ref={dot}  className="fixed pointer-events-none z-[9999]" style={{ transform: "translate(-50%,-50%)" }} />
      <div id="cursor-ring" ref={ring} className="fixed pointer-events-none z-[9998]" style={{ transform: "translate(-50%,-50%)" }} />
    </>
  );
}

/* ── Particle Canvas ── */
function Particles() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const PARTICLES = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random(),
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      PARTICLES.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,136,${p.a * 0.4})`;
        ctx.fill();
      });
      // Draw faint connections
      for (let i = 0; i < PARTICLES.length; i++) {
        for (let j = i + 1; j < PARTICLES.length; j++) {
          const dx = PARTICLES[i].x - PARTICLES[j].x;
          const dy = PARTICLES[i].y - PARTICLES[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
            ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
            ctx.strokeStyle = `rgba(0,255,136,${0.05 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={canvas} id="particle-canvas" className="fixed inset-0 pointer-events-none z-0" />;
}

/* ── Section Divider ── */
function SectionDivider({ label, colorA = "#00FF88", colorB = "#00C8FF" }: { label: string; colorA?: string; colorB?: string }) {
  return (
    <div className="flex flex-col items-center py-0" aria-hidden="true">
      <WireTransition label={label} color={colorA} />
      {/* Connector node */}
      <div className="w-4 h-4 rounded border-2 flex items-center justify-center"
           style={{ borderColor: colorA, background: `${colorA}15`, boxShadow: `0 0 12px ${colorA}50` }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: colorA }} />
      </div>
      <WireTransition color={colorB} />
    </div>
  );
}

export default function Page() {
  const aboutRef = useRef<HTMLElement>(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-bg">
      <Particles />
      <Cursor />
      <Navbar />

      {/* ── SECTIONS ── */}
      <Hero onScrollDown={scrollToAbout} />

      <SectionDivider label="video_signal" colorA="#00FF88" colorB="#00C8FF" />

      <section ref={aboutRef as React.RefObject<HTMLElement>}>
        <About />
      </section>

      <SectionDivider label="data_bus_64bit" colorA="#00C8FF" colorB="#00FF88" />

      <Experience />

      <SectionDivider label="instruction_decode" colorA="#00FF88" colorB="#FFB347" />

      <Projects />

      <SectionDivider label="alu_compute" colorA="#FFB347" colorB="#00C8FF" />

      <Awards />

      <SectionDivider label="register_write" colorA="#00C8FF" colorB="#00FF88" />

      <Contact />
    </div>
  );
}
