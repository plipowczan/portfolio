import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  random,
} from "remotion";
import { COLORS, FONTS } from "../constants";

// Particle component for background effect
const Particle = ({
  index,
  frame,
}: {
  index: number;
  frame: number;
}) => {
  const seed = index * 1000;
  const x = random(seed) * 1920;
  const y = random(seed + 1) * 1080;
  const size = random(seed + 2) * 4 + 2;
  const speed = random(seed + 3) * 0.02 + 0.01;
  const offset = random(seed + 4) * Math.PI * 2;

  const opacity = interpolate(
    Math.sin(frame * speed + offset),
    [-1, 1],
    [0.1, 0.4]
  );

  const drift = Math.sin(frame * speed * 0.5 + offset) * 20;

  return (
    <div
      style={{
        position: "absolute",
        left: x + drift,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.primary}40, ${COLORS.secondary}40)`,
        opacity,
      }}
    />
  );
};

// Icon components for cards
const ReactIcon = ({ size = 60 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={COLORS.primary}>
    <circle cx="12" cy="12" r="2.5" />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4"
      fill="none"
      stroke={COLORS.primary}
      strokeWidth="1"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4"
      fill="none"
      stroke={COLORS.primary}
      strokeWidth="1"
      transform="rotate(60 12 12)"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4"
      fill="none"
      stroke={COLORS.primary}
      strokeWidth="1"
      transform="rotate(120 12 12)"
    />
  </svg>
);

const VideoIcon = ({ size = 60 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={COLORS.primary}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polygon points="10 9 15 12 10 15 10 9" fill={COLORS.primary} />
  </svg>
);

const AIIcon = ({ size = 60 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={COLORS.primary}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
    <path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z" />
    <circle cx="9" cy="7" r="1" fill={COLORS.primary} />
    <circle cx="15" cy="7" r="1" fill={COLORS.primary} />
  </svg>
);

// Card component with glassmorphism
const TechCard = ({
  icon,
  label,
  delay,
  frame,
  fps,
}: {
  icon: React.ReactNode;
  label: string;
  delay: number;
  frame: number;
  fps: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const slideY = interpolate(entrance, [0, 1], [200, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);

  // Subtle hover-like float animation
  const float = Math.sin((frame - delay) * 0.05) * 5;

  return (
    <div
      style={{
        transform: `translateY(${slideY + float}px) scale(${scale})`,
        opacity,
        padding: 40,
        borderRadius: 24,
        background: `linear-gradient(135deg, ${COLORS.darkSurface}cc, ${COLORS.darkSurface}99)`,
        backdropFilter: "blur(20px)",
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        minWidth: 200,
        boxShadow: `0 8px 32px rgba(0, 255, 157, 0.1)`,
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: FONTS.heading,
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.text,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const HeroScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Main title animation
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const titleScale = interpolate(titleEntrance, [0, 1], [0.5, 1]);
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);

  // Glow pulse animation
  const glowPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [20, 40]
  );

  // Cards data
  const cards = [
    { icon: <ReactIcon size={70} />, label: "React" },
    { icon: <VideoIcon size={70} />, label: "Remotion" },
    { icon: <AIIcon size={70} />, label: "Claude Code" },
  ];

  // Scene fade out
  const sceneFade = interpolate(
    frame,
    [durationInFrames - 0.5 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        opacity: sceneFade,
      }}
    >
      {/* Particle background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <Particle key={i} index={i} frame={frame} />
        ))}
      </div>

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 80,
        }}
      >
        {/* Main title with gradient glow */}
        <div
          style={{
            transform: `scale(${titleScale})`,
            opacity: titleOpacity,
            position: "relative",
          }}
        >
          {/* Glow layer */}
          <div
            style={{
              position: "absolute",
              inset: -20,
              background: `linear-gradient(135deg, ${COLORS.primary}30, ${COLORS.secondary}30)`,
              filter: `blur(${glowPulse}px)`,
              borderRadius: 20,
            }}
          />
          {/* Text */}
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontSize: 140,
              fontWeight: 900,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              position: "relative",
            }}
          >
            Remotion + AI
          </h1>
        </div>

        {/* Tech cards */}
        <div
          style={{
            display: "flex",
            gap: 60,
            alignItems: "center",
          }}
        >
          {cards.map((card, index) => (
            <TechCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              delay={1.5 * fps + index * 0.3 * fps}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
