import { interpolate, spring } from "remotion";
import { CC_COLORS } from "../../claude-code-constants";
import { FONTS } from "../../constants";

const STEPS = [
  { label: "Prime", letter: "P" },
  { label: "Plan", letter: "I" },
  { label: "Execute", letter: "E" },
  { label: "Validate", letter: "V" },
] as const;

export const PIVProgressTracker = ({
  frame,
  fps,
  activeStep,
  completedSteps = [],
}: {
  frame: number;
  fps: number;
  activeStep: number; // 0-3
  completedSteps?: number[];
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {STEPS.map((step, i) => {
        const isActive = i === activeStep;
        const isCompleted = completedSteps.includes(i);
        const isFuture = i > activeStep && !isCompleted;

        // Entrance animation staggered
        const entrance = spring({
          frame: frame - i * 4,
          fps,
          config: { damping: 12, stiffness: 100 },
        });
        const scale = isActive
          ? interpolate(entrance, [0, 1], [0.8, 1.1])
          : interpolate(entrance, [0, 1], [0.8, 1]);
        const opacity = interpolate(entrance, [0, 1], [0, isFuture ? 0.4 : 1]);

        // Pulse for active step
        const pulse = isActive
          ? 1 + Math.sin(frame * 0.15) * 0.05
          : 1;

        const circleSize = 52;
        const accentColor = isCompleted
          ? CC_COLORS.green
          : isActive
            ? CC_COLORS.cyan
            : CC_COLORS.mutedText;

        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                opacity,
                transform: `scale(${scale * pulse})`,
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive
                    ? `${accentColor}20`
                    : isCompleted
                      ? `${accentColor}15`
                      : `${CC_COLORS.darkSurface}cc`,
                  border: `2px solid ${accentColor}${isActive ? "cc" : "50"}`,
                  boxShadow: isActive
                    ? `0 0 20px ${accentColor}40`
                    : "none",
                  backdropFilter: "blur(8px)",
                }}
              >
                {isCompleted ? (
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <polyline
                      points="6 12 10 16 18 8"
                      stroke={CC_COLORS.green}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span
                    style={{
                      fontFamily: FONTS.heading,
                      fontSize: 22,
                      fontWeight: 900,
                      color: accentColor,
                    }}
                  >
                    {step.letter}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: accentColor,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 40,
                  height: 2,
                  background: isCompleted
                    ? `${CC_COLORS.green}80`
                    : `${CC_COLORS.mutedText}30`,
                  borderRadius: 1,
                  marginBottom: 28,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
