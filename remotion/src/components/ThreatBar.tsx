import { interpolate, spring } from "remotion";
import { COLORS, FONTS } from "../constants";

export const ThreatBar = ({
  label,
  severity,
  frame,
  fps,
  delay,
  color = COLORS.red,
}: {
  label: string;
  severity: number; // 0-100
  frame: number;
  fps: number;
  delay: number;
  color?: string;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const barWidth = interpolate(entrance, [0, 1], [0, severity]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideX = interpolate(entrance, [0, 1], [-100, 0]);

  const pulse = interpolate(
    Math.sin((frame - delay) * 0.1),
    [-1, 1],
    [0.8, 1]
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity,
        transform: `translateX(${slideX}px)`,
        width: 800,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.code,
          fontSize: 18,
          color: COLORS.text,
          width: 220,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 28,
          backgroundColor: `${COLORS.darkSurface}`,
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid ${color}30`,
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            borderRadius: 4,
            boxShadow: `0 0 15px ${color}60`,
            opacity: pulse,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: FONTS.code,
          fontSize: 16,
          color,
          width: 50,
          flexShrink: 0,
        }}
      >
        {Math.floor(barWidth)}%
      </span>
    </div>
  );
};
