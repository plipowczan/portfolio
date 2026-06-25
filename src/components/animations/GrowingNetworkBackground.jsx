import { useEffect, useRef } from "react";

/**
 * GrowingNetworkBackground
 *
 * Fork of NetworkBackground for the /llm-wiki landing. Unlike the ambient
 * version, the graph *accretes* nodes over time — seeded with a handful, then
 * spawning new nodes near existing ones until a cap — so the visual literally
 * "grows itself" while the visitor reads (the LLM Wiki thesis). Edges form via
 * the same distance threshold as the original. Respects prefers-reduced-motion
 * by drawing a single static frame. Kept as a separate file so the shared
 * NetworkBackground (used by Home/Hero) is untouched.
 */

const SEED = 12;
const CAP = 40;
const SPAWN_MS = 1200;
const LINK_DIST = 150;

const GrowingNetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
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
        this.opacity = instant ? 1 : 0; // new nodes fade in
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

    const spawnNear = () => {
      const anchor = nodes[Math.floor(Math.random() * nodes.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = LINK_DIST * (0.4 + Math.random() * 0.5); // within link range
      nodes.push(
        new Node(
          anchor.x + Math.cos(angle) * dist,
          anchor.y + Math.sin(angle) * dist,
          false
        )
      );
    };

    for (let i = 0; i < SEED; i++) {
      nodes.push(new Node(undefined, undefined, true));
    }

    const drawConnections = () => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
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

    // Resizing the canvas clears it, so for reduced-motion users (who get a
    // single static frame) we must redraw after every resize, otherwise the
    // background goes blank on viewport/orientation change. The animated branch
    // repaints every frame, so it only needs the dimensions updated.
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
      spawnTimer = setInterval(() => {
        if (nodes.length < CAP) spawnNear();
        else clearInterval(spawnTimer);
      }, SPAWN_MS);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(spawnTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      aria-hidden="true"
      style={{ background: "linear-gradient(135deg, #050810 0%, #0a0e1a 100%)" }}
    />
  );
};

export default GrowingNetworkBackground;
