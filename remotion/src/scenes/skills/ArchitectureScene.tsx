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

const REPOS = [
  {
    name: "agentic-ai-system",
    description: "Orchestration & agents",
    color: SK_COLORS.purple,
    glow: SK_COLORS.purpleGlow,
  },
  {
    name: "agentic-ai-private",
    description: "Private config & data",
    color: SK_COLORS.blue,
    glow: SK_COLORS.blueGlow,
  },
  {
    name: "shared-skills",
    description: "Reusable SKILL.md files",
    color: SK_COLORS.cyan,
    glow: SK_COLORS.cyanGlow,
  },
];

const RepoBox = ({
  name,
  description,
  color,
  glow,
  index,
  frame,
  fps,
}: {
  name: string;
  description: string;
  color: string;
  glow: string;
  index: number;
  frame: number;
  fps: number;
}) => {
  const delay = 0.5 * fps + index * 0.6 * fps;

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        padding: "28px 36px",
        borderRadius: 20,
        background: `${SK_COLORS.darkSurface}cc`,
        border: `2px solid ${color}40`,
        backdropFilter: "blur(10px)",
        boxShadow: `0 8px 30px ${glow}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        width: 280,
      }}
    >
      {/* Git icon */}
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <path
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
          stroke={color}
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
          color,
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: FONTS.heading,
          fontSize: 16,
          fontWeight: 500,
          color: SK_COLORS.mutedText,
          textAlign: "center",
        }}
      >
        {description}
      </span>
    </div>
  );
};

export const ArchitectureScene = () => {
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

  // Dashed lines animation
  const lineProgress = interpolate(
    frame,
    [3 * fps, 4.5 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Submodule label entrance
  const submoduleEntrance = spring({
    frame: frame - 4.5 * fps,
    fps,
    config: { damping: 200 },
  });

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
          gap: 50,
          padding: "60px 80px",
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: FONTS.heading,
            fontSize: 48,
            fontWeight: 900,
            color: SK_COLORS.text,
          }}
        >
          3 repozytoria
        </div>

        {/* Repo boxes row */}
        <div
          style={{
            display: "flex",
            gap: 30,
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          {REPOS.map((repo, i) => (
            <RepoBox
              key={i}
              {...repo}
              index={i}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>

        {/* Dashed connection lines (SVG overlay) */}
        <svg
          width={900}
          height={40}
          style={{
            marginTop: -30,
          }}
        >
          {/* Line from repo 1 to repo 3 */}
          <line
            x1={150}
            y1={20}
            x2={150 + 600 * lineProgress}
            y2={20}
            stroke={SK_COLORS.cyan}
            strokeWidth="2"
            strokeDasharray="8 6"
            opacity={0.6}
          />
        </svg>

        {/* Git submodule label */}
        <div
          style={{
            opacity: submoduleEntrance,
            transform: `translateY(${10 * (1 - submoduleEntrance)}px)`,
            padding: "12px 28px",
            borderRadius: 12,
            background: `${SK_COLORS.cyan}15`,
            border: `1px solid ${SK_COLORS.cyan}40`,
            fontFamily: FONTS.code,
            fontSize: 22,
            fontWeight: 600,
            color: SK_COLORS.cyan,
          }}
        >
          git submodule → shared-skills
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
