import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { COLORS, FONTS } from "../constants";

// Glitch text effect component
const GlitchText = ({
  text,
  frame,
  fps,
}: {
  text: string;
  frame: number;
  fps: number;
}) => {
  // Glitch timing - random shifts at certain intervals
  const glitchIntensity = interpolate(
    frame,
    [0, 0.5 * fps, 1 * fps, 1.5 * fps, 2 * fps],
    [0, 8, 0, 12, 0],
    { extrapolateRight: "clamp" }
  );

  const glitchX = Math.sin(frame * 0.5) * glitchIntensity;
  const glitchY = Math.cos(frame * 0.7) * glitchIntensity * 0.5;

  // RGB split effect
  const rgbOffset = glitchIntensity * 0.3;

  return (
    <div style={{ position: "relative" }}>
      {/* Red channel */}
      <span
        style={{
          position: "absolute",
          color: "rgba(255, 0, 0, 0.5)",
          transform: `translate(${-rgbOffset}px, 0)`,
          mixBlendMode: "screen",
        }}
      >
        {text}
      </span>
      {/* Blue channel */}
      <span
        style={{
          position: "absolute",
          color: "rgba(0, 0, 255, 0.5)",
          transform: `translate(${rgbOffset}px, 0)`,
          mixBlendMode: "screen",
        }}
      >
        {text}
      </span>
      {/* Main text */}
      <span
        style={{
          position: "relative",
          color: COLORS.text,
          transform: `translate(${glitchX}px, ${glitchY}px)`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Icon components
const ClockIcon = ({ size = 80 }: { size?: number }) => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const DollarIcon = ({ size = 80 }: { size?: number }) => (
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
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const QuestionIcon = ({ size = 80 }: { size?: number }) => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Text entrance animation
  const textEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const textScale = interpolate(textEntrance, [0, 1], [0.8, 1]);
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

  // Icons staggered entrance
  const icon1Entrance = spring({
    frame: frame - 0.8 * fps,
    fps,
    config: { damping: 15, stiffness: 100 },
  });
  const icon2Entrance = spring({
    frame: frame - 1.1 * fps,
    fps,
    config: { damping: 15, stiffness: 100 },
  });
  const icon3Entrance = spring({
    frame: frame - 1.4 * fps,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Floating animation for icons
  const float1 = Math.sin(frame * 0.08) * 10;
  const float2 = Math.sin(frame * 0.08 + 2) * 10;
  const float3 = Math.sin(frame * 0.08 + 4) * 10;

  // Fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Main question text with glitch */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 120,
          fontWeight: 900,
          transform: `scale(${textScale})`,
          opacity: textOpacity,
          marginBottom: 80,
        }}
      >
        <GlitchText text="Profesjonalne wideo?" frame={frame} fps={fps} />
      </div>

      {/* Animated icons row */}
      <div
        style={{
          display: "flex",
          gap: 100,
          alignItems: "center",
        }}
      >
        <div
          style={{
            transform: `translateY(${-100 * (1 - icon1Entrance) + float1}px)`,
            opacity: icon1Entrance,
          }}
        >
          <ClockIcon size={100} />
        </div>
        <div
          style={{
            transform: `translateY(${-100 * (1 - icon2Entrance) + float2}px)`,
            opacity: icon2Entrance,
            fontSize: 80,
            color: COLORS.mutedText,
          }}
        >
          +
        </div>
        <div
          style={{
            transform: `translateY(${-100 * (1 - icon2Entrance) + float2}px)`,
            opacity: icon2Entrance,
          }}
        >
          <DollarIcon size={100} />
        </div>
        <div
          style={{
            transform: `translateY(${-100 * (1 - icon3Entrance) + float3}px)`,
            opacity: icon3Entrance,
            fontSize: 80,
            color: COLORS.mutedText,
          }}
        >
          +
        </div>
        <div
          style={{
            transform: `translateY(${-100 * (1 - icon3Entrance) + float3}px)`,
            opacity: icon3Entrance,
          }}
        >
          <QuestionIcon size={100} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
