"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Archivo, Space_Mono } from "next/font/google";
import { BOOKING_URL, EMAIL, PHONE, PHONE_HREF } from "@/config/site";

/**
 * Mobile-first marketing landing page for Copper Bay Tech — a port of the
 * "molten copper" design handoff (v2): animated WebGL hero with a pointer-trail
 * glow + scroll-driven heat, an intro counter, a rotating value word, variable-
 * font weight morphing on the headings, scroll-reveal sections, count-up stats,
 * and a contact CTA. Subtle haptics fire on the primary CTAs (Android only —
 * iOS Safari ignores navigator.vibrate, harmlessly).
 *
 * Rendered md:hidden from src/app/page.tsx so phones get this experience while
 * desktop keeps the existing component-based homepage at the same URL. The
 * inactive copy is display:none for the viewport, so there is no device-
 * detection flash and SSR/SEO stays intact.
 *
 * Power/motion hygiene:
 *  - Every expensive effect (WebGL loop, intro/word timers, scroll listeners)
 *    is gated to mobile, so the desktop copy never pays for them.
 *  - lowPower (prefers-reduced-motion OR Data-Saver) skips WebGL and word
 *    rotation and shows a static copper gradient.
 *  - prefers-reduced-motion additionally reveals all content up front and
 *    disables parallax (the CSS guard in globals.css zeroes transitions too).
 *  - The WebGL render loop pauses via IntersectionObserver once the hero
 *    scrolls out of view, so it doesn't drain the battery while reading.
 *
 * NOTE: the v2 prototype also included a device-orientation (gyro) tilt. It was
 * deliberately dropped here: on iOS it forces Apple's "Allow Motion & Orientation
 * Access?" permission prompt on the visitor's first tap, which reads as broken and
 * is usually denied. The scroll parallax + pointer trail already give the hero
 * depth without it.
 */

// Variable font (full 100..900 weight axis) so the headings can animate
// font-variation-settings; omitting `weight` loads Archivo's variable file.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const SANS = "var(--font-archivo), system-ui, sans-serif";
const MONO = "var(--font-space-mono), 'Space Mono', monospace";

const WORDS = ["Handled", "Hosted", "Secured", "Improved"];

const MARQUEE_TEXT =
  "Founder-led    ·    Flat published pricing    ·    No lock-in — you own it    ·    Reply in one business day    ·    Sonoma County local    ·    ";

type Props = {
  /** 1–10, scales hero shader speed + word interval. */
  motionIntensity?: number;
  /** Skip the loading overlay. */
  showIntro?: boolean;
  /** 0–2, pointer-trail glow strength in the shader. */
  copperGlow?: number;
  /** 0–1.6, how much the hero heats up as the page scrolls. */
  scrollHeat?: number;
};

// Shared style fragments ----------------------------------------------------
const mono = (extra: CSSProperties = {}): CSSProperties => ({
  fontFamily: MONO,
  ...extra,
});

const numberGrad: CSSProperties = {
  fontSize: 42,
  fontWeight: 900,
  letterSpacing: "-0.04em",
  backgroundImage: "linear-gradient(120deg,#f4c089,#c2703a)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const cardBase: CSSProperties = {
  position: "relative",
  background: "linear-gradient(180deg,#15110e,#0e0b09)",
  border: "1px solid rgba(214,150,90,.16)",
  borderRadius: 22,
  padding: "26px 22px 28px",
  overflow: "hidden",
};

const reveal = (ty = 42, dur = 0.9): CSSProperties => ({
  opacity: 0,
  transform: `translateY(${ty}px)`,
  transition: `opacity ${dur}s cubic-bezier(.16,1,.3,1), transform ${dur}s cubic-bezier(.16,1,.3,1)`,
});

// Headline lines slide up while their variable weight thickens 360 -> 900.
const maskedLine: CSSProperties = {
  display: "block",
  transform: "translateY(115%)",
  fontVariationSettings: "'wght' 360",
  transition:
    "transform .85s cubic-bezier(.16,1,.3,1), font-variation-settings 1s cubic-bezier(.16,1,.3,1)",
};

const SERVICES = [
  {
    n: "01",
    title: "Websites that get found",
    body: "Hand-coded, no templates. Built to rank, load fast, and turn visitors into phone calls.",
  },
  {
    n: "02",
    title: "Managed IT & helpdesk",
    body: "Workstations, cloud, and a real person who picks up. Your team, unblocked.",
  },
  {
    n: "03",
    title: "Cybersecurity & hardening",
    body: "Monitoring, backups, and incident plans that let you sleep at night.",
  },
  {
    n: "04",
    title: "AI tools & automation",
    body: "Answer calls, reply to leads, and clear the busywork — automatically.",
  },
];

