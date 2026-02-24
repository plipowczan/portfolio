import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { FONTS } from "./constants";
import { CC_COLORS, CC_DURATIONS } from "./claude-code-constants";
import { Terminal, getTypedText, Cursor } from "./components/Terminal";
import { PIVProgressTracker } from "./scenes/claude-code/PIVProgressTracker";

loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

export const PIV_WORKFLOW_DURATION = CC_DURATIONS.pivWorkflow;

// --- Scene: Hook (0-4s) ---
const HookScene = ({
  frame,
  fps,
}: {
  frame: number;
  fps: number;
}) => {
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [3.5 * fps, 4 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        opacity: opacity * exit,
        padding: 80,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 34,
          fontWeight: 700,
          color: CC_COLORS.text,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Co jeśli istnieje
      </div>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 44,
          fontWeight: 900,
          textAlign: "center",
          background: CC_COLORS.gradientGreenCyan,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: `drop-shadow(0 0 20px ${CC_COLORS.greenGlow})`,
        }}
      >
        gotowy system
      </div>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 34,
          fontWeight: 700,
          color: CC_COLORS.text,
          textAlign: "center",
        }}
      >
        do pracy z AI?
      </div>
    </div>
  );
};

// --- Scene: Prime (4-9s) ---
const PrimeScene = ({
  frame,
  fps,
}: {
  frame: number;
  fps: number;
}) => {
  const sceneStart = 4 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [8.5 * fps, 9 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lines = [
    { text: "/prime", delay: 0.5 },
    { text: "Czytanie PRD... ok", delay: 1.5 },
    { text: "Skanowanie commitów... ok", delay: 2.5 },
    { text: "Kontekst załadowany ✓", delay: 3.5 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        opacity: opacity * exit,
        padding: 50,
      }}
    >
      {/* PIV Tracker */}
      <PIVProgressTracker
        frame={sceneFrame}
        fps={fps}
        activeStep={0}
        completedSteps={[]}
      />

      {/* Big P circle + label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${CC_COLORS.cyan}20`,
            border: `2px solid ${CC_COLORS.cyan}80`,
            boxShadow: `0 0 24px ${CC_COLORS.cyan}30`,
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              fontFamily: FONTS.heading,
              fontSize: 36,
              fontWeight: 900,
              color: CC_COLORS.cyan,
            }}
          >
            P
          </span>
        </div>
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: 32,
            fontWeight: 900,
            color: CC_COLORS.text,
          }}
        >
          PRIME
        </span>
      </div>

      {/* Mini terminal */}
      <Terminal
        frame={sceneFrame}
        fps={fps}
        title="prime"
        width={520}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lines.map((line, i) => {
            const typed = getTypedText(sceneFrame, fps, line.text, line.delay, 0.3);
            if (!typed) return null;

            const isCmd = i === 0;

            return (
              <div
                key={i}
                style={{
                  fontFamily: FONTS.code,
                  fontSize: 18,
                  color: isCmd ? CC_COLORS.cyan : CC_COLORS.green,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isCmd && (
                  <span style={{ color: CC_COLORS.mutedText, marginRight: 8 }}>$</span>
                )}
                {!isCmd && (
                  <span style={{ color: CC_COLORS.mutedText, marginRight: 8 }}>→</span>
                )}
                {typed}
                {i === lines.length - 1 && (
                  <Cursor visible={Math.floor(sceneFrame / 15) % 2 === 0} />
                )}
              </div>
            );
          })}
        </div>
      </Terminal>
    </div>
  );
};

