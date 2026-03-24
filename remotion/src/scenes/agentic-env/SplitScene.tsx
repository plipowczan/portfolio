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

const COMPANIES = [
  {
    name: "200IQ Labs",
    type: "PSA",
    description: "Qamera AI, wdrożenia",
    color: SK_COLORS.cyan,
    glow: SK_COLORS.cyanGlow,
    agents: ["CFO", "Legal", "Tax", "Marketing", "PM"],
  },
  {
    name: "PLSoft",
    type: "JDG",
    description: "Szkolenia, doradztwo",
    color: SK_COLORS.green,
    glow: SK_COLORS.greenGlow,
    agents: ["CFO", "Legal", "Tax", "Coach", "LinkedIn"],
  },
];

const CompanyCard = ({
  name,
  type,
  description,
  color,
  glow,
  agents,
  index,
  frame,
  fps,
}: {
  name: string;
  type: string;
  description: string;
  color: string;
  glow: string;
  agents: string[];
  index: number;
  frame: number;
  fps: number;
}) => {
  const delay = 1 * fps + index * 0.5 * fps;
  const direction = index === 0 ? -1 : 1;

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const x = interpolate(entrance, [0, 1], [60 * direction, 0]);

  // Agents appear staggered after card
  const agentsDelay = delay + 0.8 * fps;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        width: 420,
      }}
    >
      {/* Company card */}
      <div
        style={{
          padding: "24px 32px",
          borderRadius: 20,
          background: `${SK_COLORS.darkSurface}cc`,
          border: `2px solid ${color}40`,
          backdropFilter: "blur(10px)",
          boxShadow: `0 8px 30px ${glow}`,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 32,
            fontWeight: 900,
            color,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: FONTS.code,
            fontSize: 16,
            fontWeight: 600,
            color: SK_COLORS.mutedText,
            marginTop: 4,
          }}
        >
          {type} · {description}
        </div>
      </div>

      {/* Agent pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {agents.map((agent, i) => {
          const pillDelay = agentsDelay + i * 0.15 * fps;
          const pillEntrance = spring({
            frame: frame - pillDelay,
            fps,
            config: { damping: 200 },
          });
          const pillOpacity = interpolate(pillEntrance, [0, 1], [0, 1]);
          const pillScale = interpolate(pillEntrance, [0, 1], [0.7, 1]);

          return (
            <div
              key={i}
              style={{
                opacity: pillOpacity,
                transform: `scale(${pillScale})`,
                padding: "6px 14px",
                borderRadius: 12,
                background: `${color}15`,
                border: `1px solid ${color}30`,
                fontFamily: FONTS.code,
                fontSize: 14,
                fontWeight: 600,
                color,
              }}
            >
              {agent}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SplitScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);

  // Shared Skills bar at bottom
  const sharedDelay = 3.5 * fps;
  const sharedEntrance = spring({
    frame: frame - sharedDelay,
    fps,
    config: { damping: 200 },
  });

  // Connecting lines
  const lineProgress = interpolate(
    frame,
    [2.5 * fps, 3.5 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SK_COLORS.background,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${SK_COLORS.mutedText}06 1px, transparent 1px),
            linear-gradient(90deg, ${SK_COLORS.mutedText}06 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <ScanlineOverlay opacity={0.04} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 28,
          padding: "40px 60px",
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            fontFamily: FONTS.heading,
            fontSize: 38,
            fontWeight: 900,
            color: SK_COLORS.text,
          }}
        >
          Te same skills, różne konteksty
        </div>

        {/* Two companies side by side */}
        <div
          style={{
            display: "flex",
            gap: 40,
            alignItems: "flex-start",
          }}
        >
          {COMPANIES.map((company, i) => (
            <CompanyCard
              key={i}
              {...company}
              index={i}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>

        {/* Connecting SVG lines */}
        <svg
          width={880}
          height={30}
          style={{ marginTop: -8 }}
        >
          {/* Left line */}
          <line
            x1={220}
            y1={0}
            x2={220}
            y2={30 * lineProgress}
            stroke={SK_COLORS.cyan}
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity={0.5}
          />
          {/* Right line */}
          <line
            x1={660}
            y1={0}
            x2={660}
            y2={30 * lineProgress}
            stroke={SK_COLORS.green}
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity={0.5}
          />
          {/* Horizontal connector */}
          <line
            x1={220}
            y1={30 * lineProgress}
            x2={220 + 440 * lineProgress}
            y2={30 * lineProgress}
            stroke={SK_COLORS.purple}
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity={0.5 * lineProgress}
          />
        </svg>

        {/* Shared Skills bar */}
        <div
          style={{
            opacity: sharedEntrance,
            transform: `translateY(${10 * (1 - sharedEntrance)}px)`,
            padding: "16px 36px",
            borderRadius: 16,
            background: `${SK_COLORS.purple}15`,
            border: `2px solid ${SK_COLORS.purple}40`,
            boxShadow: `0 4px 20px ${SK_COLORS.purpleGlow}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
              stroke={SK_COLORS.purple}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: FONTS.code,
              fontSize: 20,
              fontWeight: 700,
              color: SK_COLORS.purple,
            }}
          >
            shared-skills (Apache 2.0)
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
