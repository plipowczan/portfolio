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

const COMPARISONS = [
  { before: "Prompty", after: "SKILL.md + evals" },
  { before: "Zero testow", after: "Automatyczne benchmarks" },
  { before: "Copy-paste", after: "Git + versioning" },
  { before: "Brak wersji", after: "Trigger tuning" },
];

const ComparisonRow = ({
  before,
  after,
  index,
  frame,
  fps,
}: {
  before: string;
  after: string;
  index: number;
  frame: number;
  fps: number;
}) => {
  const delay = 2 * fps + index * 0.5 * fps;

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [20, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slideY}px)`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        width: "100%",
      }}
    >
      {/* Before */}
      <div
        style={{
          flex: 1,
          padding: "16px 24px",
          borderRadius: 12,
          background: `${SK_COLORS.red}12`,
          border: `1px solid ${SK_COLORS.red}30`,
          fontFamily: FONTS.heading,
          fontSize: 24,
          fontWeight: 600,
          color: SK_COLORS.red,
          textAlign: "center",
          textDecoration: "line-through",
          textDecorationColor: `${SK_COLORS.red}60`,
        }}
      >
        {before}
      </div>

      {/* Arrow */}
      <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12h14m-7-7l7 7-7 7"
          stroke={SK_COLORS.purple}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* After */}
      <div
        style={{
          flex: 1,
          padding: "16px 24px",
          borderRadius: 12,
          background: `${SK_COLORS.green}12`,
          border: `1px solid ${SK_COLORS.green}30`,
          fontFamily: FONTS.heading,
          fontSize: 24,
          fontWeight: 600,
          color: SK_COLORS.green,
          textAlign: "center",
        }}
      >
        {after}
      </div>
    </div>
  );
};

export const SystemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleScale = interpolate(titleEntrance, [0, 1], [0.8, 1]);

  // Badge entrance
  const badgeEntrance = spring({
    frame: frame - 5 * fps,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.8 },
  });
  const badgeScale = interpolate(badgeEntrance, [0, 1], [0.6, 1]);
  const badgeOpacity = interpolate(badgeEntrance, [0, 1], [0, 1]);

  // Badge pulse
  const badgePulse = Math.max(0, frame - 5.5 * fps);
  const pulse = 1 + Math.sin(badgePulse * 0.1) * 0.03;

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
            linear-gradient(${SK_COLORS.mutedText}08 1px, transparent 1px),
            linear-gradient(90deg, ${SK_COLORS.mutedText}08 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <ScanlineOverlay opacity={0.04} />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 28,
          padding: 60,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            position: "relative",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -20,
              background: `linear-gradient(135deg, ${SK_COLORS.purpleGlow}, ${SK_COLORS.blueGlow})`,
              filter: "blur(25px)",
              borderRadius: 20,
            }}
          />
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontSize: 72,
              fontWeight: 900,
              background: `linear-gradient(135deg, ${SK_COLORS.purple}, ${SK_COLORS.blue})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              position: "relative",
            }}
          >
            Skills 2.0
          </h1>
        </div>

        {/* Comparison rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: "100%",
            maxWidth: 800,
          }}
        >
          {COMPARISONS.map((comp, i) => (
            <ComparisonRow
              key={i}
              before={comp.before}
              after={comp.after}
              index={i}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>

        {/* Open standard badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `scale(${badgeScale * pulse})`,
            padding: "14px 36px",
            borderRadius: 30,
            background: `${SK_COLORS.purple}18`,
            border: `2px solid ${SK_COLORS.purple}60`,
            fontFamily: FONTS.heading,
            fontSize: 24,
            fontWeight: 900,
            color: SK_COLORS.purple,
            letterSpacing: 1,
            marginTop: 10,
          }}
        >
          OTWARTY STANDARD
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
