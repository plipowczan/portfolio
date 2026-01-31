import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { COLORS, FONTS } from "../constants";

// Terminal window component
const Terminal = ({
  children,
  frame,
  fps,
}: {
  children: React.ReactNode;
  frame: number;
  fps: number;
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
        width: 1200,
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
          Terminal
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

// Typing animation helper
const getTypedText = (
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

// Cursor component
const Cursor = ({ visible }: { visible: boolean }) => (
  <span
    style={{
      display: "inline-block",
      width: 12,
      height: 28,
      backgroundColor: visible ? COLORS.primary : "transparent",
      marginLeft: 2,
      verticalAlign: "middle",
    }}
  />
);

// Progress bar component
const ProgressBar = ({
  progress,
  frame,
  fps,
}: {
  progress: number;
  frame: number;
  fps: number;
}) => {
  const barWidth = 600;
  const filledWidth = (progress / 100) * barWidth;

  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          width: barWidth,
          height: 24,
          backgroundColor: COLORS.darkSurface,
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: filledWidth,
            height: "100%",
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
            borderRadius: 12,
            boxShadow: `0 0 20px ${COLORS.primary}60`,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: FONTS.code,
          fontSize: 20,
          color: COLORS.mutedText,
        }}
      >
        {Math.floor(progress)}%
      </div>
    </div>
  );
};

export const WorkflowScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Command text
  const command = "npx remotion render ExplainerVideo out/video.mp4";
  const typedCommand = getTypedText(frame, fps, command, 0.5, 0.2);
  const commandComplete = typedCommand.length >= command.length;

  // Cursor blink
  const cursorVisible =
    !commandComplete || Math.floor(frame / (fps * 0.5)) % 2 === 0;

  // Progress bar animation (starts after command is typed)
  const progressStartFrame = command.length / 0.2 + 0.5 * fps + 0.5 * fps;
  const progressDuration = 4 * fps;
  const progress = interpolate(
    frame,
    [progressStartFrame, progressStartFrame + progressDuration],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "45 sekund -> Gotowe wideo" text
  const resultTextDelay = progressStartFrame + progressDuration + 0.3 * fps;
  const resultEntrance = spring({
    frame: frame - resultTextDelay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Pulsing glow for result text
  const glowIntensity = interpolate(
    Math.sin((frame - resultTextDelay) * 0.15),
    [-1, 1],
    [10, 30]
  );

  // Scene fade out
  const sceneFade = interpolate(
    frame,
    [durationInFrames - 0.5 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 60,
        opacity: sceneFade,
      }}
    >
      <Terminal frame={frame} fps={fps}>
        {/* Prompt line */}
        <div
          style={{
            fontFamily: FONTS.code,
            fontSize: 24,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ color: COLORS.primary }}>$ </span>
          <span style={{ color: COLORS.text }}>{typedCommand}</span>
          {!commandComplete && <Cursor visible={cursorVisible} />}
        </div>

        {/* Output and progress */}
        {commandComplete && (
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontFamily: FONTS.code,
                fontSize: 18,
                color: COLORS.mutedText,
              }}
            >
              Rendering video...
            </div>
            <ProgressBar progress={progress} frame={frame} fps={fps} />
          </div>
        )}
      </Terminal>

      {/* Result text */}
      {progress >= 100 && (
        <div
          style={{
            opacity: resultEntrance,
            transform: `translateY(${30 * (1 - resultEntrance)}px) scale(${0.9 + 0.1 * resultEntrance})`,
            position: "relative",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              inset: -20,
              background: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.secondary}20)`,
              filter: `blur(${glowIntensity}px)`,
              borderRadius: 16,
            }}
          />
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 72,
              fontWeight: 700,
              color: COLORS.text,
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <span style={{ color: COLORS.primary }}>45 sekund</span>
            <span style={{ color: COLORS.mutedText }}>→</span>
            <span
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Gotowe wideo
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
