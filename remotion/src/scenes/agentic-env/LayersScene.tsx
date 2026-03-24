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

const LAYERS = [
  {
    label: "Tools",
    description: "bash / Python scripts",
    color: SK_COLORS.amber,
    glow: SK_COLORS.amberGlow,
    icon: "⚙",
  },
  {
    label: "Context",
    description: "dane firmowe (*.md)",
    color: SK_COLORS.blue,
    glow: SK_COLORS.blueGlow,
    icon: "📂",
  },
  {
    label: "Skills",
    description: "SKILL.md + references/",
    color: SK_COLORS.purple,
    glow: SK_COLORS.purpleGlow,
    icon: "🧠",
  },
];

const LayerBlock = ({
  label,
  description,
  color,
  glow,
  index,
  frame,
  fps,
}: {
  label: string;
  description: string;
  color: string;
  glow: string;
  index: number;
  frame: number;
  fps: number;
}) => {
  // Stagger from bottom: Tools first, then Context, then Skills
  const delay = 1 * fps + index * 0.7 * fps;

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const x = interpolate(entrance, [0, 1], [-120, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "28px 40px",
        borderRadius: 20,
        background: `${SK_COLORS.darkSurface}cc`,
        border: `2px solid ${color}40`,
        backdropFilter: "blur(10px)",
        boxShadow: `0 4px 24px ${glow}`,
        width: 700,
      }}
    >
      {/* Colored bar on left */}
      <div
        style={{
          width: 6,
          height: 60,
          borderRadius: 3,
          backgroundColor: color,
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 36,
            fontWeight: 900,
            color,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: FONTS.code,
            fontSize: 18,
            fontWeight: 400,
            color: SK_COLORS.mutedText,
            marginTop: 4,
          }}
        >
          {description}
        </div>
      </div>

      {/* Arrow indicator */}
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18l6-6-6-6"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const LayersScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleY = interpolate(titleEntrance, [0, 1], [-20, 0]);

  // Separator label between Context and Skills
  const separatorDelay = 3.5 * fps;
  const separatorEntrance = spring({
    frame: frame - separatorDelay,
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

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 20,
          padding: "60px 80px",
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: FONTS.heading,
            fontSize: 42,
            fontWeight: 900,
            color: SK_COLORS.text,
            marginBottom: 16,
          }}
        >
          Architektura 3 warstw
        </div>

        {/* Stack: layers in reverse order (Skills on top, Tools on bottom) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            gap: 16,
            alignItems: "center",
          }}
        >
          {LAYERS.map((layer, i) => (
            <LayerBlock
              key={i}
              {...layer}
              index={i}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>

        {/* Separator label */}
        <div
          style={{
            opacity: separatorEntrance,
            transform: `translateY(${8 * (1 - separatorEntrance)}px)`,
            fontFamily: FONTS.code,
            fontSize: 18,
            fontWeight: 600,
            color: SK_COLORS.mutedText,
            marginTop: 12,
            padding: "8px 20px",
            borderRadius: 10,
            background: `${SK_COLORS.text}08`,
            border: `1px solid ${SK_COLORS.text}10`,
          }}
        >
          Skill wie JAK → Context mówi JAKIE
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