// --- Scene: Plan (9-13s) ---
const PlanScene = ({
  frame,
  fps,
}: {
  frame: number;
  fps: number;
}) => {
  const sceneStart = 9 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [12.5 * fps, 13 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const planItems = [
    { text: "Feature description", delay: 0.5 },
    { text: "Technical approach", delay: 1.0 },
    { text: "Task breakdown", delay: 1.5 },
    { text: "Testing requirements", delay: 2.0 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        opacity: opacity * exit,
        padding: 50,
      }}
    >
      <PIVProgressTracker
        frame={sceneFrame}
        fps={fps}
        activeStep={1}
        completedSteps={[0]}
      />

      {/* Document icon + Plan list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          padding: "28px 36px",
          borderRadius: 20,
          background: `${CC_COLORS.darkSurface}cc`,
          border: `2px solid ${CC_COLORS.cyan}30`,
          backdropFilter: "blur(8px)",
          width: 480,
        }}
      >
        {/* Doc icon */}
        <svg width={36} height={36} viewBox="0 0 24 24" fill="none">
          <path
            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
            stroke={CC_COLORS.cyan}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="14 2 14 8 20 8"
            stroke={CC_COLORS.cyan}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {planItems.map((item, i) => {
          const itemEntrance = spring({
            frame: sceneFrame - item.delay * fps,
            fps,
            config: { damping: 15, stiffness: 100 },
          });
          const itemOpacity = interpolate(itemEntrance, [0, 1], [0, 1]);
          const slideX = interpolate(itemEntrance, [0, 1], [20, 0]);

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `translateX(${slideX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "8px 16px",
                borderRadius: 10,
                background: `${CC_COLORS.cyan}08`,
                borderLeft: `3px solid ${CC_COLORS.cyan}40`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: CC_COLORS.cyan,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 20,
                  fontWeight: 600,
                  color: CC_COLORS.text,
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}

        {/* Label */}
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 15,
            fontWeight: 600,
            color: CC_COLORS.green,
            padding: "6px 14px",
            borderRadius: 20,
            background: `${CC_COLORS.green}15`,
            border: `1px solid ${CC_COLORS.green}30`,
            marginTop: 4,
          }}
        >
          Self-contained plan
        </div>
      </div>
    </div>
  );
};

// --- Scene: Execute (13-17s) ---
const ExecuteScene = ({
  frame,
  fps,
}: {
  frame: number;
  fps: number;
}) => {
  const sceneStart = 13 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [16.5 * fps, 17 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const codeFiles = [
    { name: "AuthContext.jsx", delay: 1.5 },
    { name: "LoginForm.jsx", delay: 2.2 },
    { name: "tests/auth.test.js", delay: 2.9 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity: opacity * exit,
        padding: 50,
      }}
    >
      <PIVProgressTracker
        frame={sceneFrame}
        fps={fps}
        activeStep={2}
        completedSteps={[0, 1]}
      />

      {/* New session badge */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 16,
          fontWeight: 700,
          color: CC_COLORS.green,
          padding: "8px 20px",
          borderRadius: 20,
          background: `${CC_COLORS.green}15`,
          border: `1px solid ${CC_COLORS.green}40`,
        }}
      >
        NOWA SESJA
      </div>

      {/* Terminal */}
      <Terminal
        frame={sceneFrame}
        fps={fps}
        title="execute"
        width={520}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontFamily: FONTS.code,
              fontSize: 18,
              color: CC_COLORS.cyan,
            }}
          >
            <span style={{ color: CC_COLORS.mutedText }}>$ </span>
            {getTypedText(sceneFrame, fps, "/execute plan-auth.md", 0.3, 0.25)}
          </div>

          {/* Code file blocks */}
          {codeFiles.map((file, i) => {
            const fileEntrance = spring({
              frame: sceneFrame - file.delay * fps,
              fps,
              config: { damping: 12, stiffness: 100 },
            });
            const fileOpacity = interpolate(fileEntrance, [0, 1], [0, 1]);
            const fileSlide = interpolate(fileEntrance, [0, 1], [10, 0]);

            return (
              <div
                key={i}
                style={{
                  opacity: fileOpacity,
                  transform: `translateX(${fileSlide}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: `${CC_COLORS.green}10`,
                  borderLeft: `3px solid ${CC_COLORS.green}60`,
                }}
              >
                <span style={{ color: CC_COLORS.green, fontFamily: FONTS.code, fontSize: 16 }}>
                  ✓
                </span>
                <span
                  style={{
                    fontFamily: FONTS.code,
                    fontSize: 16,
                    color: CC_COLORS.text,
                  }}
                >
                  {file.name}
                </span>
              </div>
            );
          })}
        </div>
      </Terminal>
    </div>
  );
};

// --- Scene: Validate (17-19s) ---
const ValidateScene = ({
  frame,
  fps,
}: {
  frame: number;
  fps: number;
}) => {
  const sceneStart = 17 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [18.5 * fps, 19 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Big checkmark animation
  const checkScale = spring({
    frame: sceneFrame - 0.5 * fps,
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.8 },
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity: opacity * exit,
        padding: 50,
      }}
    >
      <PIVProgressTracker
        frame={sceneFrame}
        fps={fps}
        activeStep={3}
        completedSteps={[0, 1, 2, 3]}
      />

      {/* Big checkmark */}
      <div
        style={{
          transform: `scale(${interpolate(checkScale, [0, 1], [0, 1])})`,
        }}
      >
        <svg width={100} height={100} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke={CC_COLORS.green} strokeWidth="4" opacity="0.3" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={CC_COLORS.green}
            strokeWidth="4"
            style={{ filter: `drop-shadow(0 0 12px ${CC_COLORS.greenGlow})` }}
          />
          <polyline
            points="30 52 44 66 70 38"
            stroke={CC_COLORS.green}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 8px ${CC_COLORS.greenGlow})` }}
          />
        </svg>
      </div>

      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 28,
          fontWeight: 900,
          color: CC_COLORS.green,
          textAlign: "center",
          filter: `drop-shadow(0 0 10px ${CC_COLORS.greenGlow})`,
        }}
      >
        Wszystkie testy: PASSED
      </div>
    </div>
  );
};

// --- Scene: CTA (19-22s) ---
const CTAScene = ({
  frame,
  fps,
}: {
  frame: number;
  fps: number;
}) => {
  const sceneStart = 19 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [30, 0]);

  const underlineWidth = interpolate(
    sceneFrame,
    [0.5 * fps, 1.5 * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        opacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 40,
          fontWeight: 900,
          textAlign: "center",
          background: CC_COLORS.gradientGreenCyan,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Claude PIV Skeleton
      </div>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 24,
          fontWeight: 600,
          color: CC_COLORS.mutedText,
        }}
      >
        Gotowy framework
      </div>
      <div style={{ position: "relative", marginTop: 8 }}>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 22,
            fontWeight: 400,
            color: CC_COLORS.cyan,
          }}
        >
          pawel.lipowczan.pl/blog
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -4,
            left: 0,
            width: `${underlineWidth}%`,
            height: 2,
            background: CC_COLORS.gradientGreenCyan,
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
};

// --- Main Composition ---
export const ClaudeCodePIVWorkflow = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CC_COLORS.background,
        opacity: fadeOut,
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${CC_COLORS.mutedText}08 1px, transparent 1px),
            linear-gradient(90deg, ${CC_COLORS.mutedText}08 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "30%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CC_COLORS.cyan}08 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "20%",
          bottom: "30%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CC_COLORS.green}08 0%, transparent 70%)`,
        }}
      />

      {/* Scenes */}
      <HookScene frame={frame} fps={fps} />
      <PrimeScene frame={frame} fps={fps} />
      <PlanScene frame={frame} fps={fps} />
      <ExecuteScene frame={frame} fps={fps} />
      <ValidateScene frame={frame} fps={fps} />
      <CTAScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
