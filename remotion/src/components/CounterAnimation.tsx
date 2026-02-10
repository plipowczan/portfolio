import { interpolate } from "remotion";
import { FONTS } from "../constants";

export const CounterAnimation = ({
  frame,
  fps,
  from = 0,
  to,
  startDelay = 0,
  duration = 2,
  color = "#ffffff",
  fontSize = 72,
  prefix = "",
  suffix = "",
  formatNumber = true,
}: {
  frame: number;
  fps: number;
  from?: number;
  to: number;
  startDelay?: number;
  duration?: number;
  color?: string;
  fontSize?: number;
  prefix?: string;
  suffix?: string;
  formatNumber?: boolean;
}) => {
  const startFrame = startDelay * fps;
  const endFrame = startFrame + duration * fps;

  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ease out cubic for natural deceleration
  const eased = 1 - Math.pow(1 - progress, 3);
  const current = Math.floor(from + (to - from) * eased);

  const display = formatNumber
    ? current.toLocaleString("en-US")
    : String(current);

  return (
    <span
      style={{
        fontFamily: FONTS.heading,
        fontSize,
        fontWeight: 900,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {display}
      {suffix}
    </span>
  );
};
