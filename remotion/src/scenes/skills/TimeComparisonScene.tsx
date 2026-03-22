import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import { SK_COLORS } from "../../skills-constants";
import { CounterAnimation } from "../../components/CounterAnimation";
import { ScanlineOverlay } from "../../components/ScanlineOverlay";

const SidePanel = ({
  label,
  color,
  glowColor,
  frame,
  fps,
  side,
  counterTo,
  suffix,
}: {
  label: string;
  color: string;
  glowColor: string;
  frame: number;
  fps: number;
  side: "left" | "right";
  counterTo: number;
  suffix: string;
}) => {
  const entrance = spring({
    frame: frame - (side === "left" ? 0.3 : 0.6) * fps,
    fps,
    config: { damping: 14, stiffness: 90 },
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
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 40,
        borderRadius: 24,
        background: `${SK_COLORS.darkSurface}cc`,
        border: `2px solid ${color}30`,
        backdropFilter: "blur(8px)",
        boxShadow: `0 8px 40px ${glowColor}`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 26,
          fontWeight: 700,
          color,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
      <CounterAnimation
        frame={frame}
        fps={fps}
        from={0}
        to={counterTo}
        startDelay={side === "left" ? 0.8 : 1.2}
        duration={2.5}
        color={color}
        fontSize={96}
        suffix={suffix}
        formatNumber={false}
      />
    </div>
  );
};

export const TimeComparisonScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // VS entrance
  const vsEntrance = spring({
    frame: frame - 1.5 * fps,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.5 },
  });
  const vsScale = interpolate(vsEntrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SK_COLORS.background,
      }}
    >
      <ScanlineOverlay opacity={0.04} />

      {/* Split screen panels */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: 60,
        }}
      >
        <SidePanel
          label="Reczna praca"
          color={SK_COLORS.red}
          glowColor={SK_COLORS.redGlow}
          frame={frame}
          fps={fps}
          side="left"
          counterTo={120}
          suffix=" min"
        />

        {/* VS divider */}
        <div
          style={{
            transform: `scale(${vsScale})`,
            fontFamily: FONTS.heading,
            fontSize: 42,
            fontWeight: 900,
            color: SK_COLORS.mutedText,
          }}
        >
          vs
        </div>

        <SidePanel
          label="Skill-creator"
          color={SK_COLORS.green}
          glowColor={SK_COLORS.greenGlow}
          frame={frame}
          fps={fps}
          side="right"
          counterTo={20}
          suffix=" min"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
