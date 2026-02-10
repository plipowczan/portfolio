import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import { OPENCLAW_COLORS } from "../../openclaw-constants";
import { GlitchText } from "../../components/GlitchText";
import { Particle } from "../../components/Particle";
import { CounterAnimation } from "../../components/CounterAnimation";

// Glassmorphism stat card
const StatCard = ({
  label,
  value,
  frame,
  fps,
  delay,
}: {
  label: string;
  value: string;
  frame: number;
  fps: number;
  delay: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const slideY = interpolate(entrance, [0, 1], [200, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const float = Math.sin((frame - delay) * 0.05) * 5;

  return (
    <div
      style={{
        transform: `translateY(${slideY + float}px) scale(${scale})`,
        opacity,
        padding: "28px 36px",
        borderRadius: 20,
        background: `linear-gradient(135deg, ${OPENCLAW_COLORS.darkSurface}cc, ${OPENCLAW_COLORS.darkSurface}99)`,
        backdropFilter: "blur(20px)",
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        minWidth: 220,
        boxShadow: `0 8px 32px ${OPENCLAW_COLORS.terminalGreen}15`,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.heading,
          fontSize: 36,
          fontWeight: 900,
          color: OPENCLAW_COLORS.terminalGreen,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: FONTS.heading,
          fontSize: 22,
          fontWeight: 500,
          color: OPENCLAW_COLORS.mutedText,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const HypeScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo entrance
  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const logoScale = interpolate(logoEntrance, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoEntrance, [0, 1], [0, 1]);

  // Counter appears after logo
  const counterDelay = 1.5;

  // Stats cards staggered entrance
  const stats = [
    { label: "krajow", value: "76" },
    { label: "gwiazdek", value: "150k" },
    { label: "Google Trends", value: "#1" },
  ];

  // Glow pulse
  const glowPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [10, 30]
  );

  // Fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OPENCLAW_COLORS.background,
        opacity: fadeOut,
      }}
    >
      {/* Particle background - green */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle
            key={i}
            index={i}
            frame={frame}
            color1={`${OPENCLAW_COLORS.terminalGreen}30`}
            color2={`${OPENCLAW_COLORS.terminalGreen}15`}
          />
        ))}
      </div>

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 50,
        }}
      >
        {/* OpenClaw logo with glitch */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            position: "relative",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              inset: -20,
              background: `linear-gradient(135deg, ${OPENCLAW_COLORS.terminalGreen}20, ${OPENCLAW_COLORS.alertRed}10)`,
              filter: `blur(${glowPulse}px)`,
              borderRadius: 20,
            }}
          />
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 130,
              fontWeight: 900,
              position: "relative",
            }}
          >
            <GlitchText
              text="OpenClaw"
              frame={frame}
              fps={fps}
              color={OPENCLAW_COLORS.terminalGreen}
              intensity={1.5}
            />
          </div>
        </div>

        {/* Animated counter */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
          }}
        >
          <CounterAnimation
            frame={frame}
            fps={fps}
            from={0}
            to={150000}
            startDelay={counterDelay}
            duration={2.5}
            color={OPENCLAW_COLORS.text}
            fontSize={64}
          />
          <span
            style={{
              fontFamily: FONTS.heading,
              fontSize: 36,
              fontWeight: 500,
              color: OPENCLAW_COLORS.mutedText,
            }}
          >
            stars in 48h
          </span>
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "flex",
            gap: 40,
            alignItems: "center",
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              frame={frame}
              fps={fps}
              delay={(3.5 + index * 0.4) * fps}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
