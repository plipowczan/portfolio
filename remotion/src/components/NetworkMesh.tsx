import { interpolate, random } from "remotion";
import { COLORS } from "../constants";

export const NetworkMesh = ({
  frame,
  color = COLORS.primary,
  nodeCount = 30,
  maxDistance = 300,
}: {
  frame: number;
  color?: string;
  nodeCount?: number;
  maxDistance?: number;
}) => {
  const nodes = Array.from({ length: nodeCount }).map((_, i) => {
    const seed = i * 100;
    return {
      x: random(seed) * 1920,
      y: random(seed + 1) * 1080,
      vx: (random(seed + 2) - 0.5) * 0.5,
      vy: (random(seed + 3) - 0.5) * 0.5,
    };
  });

  const animatedNodes = nodes.map((node, i) => ({
    x: ((node.x + node.vx * frame) % 1920 + 1920) % 1920,
    y: ((node.y + node.vy * frame) % 1080 + 1080) % 1080,
    id: i,
  }));

  const connections: { from: number; to: number; opacity: number }[] = [];

  for (let i = 0; i < animatedNodes.length; i++) {
    for (let j = i + 1; j < animatedNodes.length; j++) {
      const dx = animatedNodes[i].x - animatedNodes[j].x;
      const dy = animatedNodes[i].y - animatedNodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        connections.push({
          from: i,
          to: j,
          opacity: interpolate(distance, [0, maxDistance], [0.4, 0]),
        });
      }
    }
  }

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {connections.map((conn, i) => (
        <line
          key={i}
          x1={animatedNodes[conn.from].x}
          y1={animatedNodes[conn.from].y}
          x2={animatedNodes[conn.to].x}
          y2={animatedNodes[conn.to].y}
          stroke={color}
          strokeWidth="1"
          opacity={conn.opacity * 0.3}
        />
      ))}
      {animatedNodes.map((node) => (
        <circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r="3"
          fill={color}
          opacity="0.5"
        />
      ))}
    </svg>
  );
};
