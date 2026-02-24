import { interpolate, spring } from "remotion";
import { CC_COLORS } from "../../claude-code-constants";
import { FONTS } from "../../constants";

export const ProgressGauge = ({
  frame,
  fps,
  fromPercent = 20,
  toPercent = 80,
  startDelay = 0,
  duration = 2,
  size = 180,
  strokeWidth = 14,
}: {
  frame: number;
  fps: number;
  fromPercent?: number;
  toPercent?: number;
  startDelay?: number;
  duration?: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const startFrame = startDelay * fps;
  const endFrame = startFrame + duration * fps;

  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const eased = 1 - Math.pow(1 - progress, 3);
  const currentPercent = fromPercent + (toPercent - fromPercent) * eased;

  // Color interpolation: amber at low, green at high
  const colorProgress = interpolate(
    currentPercent,
    [fromPercent, toPercent],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Simple color blend: amber -> green
  const r = Math.round(245 + (34 - 245) * colorProgress);
  const g = Math.round(158 + (197 - 158) * colorProgress);
  const b = Math.round(11 + (94 - 11) * colorProgress);
  const strokeColor = `rgb(${r}, ${g}, ${b})`;
  const glowColor = `rgba(${r}, ${g}, ${b}, 0.4)`;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - currentPercent / 100);

  // Entrance spring
  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const scale = interpolate(entrance, [0, 1], [0.6, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${CC_COLORS.mutedText}20`}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${glowColor})`,
          }}
        />
      </svg>
      {/* Center text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: size * 0.28,
            fontWeight: 900,
            color: strokeColor,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(currentPercent)}%
        </span>
      </div>
    </div>
  );
};
