import { interpolate, spring } from "remotion";
import { COLORS, FONTS } from "../constants";

export const Terminal = ({
  children,
  frame,
  fps,
  title = "Terminal",
  width = 1200,
}: {
  children: React.ReactNode;
  frame: number;
  fps: number;
  title?: string;
  width?: number;
}) => {
  const entrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        width,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px ${COLORS.darkSurface}`,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: COLORS.darkSurface,
          padding: "12px 16px",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#ff5f56",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#ffbd2e",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#27c93f",
          }}
        />
        <span
          style={{
            marginLeft: 16,
            color: COLORS.mutedText,
            fontFamily: FONTS.code,
            fontSize: 14,
          }}
        >
          {title}
        </span>
      </div>
      {/* Content */}
      <div
        style={{
          background: "#0d1117",
          padding: 32,
          minHeight: 300,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const getTypedText = (
  frame: number,
  fps: number,
  text: string,
  startDelay: number,
  charsPerFrame: number = 0.15
): string => {
  const framesElapsed = Math.max(0, frame - startDelay * fps);
  const charsToShow = Math.floor(framesElapsed * charsPerFrame);
  return text.slice(0, charsToShow);
};

export const Cursor = ({
  visible,
  color = COLORS.primary,
}: {
  visible: boolean;
  color?: string;
}) => (
  <span
    style={{
      display: "inline-block",
      width: 12,
      height: 28,
      backgroundColor: visible ? color : "transparent",
      marginLeft: 2,
      verticalAlign: "middle",
    }}
  />
);
