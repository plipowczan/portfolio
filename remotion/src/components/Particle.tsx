import { interpolate, random } from "remotion";
import { COLORS } from "../constants";

export const Particle = ({
  index,
  frame,
  color1 = `${COLORS.primary}40`,
  color2 = `${COLORS.secondary}40`,
}: {
  index: number;
  frame: number;
  color1?: string;
  color2?: string;
}) => {
  const seed = index * 1000;
  const x = random(seed) * 1920;
  const y = random(seed + 1) * 1080;
  const size = random(seed + 2) * 4 + 2;
  const speed = random(seed + 3) * 0.02 + 0.01;
  const offset = random(seed + 4) * Math.PI * 2;

  const opacity = interpolate(
    Math.sin(frame * speed + offset),
    [-1, 1],
    [0.1, 0.4]
  );

  const drift = Math.sin(frame * speed * 0.5 + offset) * 20;

  return (
    <div
      style={{
        position: "absolute",
        left: x + drift,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        opacity,
      }}
    />
  );
};
