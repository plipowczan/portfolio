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

const AGENTS = [
  { name: "CFO", status: "active" },
  { name: "Tax Advisor", status: "active" },
  { name: "Legal", status: "active" },
  { name: "Marketing", status: "active" },
  { name: "Business Consultant", status: "development" },
  { name: "Product Manager", status: "development" },
  { name: "Coach", status: "development" },
  { name: "LinkedIn", status: "development" },
] as const;

const AgentCard = ({
  name,
  status,
  index,
  frame,
  fps,
}: {
  name: string;
  status: "active" | "development";
  index: number;
  frame: number;
  fps: number;
}) => {
  const delay = 0.3 * fps + index * 0.2 * fps;

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.7, 1]);

  const isActive = status === "active";
  const color = isActive ? SK_COLORS.green : SK_COLORS.amber;
  const glow = isActive ? SK_COLORS.greenGlow : SK_COLORS.amberGlow;
  const statusLabel = isActive ? "Active" : "In dev";

  // Subtle pulse for active agents
  const pulsePhase = Math.max(0, frame - delay - fps);
  const pulseGlow = isActive
    ? interpolate(Math.sin(pulsePhase * 0.1), [-1, 1], [6, 14])
    : 0;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        padding: "20px 16px",
        borderRadius: 16,
        background: `${SK_COLORS.darkSurface}cc`,
        border: `2px solid ${color}40`,
        backdropFilter: "blur(8px)",
        boxShadow: `0 0 ${pulseGlow}px ${glow}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        width: 220,
      }}
    >
      {/* Agent icon circle */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: `${color}20`,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <path
            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Name */}
      <span
        style={{
          fontFamily: FONTS.heading,
          fontSize: 20,
          fontWeight: 700,
          color: SK_COLORS.text,
          textAlign: "center",
        }}
      >
        {name}
      </span>

      {/* Status badge */}
      <span
        style={{
          fontFamily: FONTS.heading,
          fontSize: 13,
          fontWeight: 600,
          color,
          padding: "4px 12px",
          borderRadius: 20,
          background: `${color}15`,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {statusLabel}
      </span>
    </div>
  );
};

export const AgentCardsScene = () => {
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
      <ScanlineOverlay opacity={0.04} />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 36,
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
          }}
        >
          8 agentow
        </div>

        {/* 2x4 grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
            justifyContent: "center",
            maxWidth: 960,
          }}
        >
          {AGENTS.map((agent, i) => (
            <AgentCard
              key={i}
              name={agent.name}
              status={agent.status}
              index={i}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 30,
            marginTop: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: SK_COLORS.green,
              }}
            />
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: 18,
                color: SK_COLORS.mutedText,
              }}
            >
              Aktywny
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: SK_COLORS.amber,
              }}
            />
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: 18,
                color: SK_COLORS.mutedText,
              }}
            >
              W budowie
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
