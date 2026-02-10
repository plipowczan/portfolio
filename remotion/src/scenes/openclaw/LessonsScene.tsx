import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import { OPENCLAW_COLORS } from "../../openclaw-constants";

// Shield icon for security steps
const ShieldIcon = ({ color = OPENCLAW_COLORS.terminalGreen }: { color?: string }) => (
  <svg
    width={40}
    height={40}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" stroke={color} />
  </svg>
);

// Comparison card
const ComparisonCard = ({
  label,
  color,
  items,
  frame,
  fps,
  delay,
  side,
}: {
  label: string;
  color: string;
  items: string[];
  frame: number;
  fps: number;
  delay: number;
  side: "left" | "right";
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const slideX = interpolate(
    entrance,
    [0, 1],
    [side === "left" ? -200 : 200, 0]
  );
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `translateX(${slideX}px)`,
        opacity,
        width: 420,
        padding: "32px 28px",
        borderRadius: 20,
        background: `${OPENCLAW_COLORS.darkSurface}cc`,
        border: `2px solid ${color}40`,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 28,
          fontWeight: 900,
          color,
          textAlign: "center",
        }}
      >
        {label}
      </div>
      {items.map((item, i) => {
        const itemEntrance = spring({
          frame: frame - delay - (i + 1) * 0.25 * fps,
          fps,
          config: { damping: 200 },
        });
        return (
          <div
            key={i}
            style={{
              fontFamily: FONTS.heading,
              fontSize: 20,
              color: OPENCLAW_COLORS.text,
              opacity: itemEntrance,
              transform: `translateX(${10 * (1 - itemEntrance)}px)`,
              padding: "10px 16px",
              borderRadius: 10,
              background: `${color}10`,
              borderLeft: `3px solid ${color}60`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

// Security step with shield icon
const SecurityStep = ({
  text,
  frame,
  fps,
  delay,
  index,
}: {
  text: string;
  frame: number;
  fps: number;
  delay: number;
  index: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const slideX = interpolate(entrance, [0, 1], [-150, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        transform: `translateX(${slideX}px)`,
        opacity,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 56,
          height: 56,
          borderRadius: 14,
          background: `${OPENCLAW_COLORS.terminalGreen}15`,
          border: `1px solid ${OPENCLAW_COLORS.terminalGreen}30`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ShieldIcon />
      </div>
      <span
        style={{
          fontFamily: FONTS.heading,
          fontSize: 26,
          fontWeight: 600,
          color: OPENCLAW_COLORS.text,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const LessonsScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene is 12 seconds (30-42s). Local frame starts at 0.
  // Phase A: 0-6s (split comparison)
  // Phase B: 6-12s (security steps)

  const phaseAEnd = 6 * fps;
  const phaseBStart = 6 * fps;

  // Phase transitions
  const phaseAFade = interpolate(
    frame,
    [phaseAEnd - 0.5 * fps, phaseAEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const phaseBEntrance = interpolate(
    frame,
    [phaseBStart, phaseBStart + 0.3 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Comparison data
  const leftItems = [
    "Zero oversight",
    "No sandboxing",
    "Auto-execute everything",
    "Trust all inputs",
  ];

  const rightItems = [
    "Human-in-the-loop",
    "Permission system",
    "Scoped MCP tools",
    "Audit trail",
  ];

  // Security steps
  const securitySteps = [
    "Least-privilege by default",
    "Sandbox untrusted code",
    "Validate all tool inputs",
    "Log every agent action",
    "Human approval for mutations",
  ];

  // Green glow for phase B
  const greenGlow = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.05, 0.12]
  );

  // Scene fade out
  const sceneFade = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OPENCLAW_COLORS.background,
        opacity: sceneFade,
      }}
    >
      {/* Phase A: Split comparison */}
      {frame < phaseAEnd && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: 60,
            flexDirection: "row",
            opacity: phaseAFade,
            padding: "0 80px",
          }}
        >
          {/* VS divider */}
          <div
            style={{
              position: "absolute",
              top: 80,
              fontFamily: FONTS.heading,
              fontSize: 42,
              fontWeight: 900,
              color: OPENCLAW_COLORS.mutedText,
            }}
          >
            <span style={{ color: OPENCLAW_COLORS.alertRed }}>OpenClaw</span>
            {" vs "}
            <span style={{ color: OPENCLAW_COLORS.terminalGreen }}>Claude Code + MCP</span>
          </div>

          <ComparisonCard
            label="Autonomous Agent"
            color={OPENCLAW_COLORS.alertRed}
            items={leftItems}
            frame={frame}
            fps={fps}
            delay={0.5 * fps}
            side="left"
          />

          {/* Center divider line */}
          <div
            style={{
              width: 2,
              height: 350,
              background: `linear-gradient(180deg, transparent, ${OPENCLAW_COLORS.mutedText}40, transparent)`,
            }}
          />

          <ComparisonCard
            label="Controlled Agent"
            color={OPENCLAW_COLORS.terminalGreen}
            items={rightItems}
            frame={frame}
            fps={fps}
            delay={0.8 * fps}
            side="right"
          />
        </AbsoluteFill>
      )}

      {/* Phase B: Security steps */}
      {frame >= phaseBStart && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: phaseBEntrance,
          }}
        >
          {/* Green glow background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at center, ${OPENCLAW_COLORS.terminalGreen}${Math.floor(greenGlow * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
            }}
          />

          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: 120,
              fontFamily: FONTS.heading,
              fontSize: 48,
              fontWeight: 900,
              color: OPENCLAW_COLORS.terminalGreen,
              textShadow: `0 0 20px ${OPENCLAW_COLORS.terminalGreen}40`,
            }}
          >
            SECURITY CHECKLIST
          </div>

          {/* Steps */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              marginTop: 60,
            }}
          >
            {securitySteps.map((step, i) => (
              <SecurityStep
                key={i}
                text={step}
                frame={frame - phaseBStart}
                fps={fps}
                delay={i * 0.4 * fps}
                index={i}
              />
            ))}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
