import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS } from "../constants";

// Network mesh background
const NetworkMesh = ({ frame }: { frame: number }) => {
  const nodeCount = 30;
  const nodes = Array.from({ length: nodeCount }).map((_, i) => {
    const seed = i * 100;
    return {
      x: random(seed) * 1920,
      y: random(seed + 1) * 1080,
      vx: (random(seed + 2) - 0.5) * 0.5,
      vy: (random(seed + 3) - 0.5) * 0.5,
    };
  });

  // Animate node positions
  const animatedNodes = nodes.map((node, i) => ({
    x: (node.x + node.vx * frame) % 1920,
    y: (node.y + node.vy * frame) % 1080,
    id: i,
  }));

  // Find connections (nodes within distance)
  const connections: { from: number; to: number; opacity: number }[] = [];
  const maxDistance = 300;

  for (let i = 0; i < animatedNodes.length; i++) {
    for (let j = i + 1; j < animatedNodes.length; j++) {
      const dx = animatedNodes[i].x - animatedNodes[j].x;
      const dy = animatedNodes[i].y - animatedNodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        connections.push({
          from: i,
          to: j,
          opacity: interpolate(distance, [0, maxDistance], [0.4, 0]),
        });
      }
    }
  }

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Lines */}
      {connections.map((conn, i) => (
        <line
          key={i}
          x1={animatedNodes[conn.from].x}
          y1={animatedNodes[conn.from].y}
          x2={animatedNodes[conn.to].x}
          y2={animatedNodes[conn.to].y}
          stroke={COLORS.primary}
          strokeWidth="1"
          opacity={conn.opacity * 0.3}
        />
      ))}
      {/* Nodes */}
      {animatedNodes.map((node) => (
        <circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r="3"
          fill={COLORS.primary}
          opacity="0.5"
        />
      ))}
    </svg>
  );
};

export const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo/URL entrance
  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const logoScale = interpolate(logoEntrance, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoEntrance, [0, 1], [0, 1]);

  // Gradient underline animation
  const underlineWidth = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtext entrance
  const subtextEntrance = spring({
    frame: frame - 1.5 * fps,
    fps,
    config: { damping: 200 },
  });

  // Subtle glow pulse
  const glowPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [15, 35]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* Network mesh background */}
      <div style={{ opacity: 0.4 }}>
        <NetworkMesh frame={frame} />
      </div>

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Main URL/Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Glow effect */}
          <div
            style={{
              position: "absolute",
              inset: -30,
              background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`,
              filter: `blur(${glowPulse}px)`,
              borderRadius: 20,
            }}
          />

          {/* URL text */}
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontSize: 100,
              fontWeight: 900,
              color: COLORS.text,
              margin: 0,
              position: "relative",
              letterSpacing: "-2px",
            }}
          >
            pawel.lipowczan.pl
          </h1>

          {/* Gradient underline */}
          <div
            style={{
              width: `${underlineWidth}%`,
              height: 6,
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
              borderRadius: 3,
              marginTop: 8,
              boxShadow: `0 0 20px ${COLORS.primary}60`,
            }}
          />
        </div>

        {/* Subtext */}
        <div
          style={{
            opacity: subtextEntrance,
            transform: `translateY(${20 * (1 - subtextEntrance)}px)`,
            fontFamily: FONTS.heading,
            fontSize: 48,
            fontWeight: 500,
            color: COLORS.mutedText,
          }}
        >
          Wiecej na blogu
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
