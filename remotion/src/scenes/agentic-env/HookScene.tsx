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

const LINES = [
  { text: "2 firmy.", color: SK_COLORS.cyan },
  { text: "1 system.", color: SK_COLORS.purple },
  { text: "8 agentów.", color: SK_COLORS.green },
];

export const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
          backgroundSize: "50px 50px",
        }}
      />

      <ScanlineOverlay opacity={0.03} />

      {/* Center radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${SK_COLORS.purpleGlow} 0%, transparent 70%)`,
          opacity: interpolate(frame, [0, 1 * fps], [0, 0.6], {
            extrapolateRight: "clamp",
          }),
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {LINES.map((line, i) => {
          const delay = i * 0.6 * fps;

          const entrance = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 100 },
          });

          const opacity = interpolate(entrance, [0, 1], [0, 1]);
          const y = interpolate(entrance, [0, 1], [40, 0]);
          const scale = interpolate(entrance, [0, 1], [0.85, 1]);

          // Glitch flicker on entrance
          const glitchPhase = frame - delay;
          const glitchOffset =
            glitchPhase > 0 && glitchPhase < 0.3 * fps
              ? Math.sin(glitchPhase * 2.5) * 3
              : 0;

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${y}px) scale(${scale}) translateX(${glitchOffset}px)`,
                fontFamily: FONTS.heading,
                fontSize: 72,
                fontWeight: 900,
                color: line.color,
                textShadow: `0 0 40px ${line.color}60`,
                letterSpacing: -1,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
