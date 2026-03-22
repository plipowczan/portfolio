import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import { SK_COLORS } from "../../skills-constants";
import { ScanlineOverlay } from "../../components/ScanlineOverlay";

const STEPS = [
  "Intent",
  "Interview",
  "Draft",
  "Test",
  "Evaluate",
  "Iterate",
  "Package",
];

const StepItem = ({
  label,
  index,
  frame,
  fps,
  isLast,
}: {
  label: string;
  index: number;
  frame: number;
  fps: number;
  isLast: boolean;
}) => {
  const delay = 0.5 * fps + index * 0.4 * fps;

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideX = interpolate(entrance, [0, 1], [-30, 0]);

  // Green pulse after entrance
  const pulsePhase = Math.max(0, frame - delay - fps);
  const glowIntensity = interpolate(
    Math.sin(pulsePhase * 0.12),
    [-1, 1],
    [6, 16]
  );

  // Connecting line animation
  const lineDelay = delay + 0.3 * fps;
  const lineProgress = interpolate(
    frame,
    [lineDelay, lineDelay + 0.3 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}
    >
      {/* Step node */}
      <div
        style={{
          opacity,
          transform: `translateX(${slideX}px)`,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Number circle */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `${SK_COLORS.green}20`,
            border: `2px solid ${SK_COLORS.green}`,
            boxShadow: `0 0 ${glowIntensity}px ${SK_COLORS.greenGlow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONTS.heading,
            fontSize: 20,
            fontWeight: 900,
            color: SK_COLORS.green,
          }}
        >
          {index + 1}
        </div>

        {/* Label */}
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: 32,
            fontWeight: 700,
            color: SK_COLORS.text,
          }}
        >
          {label}
        </span>
      </div>

      {/* Connecting line */}
      {!isLast && (
        <div
          style={{
            width: 2,
            height: 20,
            background: `linear-gradient(to bottom, ${SK_COLORS.green}${Math.floor(lineProgress * 255)
              .toString(16)
              .padStart(2, "0")}, transparent)`,
            marginLeft: -290,
          }}
        />
      )}
    </div>
  );
};

export const WorkflowStepsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleY = interpolate(titleEntrance, [0, 1], [-20, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SK_COLORS.background,
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${SK_COLORS.mutedText}06 1px, transparent 1px),
            linear-gradient(90deg, ${SK_COLORS.mutedText}06 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <ScanlineOverlay opacity={0.04} />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 24,
          padding: "40px 60px",
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: FONTS.heading,
            fontSize: 44,
            fontWeight: 900,
            color: SK_COLORS.text,
            marginBottom: 16,
          }}
        >
          7-krokowy pipeline
        </div>

        {/* Steps */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {STEPS.map((step, i) => (
            <StepItem
              key={i}
              label={step}
              index={i}
              frame={frame}
              fps={fps}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
