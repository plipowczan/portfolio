import { interpolate } from "remotion";
import { COLORS } from "../constants";

export const GlitchText = ({
  text,
  frame,
  fps,
  color = COLORS.text,
  intensity = 1,
}: {
  text: string;
  frame: number;
  fps: number;
  color?: string;
  intensity?: number;
}) => {
  const glitchIntensity =
    interpolate(
      frame,
      [0, 0.5 * fps, 1 * fps, 1.5 * fps, 2 * fps],
      [0, 8, 0, 12, 0],
      { extrapolateRight: "clamp" }
    ) * intensity;

  const glitchX = Math.sin(frame * 0.5) * glitchIntensity;
  const glitchY = Math.cos(frame * 0.7) * glitchIntensity * 0.5;

  const rgbOffset = glitchIntensity * 0.3;

  return (
    <div style={{ position: "relative" }}>
      {/* Red channel */}
      <span
        style={{
          position: "absolute",
          color: "rgba(255, 0, 0, 0.5)",
          transform: `translate(${-rgbOffset}px, 0)`,
          mixBlendMode: "screen",
        }}
      >
        {text}
      </span>
      {/* Blue channel */}
      <span
        style={{
          position: "absolute",
          color: "rgba(0, 0, 255, 0.5)",
          transform: `translate(${rgbOffset}px, 0)`,
          mixBlendMode: "screen",
        }}
      >
        {text}
      </span>
      {/* Main text */}
      <span
        style={{
          position: "relative",
          color,
          transform: `translate(${glitchX}px, ${glitchY}px)`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
