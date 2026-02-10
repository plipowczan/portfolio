import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { FONTS } from "./constants";
import { OPENCLAW_COLORS } from "./openclaw-constants";

// Load fonts
loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

// Duration in seconds
export const COMPARISON_DURATION = 15;

// Warning triangle icon
const WarningIcon = () => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 24 24"
    fill="none"
    stroke={OPENCLAW_COLORS.alertRed}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// Shield with checkmark icon
const ShieldIcon = () => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 24 24"
    fill="none"
    stroke={OPENCLAW_COLORS.terminalGreen}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

// Animated row with icon + text
const ComparisonRow = ({
  text,
  icon,
  accentColor,
  frame,
  fps,
  delay,
}: {
  text: string;
  icon: React.ReactNode;
  accentColor: string;
  frame: number;
  fps: number;
  delay: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [16, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity,
        transform: `translateY(${slideY}px)`,
        padding: "12px 18px",
        borderRadius: 12,
        background: `${accentColor}08`,
        borderLeft: `3px solid ${accentColor}50`,
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <span
        style={{
          fontFamily: FONTS.heading,
          fontSize: 24,
          fontWeight: 600,
          color: OPENCLAW_COLORS.text,
          lineHeight: 1.3,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Risk badge with pulse animation
const RiskBadge = ({
  label,
  level,
  color,
  frame,
  fps,
  delay,
}: {
  label: string;
  level: string;
  color: string;
  frame: number;
  fps: number;
  delay: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });

  const scale = interpolate(entrance, [0, 1], [0.6, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Subtle pulse after entrance
  const pulsePhase = Math.max(0, frame - delay - fps * 0.5);
  const pulse = 1 + Math.sin(pulsePhase * 0.1) * 0.03;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale * pulse})`,
        display: "flex",
        justifyContent: "center",
        marginTop: 8,
      }}
    >
      <div
        style={{
          padding: "10px 24px",
          borderRadius: 30,
          background: `${color}18`,
          border: `2px solid ${color}60`,
          fontFamily: FONTS.heading,
          fontSize: 20,
          fontWeight: 900,
          color,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        {label}: {level}
      </div>
    </div>
  );
};

// Glassmorphism panel card
const PanelCard = ({
  title,
  accentColor,
  items,
  riskLabel,
  riskLevel,
  icon,
  frame,
  fps,
  slideDelay,
  itemsStartDelay,
  badgeDelay,
  side,
}: {
  title: string;
  accentColor: string;
  items: string[];
  riskLabel: string;
  riskLevel: string;
  icon: React.ReactNode;
  frame: number;
  fps: number;
  slideDelay: number;
  itemsStartDelay: number;
  badgeDelay: number;
  side: "left" | "right";
}) => {
  const entrance = spring({
    frame: frame - slideDelay,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const slideX = interpolate(
    entrance,
    [0, 1],
    [side === "left" ? -300 : 300, 0]
  );
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `translateX(${slideX}px)`,
        opacity,
        width: 460,
        padding: "30px 28px",
        borderRadius: 24,
        background: `${OPENCLAW_COLORS.darkSurface}cc`,
        border: `2px solid ${accentColor}30`,
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: `0 8px 40px ${accentColor}12`,
      }}
    >
      {/* Panel header */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 26,
          fontWeight: 900,
          color: accentColor,
          textAlign: "center",
          paddingBottom: 10,
          borderBottom: `1px solid ${accentColor}20`,
        }}
      >
        {title}
      </div>

      {/* Items */}
      {items.map((item, i) => (
        <ComparisonRow
          key={i}
          text={item}
          icon={icon}
          accentColor={accentColor}
          frame={frame}
          fps={fps}
          delay={itemsStartDelay + i * 0.5 * fps}
        />
      ))}

      {/* Risk badge */}
      <RiskBadge
        label={riskLabel}
        level={riskLevel}
        color={accentColor}
        frame={frame}
        fps={fps}
        delay={badgeDelay}
      />
    </div>
  );
};

export const ComparisonVideo = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // --- Title animation ---
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleY = interpolate(titleEntrance, [0, 1], [-30, 0]);

  // "vs" pop animation
  const vsEntrance = spring({
    frame: frame - 0.8 * fps,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.5 },
  });
  const vsScale = interpolate(vsEntrance, [0, 1], [0, 1]);

  // --- Panel timing ---
  const leftPanelDelay = 1.2 * fps;
  const rightPanelDelay = 1.6 * fps;
  const leftItemsStart = 2 * fps;
  const rightItemsStart = 2 * fps;
  const leftBadgeDelay = 4.3 * fps;
  const rightBadgeDelay = 4.5 * fps;

  // --- Verdict ---
  const verdictEntrance = spring({
    frame: frame - 9 * fps,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const verdictOpacity = interpolate(verdictEntrance, [0, 1], [0, 1]);
  const verdictY = interpolate(verdictEntrance, [0, 1], [20, 0]);

  // --- Fade out ---
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- Background glow animation ---
  const redGlow = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.03, 0.08]
  );
  const greenGlow = interpolate(
    Math.sin(frame * 0.06 + Math.PI),
    [-1, 1],
    [0.03, 0.08]
  );

  // Content data
  const leftItems = [
    "24/7 bez nadzoru",
    "Pe\u0142ny dost\u0119p do systemu",
    "Brak sandboxingu",
    "Auto-execute wszystkiego",
  ];

  const rightItems = [
    "Na \u017C\u0105danie z potwierdzeniem",
    "Granularne uprawnienia",
    "Izolowane \u015Brodowisko",
    "Human-in-the-loop",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OPENCLAW_COLORS.background,
        opacity: fadeOut,
      }}
    >
      {/* Background grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${OPENCLAW_COLORS.mutedText}08 1px, transparent 1px),
            linear-gradient(90deg, ${OPENCLAW_COLORS.mutedText}08 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Red glow (left) */}
      <div
        style={{
          position: "absolute",
          left: -100,
          top: "30%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${OPENCLAW_COLORS.alertRed}${Math.floor(redGlow * 255)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
        }}
      />

      {/* Green glow (right) */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: "30%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${OPENCLAW_COLORS.terminalGreen}${Math.floor(greenGlow * 255)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: 42,
            fontWeight: 900,
            color: OPENCLAW_COLORS.alertRed,
          }}
        >
          OpenClaw
        </span>
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: 36,
            fontWeight: 700,
            color: OPENCLAW_COLORS.mutedText,
            transform: `scale(${vsScale})`,
            display: "inline-block",
          }}
        >
          vs
        </span>
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: 42,
            fontWeight: 900,
            color: OPENCLAW_COLORS.terminalGreen,
          }}
        >
          Claude Code + MCP
        </span>
      </div>

      {/* Panels container */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 40,
          padding: "0 40px",
        }}
      >
        {/* Left panel - OpenClaw (red/danger) */}
        <PanelCard
          title="Autonomiczny Agent"
          accentColor={OPENCLAW_COLORS.alertRed}
          items={leftItems}
          riskLabel="Ryzyko"
          riskLevel="WYSOKIE"
          icon={<WarningIcon />}
          frame={frame}
          fps={fps}
          slideDelay={leftPanelDelay}
          itemsStartDelay={leftItemsStart}
          badgeDelay={leftBadgeDelay}
          side="left"
        />

        {/* Right panel - Claude Code + MCP (green/safe) */}
        <PanelCard
          title="Kontrolowany Agent"
          accentColor={OPENCLAW_COLORS.terminalGreen}
          items={rightItems}
          riskLabel="Ryzyko"
          riskLevel="NISKIE"
          icon={<ShieldIcon />}
          frame={frame}
          fps={fps}
          slideDelay={rightPanelDelay}
          itemsStartDelay={rightItemsStart}
          badgeDelay={rightBadgeDelay}
          side="right"
        />
      </div>

      {/* Verdict */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          opacity: verdictOpacity,
          transform: `translateY(${verdictY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 32,
            fontWeight: 900,
            color: OPENCLAW_COLORS.text,
            textAlign: "center",
          }}
        >
          Wybierz kontrol\u0119 nad autonomi\u0105
        </div>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 20,
            fontWeight: 400,
            color: OPENCLAW_COLORS.mutedText,
          }}
        >
          pawel.lipowczan.pl
        </div>
      </div>
    </AbsoluteFill>
  );
};
