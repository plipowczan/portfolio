import { interpolate, spring } from "remotion";
import { COLORS, FONTS } from "../constants";

export const ChatBubble = ({
  text,
  author,
  frame,
  fps,
  delay,
  strikethrough = false,
  strikeDelay = 0,
}: {
  text: string;
  author: string;
  frame: number;
  fps: number;
  delay: number;
  strikethrough?: boolean;
  strikeDelay?: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const slideX = interpolate(entrance, [0, 1], [100, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.9, 1]);

  const strikeProgress = strikethrough
    ? interpolate(
        frame,
        [strikeDelay, strikeDelay + 0.3 * fps],
        [0, 100],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  const xEntrance = strikethrough
    ? spring({
        frame: frame - strikeDelay,
        fps,
        config: { damping: 200 },
      })
    : 0;

  return (
    <div
      style={{
        transform: `translateX(${slideX}px) scale(${scale})`,
        opacity,
        padding: "16px 24px",
        borderRadius: 16,
        background: `${COLORS.darkSurface}cc`,
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        backdropFilter: "blur(10px)",
        maxWidth: 500,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.code,
          fontSize: 14,
          color: COLORS.mutedText,
          marginBottom: 8,
        }}
      >
        {author}
      </div>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 20,
          color: COLORS.text,
          lineHeight: 1.4,
          position: "relative",
        }}
      >
        {text}
        {/* Strike-through line */}
        {strikethrough && strikeProgress > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              height: 3,
              width: `${strikeProgress}%`,
              backgroundColor: COLORS.red,
              borderRadius: 2,
              transform: "translateY(-50%)",
              boxShadow: `0 0 10px ${COLORS.red}80`,
            }}
          />
        )}
      </div>
      {/* Red X overlay */}
      {strikethrough && xEntrance > 0.5 && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 12,
            fontSize: 32,
            color: COLORS.red,
            fontWeight: 900,
            opacity: interpolate(xEntrance, [0.5, 1], [0, 1]),
            textShadow: `0 0 10px ${COLORS.red}80`,
          }}
        >
          X
        </div>
      )}
    </div>
  );
};
