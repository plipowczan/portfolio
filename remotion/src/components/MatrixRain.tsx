import { random } from "remotion";

const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";

export const MatrixRain = ({
  frame,
  color = "#00ff41",
  columnCount = 40,
  speed = 1,
}: {
  frame: number;
  color?: string;
  columnCount?: number;
  speed?: number;
}) => {
  const columns = Array.from({ length: columnCount }).map((_, i) => {
    const seed = i * 777;
    const x = random(seed) * 1920;
    const charCount = Math.floor(random(seed + 1) * 12) + 8;
    const dropSpeed = (random(seed + 2) * 3 + 2) * speed;
    const startOffset = random(seed + 3) * 1080;

    return { x, charCount, dropSpeed, startOffset, seed };
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: 0.15,
      }}
    >
      {columns.map((col, colIndex) => {
        const yBase = (col.startOffset + frame * col.dropSpeed) % (1080 + col.charCount * 24);

        return (
          <div
            key={colIndex}
            style={{
              position: "absolute",
              left: col.x,
              top: yBase - col.charCount * 24,
              display: "flex",
              flexDirection: "column",
              fontFamily: "monospace",
              fontSize: 18,
              lineHeight: "24px",
            }}
          >
            {Array.from({ length: col.charCount }).map((_, charIndex) => {
              const charSeed = col.seed + charIndex * 31 + Math.floor(frame * 0.1);
              const charIdx = Math.floor(
                random(charSeed) * MATRIX_CHARS.length
              );
              const isHead = charIndex === col.charCount - 1;
              const fadeOpacity = isHead
                ? 1
                : 1 - charIndex / col.charCount;

              return (
                <span
                  key={charIndex}
                  style={{
                    color: isHead ? "#ffffff" : color,
                    opacity: fadeOpacity,
                    textShadow: isHead
                      ? `0 0 10px ${color}`
                      : "none",
                  }}
                >
                  {MATRIX_CHARS[charIdx]}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