const PROCESS = [
  {
    n: "01",
    title: "We design & launch",
    body: "Copy, design, forms, hosting — shipped fast. You approve the look; we run the build end to end.",
    last: false,
  },
  {
    n: "02",
    title: "We host, secure & update",
    body: "Managed hosting we own. Updates, backups, patches, uptime — one flat plan, never an hourly surprise.",
    last: false,
  },
  {
    n: "03",
    title: "We keep improving",
    body: "A site is never finished. We tune speed, add pages, and fold in IT, security and AI as you grow.",
    last: true,
  },
];

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

export default function MobileLanding({
  motionIntensity = 8,
  showIntro = true,
  copperGlow = 1,
  scrollHeat = 1,
}: Props) {
  // Lazy init reads the real media state on the client's first render; on the
  // server everything defaults to false (markup never depends on these, so no
  // hydration mismatch). This avoids the false->true flip that would otherwise
  // skip the intro on mobile.
  const [isMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  // Low power: reduced-motion OR the browser's Data-Saver hint. When true we
  // ship the static copper gradient and stop rotating the hero word. (The
  // deprecated Battery Status API is intentionally not used — it's unsupported
  // on Safari/Firefox, i.e. on the iPhone this page primarily targets.)
  const [lowPower] = useState(() => {
    if (typeof navigator === "undefined") return false;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    return reduced || !!conn?.saveData;
  });

  // Only mobile, motion-OK, first-visit-this-session visitors see the loading
  // overlay; everyone else starts already-loaded. Derived at init so the effect
  // never has to setState synchronously.
  const introSeen =
    typeof window !== "undefined" &&
    window.sessionStorage?.getItem("cbtm-intro-seen") === "1";
  const shouldIntro = isMobile && !reduced && showIntro && !introSeen;

  const [progress, setProgress] = useState(shouldIntro ? 0 : 100);
  const [loaded, setLoaded] = useState(!shouldIntro);
  const [word, setWord] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const heroH1Ref = useRef<HTMLHeadingElement>(null);
  const scrollPRef = useRef(0); // page scroll progress 0..1, read by the shader

  // Intro counter 0 -> 100, then dismiss the overlay ----------------------
  useEffect(() => {
    if (!shouldIntro) return;
    try {
      window.sessionStorage?.setItem("cbtm-intro-seen", "1");
    } catch {
      /* private mode — fine */
    }
    let raf = 0;
    let done: ReturnType<typeof setTimeout> | undefined;
    const start = performance.now();
    const dur = 1700;
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / dur);
      setProgress(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else done = setTimeout(() => setLoaded(true), 260);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (done) clearTimeout(done);
    };
  }, [shouldIntro]);

  // Rotating hero word -----------------------------------------------------
  useEffect(() => {
    if (!loaded || lowPower || !isMobile) return;
    const iv = Math.max(1200, 2600 - motionIntensity * 150);
    const id = setInterval(() => setWord((w) => (w + 1) % WORDS.length), iv);
    return () => clearInterval(id);
  }, [loaded, lowPower, isMobile, motionIntensity]);

  // Menu body scroll lock --------------------------------------------------
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Subtle haptics on the primary CTAs (Android only; no-op on iOS) --------
  useEffect(() => {
    if (!isMobile) return;
    const root = rootRef.current;
    if (!root || typeof navigator === "undefined" || !navigator.vibrate) return;
    const onDown = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.("[data-haptic]");
      if (t) navigator.vibrate(11);
    };
    root.addEventListener("pointerdown", onDown, { passive: true });
    return () => root.removeEventListener("pointerdown", onDown);
  }, [isMobile]);

  // Scroll reveal + progress bar + hero parallax + H1 weight morph ---------
  useEffect(() => {
    if (!isMobile) return;
    const root = rootRef.current;
    if (!root) return;

    const countUp = (el: HTMLElement) => {
      if (el.dataset.cuDone) return;
      el.dataset.cuDone = "1";
      const target = parseFloat(el.dataset.countup || "0");
      const suffix = el.dataset.suffix || "";
      const dur = 1300;
      const s = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - s) / dur);
        const e = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(e * target) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    // Reduced motion: reveal everything immediately, no scroll choreography.
    if (reduced) {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.querySelectorAll<HTMLElement>("[data-line]").forEach((ln) => {
          ln.style.transform = "translateY(0)";
          ln.style.fontVariationSettings = "'wght' 900";
        });
        el.querySelectorAll<HTMLElement>("[data-countup]").forEach((num) => {
          num.textContent = (num.dataset.countup || "") + (num.dataset.suffix || "");
        });
      });
      return;
    }

    const doReveal = () => {
      const vh = window.innerHeight;
      root
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])")
        .forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < vh * 0.86) {
            el.setAttribute("data-shown", "");
            el.style.transitionDelay = `${parseFloat(el.dataset.delay || "0")}ms`;
            el.style.opacity = "1";
            el.style.transform = "none";
            el.querySelectorAll<HTMLElement>("[data-line]").forEach((ln, i) => {
              ln.style.transitionDelay = `${100 + i * 95}ms`;
              ln.style.transform = "translateY(0)";
              ln.style.fontVariationSettings = "'wght' 900";
            });
            el.querySelectorAll<HTMLElement>("[data-countup]").forEach((num) =>
              countUp(num),
            );
          }
        });
    };

    const onScroll = () => {
      doReveal();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      scrollPRef.current = p;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      const y = window.scrollY;
      if (heroInnerRef.current) {
        heroInnerRef.current.style.transform = `translate3d(0,${y * 0.16}px,0)`;
        heroInnerRef.current.style.opacity = String(Math.max(0, 1 - y / 560));
      }
      if (heroH1Ref.current) {
        const w = Math.round(900 - Math.min(1, y / 500) * 420);
        heroH1Ref.current.style.fontVariationSettings = `'wght' ${w}`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const raf = requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isMobile, reduced, loaded]);

  // WebGL molten-copper hero (pointer trail + scroll heat) ----------------
  useEffect(() => {
    if (!isMobile) return;
    const c = canvasRef.current;
    if (!c) return;

    const fallback =
      "radial-gradient(120% 90% at 60% 30%, #6a3416, #1a0f09 70%)";

    if (lowPower) {
      c.style.background = fallback;
      return;
    }

    let gl: WebGLRenderingContext | null = null;
    try {
      const o = { preserveDrawingBuffer: true, antialias: true };
      gl =
        (c.getContext("webgl", o) as WebGLRenderingContext | null) ||
        (c.getContext("experimental-webgl", o) as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }
    if (!gl) {
      c.style.background = fallback;
      return;
    }
    const ctx = gl;

    const vs = "attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }";
    const fs = [
      "precision highp float;",
      "uniform vec2 u_res; uniform float u_time; uniform float u_glow; uniform float u_scroll; uniform vec2 u_trail[6]; uniform float u_trailA[6];",
      "float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }",
      "float noise(vec2 p){ vec2 i=floor(p),f=fract(p); float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.)); vec2 u=f*f*f*(f*(f*6.-15.)+10.); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }",
      "float fbm(vec2 p){ float v=0.,a=.5; mat2 rm=mat2(0.80,-0.60,0.60,0.80); for(int i=0;i<7;i++){ v+=a*noise(p); p=rm*p*2.0+vec2(37.,17.); a*=.5; } return v; }",
      "void main(){",
      " vec2 uv = gl_FragCoord.xy/u_res.xy; vec2 p = uv; p.x *= u_res.x/u_res.y;",
      " float t = u_time*0.05;",
      " vec2 p2 = p*2.4;",
      " vec2 flow = vec2(fbm(p2 + t*0.6), fbm(p2 + vec2(3.1,1.7) - t*0.5));",
      " float n = fbm(p2 + flow*2.1 + vec2(t*0.35,-t*0.22));",
      " float ridge = 1.0 - abs(2.0*fbm(p2*1.7 + flow*2.6 - t*0.3) - 1.0);",
      " ridge = pow(clamp(ridge,0.0,1.0), 2.4);",
      " float ridge2 = 1.0 - abs(2.0*fbm(p2*3.4 + flow*1.5 + t*0.2) - 1.0);",
      " ridge = max(ridge, pow(clamp(ridge2,0.0,1.0),3.5)*0.7);",
      " float glow = 0.0;",
      " for(int i=0;i<6;i++){ vec2 tp = u_trail[i]; tp.x *= u_res.x/u_res.y; float dd = distance(p,tp); glow = max(glow, smoothstep(0.5,0.0,dd)*u_trailA[i]); }",
      " glow *= u_glow;",
      " float heat = n*0.76 + ridge*0.62 + glow*0.82;",
      " heat += u_scroll*0.42 + ridge*u_scroll*0.5;",
      " vec3 dark=vec3(0.045,0.024,0.015), deep=vec3(0.34,0.13,0.05), mid=vec3(0.62,0.30,0.13), hot=vec3(0.86,0.50,0.24), spark=vec3(0.98,0.78,0.46);",
      " vec3 col = mix(dark,deep, smoothstep(0.0,0.26,heat));",
      " col = mix(col,mid, smoothstep(0.24,0.54,heat));",
      " col = mix(col,hot, smoothstep(0.52,0.82,heat));",
      " col = mix(col,spark, smoothstep(0.90,1.14,heat+ridge*0.30));",
      " float vig = smoothstep(1.5,0.1,distance(uv,vec2(0.55,0.40)));",
      " col *= mix(0.55,1.0,vig);",
      " gl_FragColor = vec4(col,1.0);",
      "}",
    ].join("\n");

    const mk = (type: number, src: string) => {
      const sh = ctx.createShader(type)!;
      ctx.shaderSource(sh, src);
      ctx.compileShader(sh);
      if (!ctx.getShaderParameter(sh, ctx.COMPILE_STATUS)) {
        console.error("SHADER COMPILE ERR:", ctx.getShaderInfoLog(sh));
      }
      return sh;
    };

    const prog = ctx.createProgram()!;
    ctx.attachShader(prog, mk(ctx.VERTEX_SHADER, vs));
    ctx.attachShader(prog, mk(ctx.FRAGMENT_SHADER, fs));
    ctx.linkProgram(prog);
    if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
      console.error("PROGRAM LINK ERR:", ctx.getProgramInfoLog(prog));
    }
    ctx.useProgram(prog);

    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(
      ctx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      ctx.STATIC_DRAW,
    );
    const loc = ctx.getAttribLocation(prog, "p");
    ctx.enableVertexAttribArray(loc);
    ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);

    const uRes = ctx.getUniformLocation(prog, "u_res");
    const uTime = ctx.getUniformLocation(prog, "u_time");
    const uGlow = ctx.getUniformLocation(prog, "u_glow");
    const uScroll = ctx.getUniformLocation(prog, "u_scroll");
    const uTrail = ctx.getUniformLocation(prog, "u_trail");
    const uTrailA = ctx.getUniformLocation(prog, "u_trailA");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const resize = () => {
      const w = c.clientWidth;
      const h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.viewport(0, 0, c.width, c.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Pointer/touch trail — a short decaying comet of glow points.
    const TN = 6;
    const trail = new Float32Array(TN * 2);
    const trailA = new Float32Array(TN);
    for (let i = 0; i < TN; i++) {
      trail[i * 2] = 0.5;
      trail[i * 2 + 1] = 0.55;
    }
    const move = (x: number, y: number) => {
      const rc = c.getBoundingClientRect();
      const px = (x - rc.left) / rc.width;
      const py = 1 - (y - rc.top) / rc.height;
      for (let i = TN - 1; i > 0; i--) {
        trail[i * 2] = trail[(i - 1) * 2];
        trail[i * 2 + 1] = trail[(i - 1) * 2 + 1];
        trailA[i] = trailA[i - 1];
      }
      trail[0] = px;
      trail[1] = py;
      trailA[0] = 1;
    };
    const onPointer = (e: PointerEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const t0 = performance.now();
    const speed = 0.5 + motionIntensity * 0.07;
    const glowAmt = copperGlow;
    const heatAmt = scrollHeat;

    let raf = 0;
    let running = false;
    const loop = () => {
      const tt = ((performance.now() - t0) / 1000) * speed;
      for (let i = 0; i < TN; i++) trailA[i] *= 0.93;
      ctx.uniform2f(uRes, c.width, c.height);
      ctx.uniform1f(uTime, tt);
      ctx.uniform1f(uGlow, glowAmt);
      ctx.uniform1f(uScroll, (scrollPRef.current || 0) * heatAmt);
      ctx.uniform2fv(uTrail, trail);
      ctx.uniform1fv(uTrailA, trailA);
      ctx.drawArrays(ctx.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      loop();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Pause the render loop while the hero is off-screen to save battery.
    let io: IntersectionObserver | undefined;
    if (heroSectionRef.current && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) start();
          else stop();
        },
        { threshold: 0 },
      );
      io.observe(heroSectionRef.current);
    } else {
      start();
    }

    return () => {
      stop();
      io?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [isMobile, lowPower, motionIntensity, copperGlow, scrollHeat]);

  const toggleMenu = () => setMenuOpen((o) => !o);

  // Dynamic styles ---------------------------------------------------------
  const introStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 120,
    background: "#0b0908",
    display: "flex",
    flexDirection: "column",
    padding: "26px 24px 30px",
    maxWidth: 540,
    margin: "0 auto",
    transform: loaded ? "translateY(-101%)" : "none",
    transition: "transform 1.05s cubic-bezier(.76,0,.24,1)",
    pointerEvents: loaded ? "none" : "auto",
  };

  const headerStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 90,
    maxWidth: 540,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    background: "linear-gradient(180deg,rgba(11,9,8,.85),rgba(11,9,8,0))",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(-12px)",
    transition: "opacity .8s ease .3s, transform .8s ease .3s",
  };

  const heroStyle: CSSProperties = {
    position: "relative",
    zIndex: 2,
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(22px) scale(.985)",
    transition:
      "opacity 1.2s ease .15s, transform 1.2s cubic-bezier(.16,1,.3,1) .15s",
  };

  const navOverlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 110,
    maxWidth: 540,
    margin: "0 auto",
    padding: "78px 28px 36px",
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(120% 75% at 82% 0%, #5a2f17 0%, #1a0f09 56%, #0b0807 100%)",
    opacity: menuOpen ? 1 : 0,
    pointerEvents: menuOpen ? "auto" : "none",
    transition: "opacity .5s cubic-bezier(.16,1,.3,1)",
  };

  const navLinkStyle = (i: number): CSSProperties => ({
    display: "block",
    fontSize: "clamp(40px,13vw,62px)",
    fontWeight: 900,
    letterSpacing: "-0.03em",
    lineHeight: 1.06,
    color: "#f3ebe1",
    transform: menuOpen ? "translateY(0)" : "translateY(115%)",
    opacity: menuOpen ? 1 : 0,
    transition: `transform .7s cubic-bezier(.16,1,.3,1) ${
      menuOpen ? 90 + i * 60 : 0
    }ms, opacity .6s ease ${menuOpen ? 90 + i * 60 : 0}ms`,
  });

  return (
    <div
      ref={rootRef}
      className={`cbtm-root ${archivo.variable} ${spaceMono.variable}`}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 540,
        margin: "0 auto",
        background: "#0b0908",
        color: "#f3ebe1",
        fontFamily: SANS,
        WebkitFontSmoothing: "antialiased",
        overflowX: "hidden",
      }}
    >
      {/* SCROLL PROGRESS */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 95,
          height: 2,
          maxWidth: 540,
          margin: "0 auto",
          background: "rgba(214,150,90,.12)",
        }}
      >
        <div
          ref={barRef}
          style={{
            height: "100%",
            background: "linear-gradient(90deg,#9c5328,#f4c089)",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* INTRO OVERLAY */}
      <div style={introStyle} aria-hidden={loaded}>
        <div
          style={mono({
            fontSize: 11,
            letterSpacing: "0.42em",
            color: "#a8836a",
            textTransform: "uppercase",
          })}
        >
          Copper Bay Tech
        </div>
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={mono({
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            })}
          >
            <span style={{ fontSize: 13, letterSpacing: "0.2em", color: "#6f5a4b" }}>
              LOADING
            </span>
            <span
              style={{
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1,
                backgroundImage:
                  "linear-gradient(100deg,#8a4a25,#f4c089 55%,#8a4a25)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {progress}
            </span>
          </div>
          <div
            style={{
              height: 2,
              width: "100%",
              background: "rgba(214,150,90,.15)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg,#9c5328,#f4c089)",
                transition: "width .15s linear",
              }}
            />
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "linear-gradient(135deg,#f4c089,#9c5328)",
              boxShadow: "0 2px 10px rgba(194,112,58,.5)",
            }}
          />
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>
            Copper Bay
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href="/audit"
            data-haptic
            style={mono({
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#0b0908",
              background: "linear-gradient(135deg,#f4c089,#c2703a)",
              padding: "9px 14px",
              borderRadius: 999,
              textDecoration: "none",
              fontWeight: 700,
            })}
          >
            Free audit
          </a>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              width: 42,
              height: 42,
              padding: 0,
              background: "rgba(214,150,90,.08)",
              border: "1px solid rgba(214,150,90,.25)",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <span style={{ width: 16, height: 1.6, background: "#e8c4a0", display: "block" }} />
            <span style={{ width: 16, height: 1.6, background: "#e8c4a0", display: "block" }} />
          </button>
        </div>
      </header>

      {/* NAV OVERLAY */}
      <nav style={navOverlayStyle}>
        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: 22,
            right: 22,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(214,150,90,.08)",
            border: "1px solid rgba(214,150,90,.28)",
            borderRadius: 12,
            cursor: "pointer",
            color: "#e8c4a0",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
        <div
          style={mono({
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "#c2703a",
            textTransform: "uppercase",
            marginBottom: 26,
          })}
        >
          / Menu
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={toggleMenu}
              style={{ display: "block", overflow: "hidden", textDecoration: "none" }}
            >
              <span style={navLinkStyle(i)}>{link.label}</span>
            </a>
          ))}
        </div>
        <div
          style={mono({
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 12,
            color: "#c5a888",
            paddingTop: 30,
            borderTop: "1px solid rgba(214,150,90,.16)",
          })}
        >
          <a href={PHONE_HREF} style={{ color: "#f0d8bd", textDecoration: "none" }}>
            {PHONE}
          </a>
          <a href={`mailto:${EMAIL}`} style={{ color: "#a8957f", textDecoration: "none" }}>
            {EMAIL}
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        ref={heroSectionRef}
        style={{
          position: "relative",
          minHeight: "100svh",
          padding: "0 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
          background:
            "radial-gradient(130% 80% at 62% 38%, #6a3416 0%, #2a160c 42%, #0b0908 78%)",
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(90deg, rgba(11,9,8,.74) 0%, rgba(11,9,8,.42) 30%, rgba(11,9,8,.12) 55%, rgba(11,9,8,0) 78%), linear-gradient(180deg, rgba(11,9,8,.34) 0%, rgba(11,9,8,.05) 24%, rgba(11,9,8,.2) 54%, rgba(11,9,8,.72) 84%, rgba(11,9,8,.94) 100%)",
          }}
        />

        <div style={heroStyle}>
          <div ref={heroInnerRef} style={{ position: "relative", willChange: "transform" }}>
            <div
              style={mono({
                fontSize: 10.5,
                letterSpacing: "0.32em",
                color: "#e0a878",
                textTransform: "uppercase",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 9,
              })}
            >
              <span
                style={{ width: 22, height: 1, background: "#c2703a", display: "inline-block" }}
              />
              Sonoma County · Web · IT · Security
            </div>
            <h1
              ref={heroH1Ref}
              style={{ margin: 0, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 0.92 }}
            >
              <span style={{ display: "block", fontSize: "clamp(54px,16vw,92px)" }}>
                More
                <br />
                customers.
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(34px,10.5vw,58px)",
                  marginTop: 10,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                <span
                  key={word}
                  style={{
                    display: "inline-block",
                    backgroundImage:
                      "linear-gradient(100deg,#8a4a25 0%,#c2703a 24%,#f4c089 48%,#ffdcae 56%,#c2703a 78%,#8a4a25 100%)",
                    backgroundSize: "220% 100%",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    animation:
                      "cbtm-wordIn .8s cubic-bezier(.16,1,.3,1) both, cbtm-sheen 4.5s linear infinite",
                    paddingRight: "0.04em",
                  }}
                >
                  {WORDS[word]}
                </span>{" "}
                <span style={{ color: "#f3ebe1" }}>for life.</span>
              </span>
            </h1>
            <p
              style={{
                margin: "22px 0 0",
                maxWidth: "30ch",
                fontSize: 16,
                lineHeight: 1.5,
                color: "#c5b3a2",
              }}
            >
              We build the site that gets you found and gets the phone ringing — then host it,
              secure it, and keep improving it. You run the business.
            </p>
            <div style={{ display: "flex", gap: 11, margin: "28px 0 24px", flexWrap: "wrap" }}>
              <a
                href="/audit"
                data-haptic
                style={{
                  position: "relative",
                  overflow: "hidden",
                  flex: 1,
                  minWidth: 150,
                  textAlign: "center",
                  background: "linear-gradient(135deg,#f4c089,#c2703a 55%,#9c5328)",
                  color: "#0b0908",
                  fontWeight: 800,
                  fontSize: 15,
                  padding: "16px 18px",
                  borderRadius: 14,
                  textDecoration: "none",
                  boxShadow: "0 8px 30px rgba(194,112,58,.4)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "36%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg,transparent,rgba(255,248,238,.55),transparent)",
                    animation: "cbtm-sheenSweep 5s ease-in-out infinite",
                    pointerEvents: "none",
                  }}
                />
                Start a free audit
              </a>
              <a
                href="/work"
                style={{
                  flex: 1,
                  minWidth: 120,
                  textAlign: "center",
                  border: "1px solid rgba(214,150,90,.35)",
                  color: "#f3ebe1",
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "16px 18px",
                  borderRadius: 14,
                  textDecoration: "none",
                }}
              >
                See our work
              </a>
            </div>
            <div
              style={mono({
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingBottom: 34,
                fontSize: 11,
                color: "#9a8675",
                letterSpacing: "0.04em",
              })}
            >
              <span style={{ display: "flex" }}>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#f4c089,#9c5328)",
                    border: "2px solid #0b0908",
                  }}
                />
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#d98a4f,#7a3d1f)",
                    border: "2px solid #0b0908",
                    marginLeft: -7,
                  }}
                />
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#e8b07a,#8a4a25)",
                    border: "2px solid #0b0908",
                    marginLeft: -7,
                  }}
                />
              </span>
              Trusted by <span style={{ color: "#e0a878" }}>&nbsp;42 Sonoma County&nbsp;</span>{" "}
              businesses
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            width: 18,
            height: 28,
            border: "1px solid rgba(214,150,90,.4)",
            borderRadius: 12,
            display: "flex",
            justifyContent: "center",
            paddingTop: 6,
          }}
        >
          <span
            style={{
              width: 3,
              height: 7,
              borderRadius: 2,
              background: "#e0a878",
              animation: "cbtm-scrollHint 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div
        style={{
          borderTop: "1px solid rgba(214,150,90,.14)",
          borderBottom: "1px solid rgba(214,150,90,.14)",
          padding: "16px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          background: "#0e0b09",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: 0,
            animation: "cbtm-marquee 22s linear infinite",
            willChange: "transform",
          }}
        >
          <span
            style={mono({
              fontSize: 13,
              letterSpacing: "0.12em",
              color: "#a8836a",
              textTransform: "uppercase",
            })}
          >
            {MARQUEE_TEXT}
          </span>
          <span
            style={mono({
              fontSize: 13,
              letterSpacing: "0.12em",
              color: "#a8836a",
              textTransform: "uppercase",
            })}
          >
            {MARQUEE_TEXT}
          </span>
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" style={{ padding: "84px 22px 70px" }}>
        <div data-reveal style={reveal()}>
          <div
            style={mono({
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "#c2703a",
              textTransform: "uppercase",
              marginBottom: 18,
            })}
          >
            / What we do
          </div>
          <h2
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(38px,11vw,60px)",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 0.96,
            }}
          >
            <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.04em" }}>
              <span data-line style={maskedLine}>
                One partner.
              </span>
            </span>
            <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.04em" }}>
              <span data-line style={maskedLine}>
                The whole stack.
              </span>
            </span>
          </h2>
          <p
            style={{
              margin: "0 0 40px",
              fontSize: 16,
              lineHeight: 1.5,
              color: "#a8957f",
              maxWidth: "34ch",
            }}
          >
            A custom-coded site, then a flat monthly plan that hosts it, secures it, and keeps
            improving it. IT, security and AI folded in — one partner, one invoice.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SERVICES.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              data-delay={i * 80}
              style={{ ...reveal(), ...cardBase }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "linear-gradient(90deg,#c2703a,transparent)",
                }}
              />
              <div style={mono({ fontSize: 12, color: "#7a6353", marginBottom: 18 })}>{s.n}</div>
              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.title}
              </h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "#a8957f" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROOF / STATS */}
      <section style={{ padding: "30px 22px 80px" }}>
        <div
          data-reveal
          style={mono({
            ...reveal(),
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "#c2703a",
            textTransform: "uppercase",
            marginBottom: 26,
          })}
        >
          / What to expect
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            background: "rgba(214,150,90,.16)",
            border: "1px solid rgba(214,150,90,.16)",
            borderRadius: 22,
            overflow: "hidden",
          }}
        >
          <div data-reveal data-delay={0} style={{ ...reveal(30, 0.8), background: "#0e0b09", padding: "26px 20px" }}>
            <div style={numberGrad}>&lt; 1 day</div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#a8957f", lineHeight: 1.4 }}>
              Average response time
            </div>
          </div>
          <div data-reveal data-delay={70} style={{ ...reveal(30, 0.8), background: "#0e0b09", padding: "26px 20px" }}>
            <div style={numberGrad}>2–3 wks</div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#a8957f", lineHeight: 1.4 }}>
              Typical website launch
            </div>
          </div>
          <div data-reveal data-delay={140} style={{ ...reveal(30, 0.8), background: "#0e0b09", padding: "26px 20px" }}>
            <div data-countup="100" data-suffix="%" style={numberGrad}>
              100%
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#a8957f", lineHeight: 1.4 }}>
              Custom-coded, no templates
            </div>
          </div>
          <div data-reveal data-delay={210} style={{ ...reveal(30, 0.8), background: "#0e0b09", padding: "26px 20px" }}>
            <div data-countup="42" style={numberGrad}>
              42
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#a8957f", lineHeight: 1.4 }}>
              Sonoma County businesses
            </div>
          </div>
          <div
            data-reveal
            data-delay={280}
            style={{ ...reveal(30, 0.8), background: "#0e0b09", padding: "26px 20px", gridColumn: "1 / -1" }}
          >
            <div style={numberGrad}>Nationwide</div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#a8957f", lineHeight: 1.4 }}>
              Remote-friendly, rooted in the North Bay — on-site when it matters.
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding: "20px 22px 84px" }}>
        <div data-reveal style={reveal()}>
          <div
            style={mono({
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "#c2703a",
              textTransform: "uppercase",
              marginBottom: 18,
            })}
          >
            / How it works
          </div>
          <h2
            style={{
              margin: "0 0 44px",
              fontSize: "clamp(38px,11vw,60px)",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 0.96,
            }}
          >
            <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.04em" }}>
              <span data-line style={maskedLine}>
                Handled,
              </span>
            </span>
            <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.04em" }}>
              <span data-line style={maskedLine}>
                for life.
              </span>
            </span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
          {PROCESS.map((step, i) => (
            <div
              key={step.n}
              data-reveal
              data-delay={i * 90}
              style={{
                ...reveal(34, 0.8),
                display: "flex",
                gap: 18,
                paddingBottom: step.last ? 0 : 34,
                borderLeft: step.last
                  ? "1px solid transparent"
                  : "1px solid rgba(214,150,90,.2)",
                marginLeft: 8,
                paddingLeft: 26,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: -7,
                  top: 2,
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#f4c089,#9c5328)",
                  boxShadow: "0 0 0 4px #0b0908",
                }}
              />
              <div>
                <div style={mono({ fontSize: 12, color: "#7a6353", marginBottom: 8 })}>
                  {step.n}
                </div>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: 21,
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "#a8957f" }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "22px 14px 22px" }}>
        <div
          data-reveal
          style={{
            ...reveal(42, 1),
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            background:
              "radial-gradient(120% 100% at 50% 0%, #7a3d1f 0%, #2a160c 50%, #120c09 100%)",
            border: "1px solid rgba(214,150,90,.24)",
            padding: "48px 26px 40px",
          }}
        >
          <div
            style={mono({
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "#f0b073",
              textTransform: "uppercase",
              marginBottom: 20,
            })}
          >
            / Get in touch
          </div>
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: "clamp(34px,10vw,52px)",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 0.98,
            }}
          >
            Let&apos;s get your website handled — for life.
          </h2>
          <p
            style={{
              margin: "0 0 30px",
              fontSize: 16,
              lineHeight: 1.5,
              color: "#d8c3ad",
              maxWidth: "32ch",
            }}
          >
            Tell us about your business. You&apos;ll get an honest assessment and a clear path
            forward. No fluff, no pressure.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 30 }}>
            <a
              href={BOOKING_URL}
              data-haptic
              style={{
                position: "relative",
                overflow: "hidden",
                textAlign: "center",
                background: "linear-gradient(135deg,#ffe0bd,#f4c089 45%,#c2703a)",
                color: "#1a0d06",
                fontWeight: 800,
                fontSize: 16,
                padding: 17,
                borderRadius: 14,
                textDecoration: "none",
                boxShadow: "0 10px 34px rgba(0,0,0,.35)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "36%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,252,246,.6),transparent)",
                  animation: "cbtm-sheenSweep 5.5s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
              Book a free consultation
            </a>
            <a
              href={PHONE_HREF}
              style={{
                textAlign: "center",
                border: "1px solid rgba(255,224,189,.4)",
                color: "#f3ebe1",
                fontWeight: 700,
                fontSize: 16,
                padding: 17,
                borderRadius: 14,
                textDecoration: "none",
              }}
            >
              Call {PHONE}
            </a>
          </div>
          <div
            style={mono({
              display: "flex",
              flexDirection: "column",
              gap: 14,
              fontSize: 12,
              color: "#c5a888",
              paddingTop: 24,
              borderTop: "1px solid rgba(255,224,189,.16)",
            })}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#9c8068" }}>EMAIL</span>
              <span style={{ color: "#f0d8bd" }}>{EMAIL}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#9c8068" }}>RESPONSE</span>
              <span style={{ color: "#f0d8bd" }}>Within one business day</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#9c8068" }}>BASED</span>
              <span style={{ color: "#f0d8bd" }}>Sonoma County, CA</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "46px 22px 40px", borderTop: "1px solid rgba(214,150,90,.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "linear-gradient(135deg,#f4c089,#9c5328)",
            }}
          />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>
            Copper Bay Tech
          </span>
        </div>
        <p
          style={{
            margin: "0 0 24px",
            fontSize: 14,
            lineHeight: 1.5,
            color: "#9a8775",
            maxWidth: "32ch",
          }}
        >
          Custom-built technology for small businesses. Websites, IT support, and cybersecurity —
          done right.
        </p>
        <div
          style={mono({
            display: "flex",
            flexWrap: "wrap",
            gap: "14px 22px",
            fontSize: 12,
            marginBottom: 28,
          })}
        >
          <a href="/pricing" style={{ color: "#a8957f", textDecoration: "none" }}>
            Pricing
          </a>
          <a href="/work" style={{ color: "#a8957f", textDecoration: "none" }}>
            Work
          </a>
          <a href="/about" style={{ color: "#a8957f", textDecoration: "none" }}>
            About
          </a>
          <a href="/tools" style={{ color: "#a8957f", textDecoration: "none" }}>
            Tools
          </a>
          <a href="/blog" style={{ color: "#a8957f", textDecoration: "none" }}>
            Resources
          </a>
        </div>
        <div style={mono({ fontSize: 11, color: "#8a7868", letterSpacing: "0.04em" })}>
          © 2026 Copper Bay Tech · Sonoma County, CA
        </div>
      </footer>
    </div>
  );
}
