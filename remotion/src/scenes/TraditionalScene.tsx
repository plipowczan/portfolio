import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { COLORS, FONTS } from "../constants";

// Timeline step icons
const LightbulbIcon = ({ size = 60 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4.95 11.95c.75.75 1.2 1.78 1.2 2.84V18h7.6v-1.21c0-1.06.45-2.09 1.2-2.84A7 7 0 0 0 12 2z" />
  </svg>
);

const StoryboardIcon = ({ size = 60 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="8" y1="3" x2="8" y2="10" />
    <line x1="16" y1="3" x2="16" y2="10" />
  </svg>
);

const EditIcon = ({ size = 60 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const ExportIcon = ({ size = 60 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const TimelineStep = ({
  icon,
  label,
  delay,
  frame,
  fps,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  delay: number;
  frame: number;
  fps: number;
  index: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const slideY = interpolate(entrance, [0, 1], [50, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `translateY(${slideY}px)`,
        opacity,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 24,
          backgroundColor: COLORS.darkSurface,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: COLORS.text,
          border: `2px solid ${COLORS.mutedText}40`,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          color: COLORS.mutedText,
          fontSize: 24,
          fontFamily: FONTS.heading,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
};

const Arrow = ({
  delay,
  frame,
  fps,
}: {
  delay: number;
  frame: number;
  fps: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        color: COLORS.mutedText,
        fontSize: 48,
        opacity: entrance,
        transform: `scaleX(${entrance})`,
      }}
    >
      →
    </div>
  );
};

export const TraditionalScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const steps = [
    { icon: <LightbulbIcon />, label: "Pomysł" },
    { icon: <StoryboardIcon />, label: "Storyboard" },
    { icon: <EditIcon />, label: "Edycja" },
    { icon: <ExportIcon />, label: "Export" },
  ];

  // Strike-through line animation
  const strikeProgress = interpolate(
    frame,
    [2.5 * fps, 4 * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "Tygodnie pracy" text entrance and fade
  const textEntrance = spring({
    frame: frame - 4.5 * fps,
    fps,
    config: { damping: 200 },
  });

  const textFade = interpolate(
    frame,
    [6 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
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
        opacity: sceneFade,
      }}
    >
      {/* Timeline container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
          position: "relative",
        }}
      >
        {steps.map((step, index) => (
          <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <TimelineStep
              icon={step.icon}
              label={step.label}
              delay={index * 0.3 * fps}
              frame={frame}
              fps={fps}
              index={index}
            />
            {index < steps.length - 1 && (
              <Arrow delay={(index + 0.5) * 0.3 * fps} frame={frame} fps={fps} />
            )}
          </div>
        ))}

        {/* Red strike-through line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            height: 8,
            width: `${strikeProgress}%`,
            backgroundColor: COLORS.red,
            borderRadius: 4,
            transform: "translateY(-50%)",
            boxShadow: `0 0 20px ${COLORS.red}80`,
          }}
        />
      </div>

      {/* "Tygodnie pracy" text */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          fontFamily: FONTS.heading,
          fontSize: 64,
          fontWeight: 700,
          color: COLORS.red,
          opacity: textEntrance * textFade,
          transform: `translateY(${20 * (1 - textEntrance)}px)`,
        }}
      >
        Tygodnie pracy
      </div>
    </AbsoluteFill>
  );
};
