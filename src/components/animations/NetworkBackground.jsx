import { useEffect, useRef } from "react";

/**
 * Decorative node-graph canvas.
 *
 * One component, two behaviours, chosen by props:
 *
 * - **Ambient** (the default, used by the homepage hero): a field of nodes
 *   sized to the viewport, drifting and linking. Nothing accretes.
 * - **Growing** (`cap` set, used by the LLM Wiki surfaces): seeded with a
 *   handful of nodes that spawn neighbours until the cap, so the graph builds
 *   itself while the visitor reads.
 *
 * This used to be two files. The growing one was forked from the ambient one
 * and then gained a reduced-motion branch, an `aria-hidden` and a resize
 * repaint; none came back, so the homepage kept an unbounded animation loop
 * that ignored the system preference. Growth is opt-in through `cap`, so the
 * homepage cannot inherit it by accident — which is what the fork was for.
 *
 * @param {{
 *   seed?: number,
 *   cap?: number | null,
 *   spawnMs?: number,
 *   position?: "absolute" | "fixed",
 * }} props
 */
const LINK_DIST = 150;

const NetworkBackground = ({
  seed,
  cap = null,
  spawnMs = 1200,
  position = "absolute",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animationFrameId;
    let spawnTimer;
    const nodes = [];

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize(); // size before seeding so node positions use real dimensions

    class Node {
      constructor(x, y, instant) {
        this.x = x ?? Math.random() * canvas.width;
        this.y = y ?? Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = instant ? 1 : 0; // spawned nodes fade in
      }
      update() {
        if (this.opacity < 1) this.opacity = Math.min(1, this.opacity + 0.02);
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 157, ${0.5 * this.opacity})`;
        ctx.fill();
      }
    }

    // Without an explicit seed the field is sized to the viewport, which is the
    // ambient behaviour the homepage has always had.
    const seedCount =
      seed ?? Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < seedCount; i += 1) {
      nodes.push(new Node(undefined, undefined, true));
    }

    const spawnNear = () => {
      const anchor = nodes[Math.floor(Math.random() * nodes.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = LINK_DIST * (0.4 + Math.random() * 0.5); // within link range
      nodes.push(
        new Node(
          anchor.x + Math.cos(angle) * dist,
          anchor.y + Math.sin(angle) * dist,
          false,
        ),
      );
    };

    const drawConnections = () => {
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < LINK_DIST) {
            const alpha =
              (0.2 - distance / 750) *
              Math.min(nodes[i].opacity, nodes[j].opacity);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 255, 157, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((node) => node.draw());
      drawConnections();
    };

    // Resizing a canvas clears it, so the static frame has to be redrawn or the
    // background goes blank on rotation. The animated branch repaints every
    // frame and only needs the dimensions updated.
    const onResize = () => {
      setSize();
      if (prefersReduced) renderStatic();
    };
    window.addEventListener("resize", onResize);

    if (prefersReduced) {
      renderStatic();
    } else {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nodes.forEach((node) => node.update());
        nodes.forEach((node) => node.draw());
        drawConnections();
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
      if (cap) {
        spawnTimer = setInterval(() => {
          if (nodes.length < cap) spawnNear();
          else clearInterval(spawnTimer);
        }, spawnMs);
      }
    }

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(spawnTimer);
    };
  }, [seed, cap, spawnMs]);

  return (
    // `fixed` where the page is taller than the viewport: a canvas is a replaced
    // element, so `inset-0` does NOT stretch it — its box stays at the bitmap
    // size of one viewport, and everything below the first screen went plain
    // black. The hero is exactly one screen tall, so it keeps `absolute`.
    <canvas
      ref={canvasRef}
      className={`${position} inset-0 z-0`}
      aria-hidden="true"
      style={{ background: "linear-gradient(135deg, #050810 0%, #0a0e1a 100%)" }}
    />
  );
};

export default NetworkBackground;
