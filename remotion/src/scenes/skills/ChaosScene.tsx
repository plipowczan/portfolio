import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import { SK_COLORS } from "../../skills-constants";
import { GlitchText } from "../../components/GlitchText";
import { Particle } from "../../components/Particle";
import { ScanlineOverlay } from "../../components/ScanlineOverlay";

const PROBLEMS = [
  "Brak orkiestracji",
  "Brak wersjonowania",
  "Brak testow",
  "Brak separacji kontekstow",
];

const ProblemCard = ({
  text,
  index,
  frame,
  fps,
}: {
  text: string;
  index: number;
  frame: number;
  fps: number;
}) => {
  const delay = 2 * fps + index * 0.6 * fps;

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideX = interpolate(entrance, [0, 1], [-40, 0]);

  // Red glow pulse
  const glowPhase = Math.max(0, frame - delay - fps);
  const glowIntensity = interpolate(
    Math.sin(glowPhase * 0.1),
    [-1, 1],
    [8, 20]
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${slideX}px)`,
        padding: "20px 32px",
        borderRadius: 16,
        background: `${SK_COLORS.darkSurface}cc`,
        border: `2px solid ${SK_COLORS.red}40`,
        backdropFilter: "blur(8px)",
        boxShadow: `0 0 ${glowIntensity}px ${SK_COLORS.redGlow}`,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: SK_COLORS.red,
          boxShadow: `0 0 12px ${SK_COLORS.red}`,
        }}
      />
      <GlitchText
        text={text}
        frame={Math.max(0, frame - delay)}
        fps={fps}
        color={SK_COLORS.red}
        intensity={0.5}
      />
    </div>
  );
};

export const ChaosScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleScale = interpolate(titleEntrance, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SK_COLORS.background,
      }}
    >
      {/* Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Particle
          key={i}
          index={i}
          frame={frame}
          color1={SK_COLORS.redGlow}
          color2={SK_COLORS.purpleGlow}
        />
      ))}

      <ScanlineOverlay opacity={0.06} />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 32,
          padding: 60,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            fontFamily: FONTS.heading,
            fontSize: 56,
            fontWeight: 900,
            color: SK_COLORS.text,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          AI w Twojej firmie?
        </div>

        {/* Problem cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            width: "100%",
            maxWidth: 700,
          }}
        >
          {PROBLEMS.map((problem, i) => (
            <ProblemCard
              key={i}
              text={problem}
              index={i}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
