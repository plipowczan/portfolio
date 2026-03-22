import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import { SK_COLORS } from "../../skills-constants";
import { CounterAnimation } from "../../components/CounterAnimation";
import { Particle } from "../../components/Particle";
import { ScanlineOverlay } from "../../components/ScanlineOverlay";

export const AgentCounterScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleY = interpolate(titleEntrance, [0, 1], [-30, 0]);

  // Counter glow
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [15, 40]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SK_COLORS.background,
      }}
    >
      {/* Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Particle
          key={i}
          index={i + 50}
          frame={frame}
          color1={SK_COLORS.purpleGlow}
          color2={SK_COLORS.blueGlow}
        />
      ))}

      <ScanlineOverlay opacity={0.04} />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 50,
        }}
      >
        {/* Question */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: FONTS.heading,
            fontSize: 44,
            fontWeight: 700,
            color: SK_COLORS.mutedText,
            textAlign: "center",
            padding: "0 80px",
            lineHeight: 1.3,
          }}
        >
          Ile agentow potrzebujesz
          <br />
          do zarzadzania firma?
        </div>

        {/* Counter with glow */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: -40,
              background: `radial-gradient(circle, ${SK_COLORS.purpleGlow} 0%, transparent 70%)`,
              filter: `blur(${glowPulse}px)`,
              borderRadius: "50%",
            }}
          />
          <div style={{ position: "relative" }}>
            <CounterAnimation
              frame={frame}
              fps={fps}
              from={0}
              to={8}
              startDelay={1}
              duration={2}
              color={SK_COLORS.purple}
              fontSize={160}
              formatNumber={false}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
