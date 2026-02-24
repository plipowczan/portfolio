import { interpolate, spring } from "remotion";
import { CC_COLORS } from "../../claude-code-constants";
import { FONTS } from "../../constants";

interface Segment {
  label: string;
  color: string;
  heightPercent: number;
}

export const ContextWindowBar = ({
  frame,
  fps,
  segments,
  startDelay = 0,
  segmentInterval = 0.6,
  barWidth = 80,
  barHeight = 500,
  showLabels = true,
  borderColor,
}: {
  frame: number;
  fps: number;
  segments: Segment[];
  startDelay?: number;
  segmentInterval?: number;
  barWidth?: number;
  barHeight?: number;
  showLabels?: boolean;
  borderColor?: string;
}) => {
  // Calculate total fill percentage for border color
  let totalFill = 0;
  segments.forEach((seg, i) => {
    const segStart = (startDelay + i * segmentInterval) * fps;
    const segProgress = interpolate(frame, [segStart, segStart + fps * 0.5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    totalFill += seg.heightPercent * segProgress;
  });

  // Border color: green -> amber -> red based on fill
  const computedBorderColor =
    borderColor ||
    (totalFill < 40
      ? CC_COLORS.green
      : totalFill < 70
        ? CC_COLORS.amber
        : CC_COLORS.red);

  // Entrance
  const entrance = spring({
    frame: frame - startDelay * fps,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideX = interpolate(entrance, [0, 1], [-20, 0]);

  // Accumulate y offsets from bottom
  let accumulatedHeight = 0;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        gap: showLabels ? 16 : 0,
        opacity,
        transform: `translateX(${slideX}px)`,
      }}
    >
      {/* Bar */}
      <div
        style={{
          position: "relative",
          width: barWidth,
          height: barHeight,
          borderRadius: 12,
          border: `2px solid ${computedBorderColor}60`,
          background: `${CC_COLORS.darkSurface}cc`,
          backdropFilter: "blur(8px)",
          overflow: "hidden",
          boxShadow: `0 0 20px ${computedBorderColor}15`,
          transition: "border-color 0.3s",
        }}
      >
        {segments.map((seg, i) => {
          const segStart = (startDelay + i * segmentInterval) * fps;
          const segProgress = interpolate(
            frame,
            [segStart, segStart + fps * 0.5],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const segHeight = (seg.heightPercent / 100) * barHeight * segProgress;
          const bottomOffset = accumulatedHeight;
          accumulatedHeight += (seg.heightPercent / 100) * barHeight;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: bottomOffset,
                left: 0,
                right: 0,
                height: segHeight,
                background: `${seg.color}60`,
                borderTop: segHeight > 2 ? `1px solid ${seg.color}80` : "none",
              }}
            />
          );
        })}
      </div>

      {/* Labels */}
      {showLabels && (
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            justifyContent: "flex-start",
            height: barHeight,
            gap: 4,
          }}
        >
          {segments.map((seg, i) => {
            const segStart = (startDelay + i * segmentInterval) * fps;
            const labelOpacity = interpolate(
              frame,
              [segStart + fps * 0.3, segStart + fps * 0.6],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  opacity: labelOpacity,
                  fontFamily: FONTS.heading,
                  fontSize: 16,
                  fontWeight: 600,
                  color: seg.color,
                  whiteSpace: "nowrap",
                  height: `${seg.heightPercent}%`,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {seg.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
