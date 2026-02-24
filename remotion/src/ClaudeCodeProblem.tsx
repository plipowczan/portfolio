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
import { CounterAnimation } from "./components/CounterAnimation";
import { GlitchText } from "./components/GlitchText";
import { Particle } from "./components/Particle";
import { ScanlineOverlay } from "./components/ScanlineOverlay";
import { Terminal, getTypedText, Cursor } from "./components/Terminal";
import { ProgressGauge } from "./scenes/claude-code/ProgressGauge";

loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

export const PROBLEM_DURATION = CC_DURATIONS.problem;

// --- Scene: Hook (0-5s) ---
const HookScene = ({
  frame,
  fps,
}: {
  frame: number;
  fps: number;
}) => {
  const sceneFrame = frame;
  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);

  // Exit
  const exit = interpolate(frame, [4.5 * fps, 5 * fps], [1, 0], {
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
        gap: 16,
        opacity: opacity * exit,
        transform: `scale(${scale})`,
      }}
    >
      <CounterAnimation
        frame={frame}
        fps={fps}
        from={0}
        to={80}
        startDelay={0.3}
        duration={2.5}
        color={CC_COLORS.amber}
        fontSize={120}
        suffix="%"
        formatNumber={false}
      />
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 32,
          fontWeight: 700,
          color: CC_COLORS.text,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        potencjału AI zostawiasz na stole
      </div>
    </div>
  );
};

// --- Scene: Reactive (5-11s) ---
const ReactiveScene = ({
  frame,
  fps,
}: {
  frame: number;
  fps: number;
}) => {
  const sceneStart = 5 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Exit
  const exit = interpolate(frame, [10.5 * fps, 11 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const prompts = [
    { text: "Dodaj przycisk logowania", delay: 0.3 },
    { text: "Napraw ten bug z CSS", delay: 1.2 },
    { text: "Hm, a może zmień podejście...", delay: 2.2 },
    { text: "Czekaj, cofnij to wszystko", delay: 3.2 },
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
        padding: 60,
      }}
    >
      {/* Label */}
      <div style={{ marginBottom: 8 }}>
        <GlitchText
          text="BEZ SYSTEMU"
          frame={sceneFrame}
          fps={fps}
          color={CC_COLORS.red}
          intensity={0.8}
        />
      </div>

      {/* Terminal with prompts */}
      <Terminal
        frame={sceneFrame}
        fps={fps}
        title="claude-code"
        width={700}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {prompts.map((prompt, i) => {
            const typed = getTypedText(
              sceneFrame,
              fps,
              prompt.text,
              prompt.delay,
              0.3
            );
            if (!typed) return null;

            const isStrikethrough = i < prompts.length - 1 &&
              sceneFrame > (prompt.delay + prompt.text.length / (0.3 * fps) + 0.5) * fps;

            return (
              <div
                key={i}
                style={{
                  fontFamily: FONTS.code,
                  fontSize: 20,
                  color: isStrikethrough ? `${CC_COLORS.mutedText}80` : CC_COLORS.text,
                  textDecoration: isStrikethrough ? "line-through" : "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ color: CC_COLORS.amber, marginRight: 8 }}>
                  &gt;
                </span>
                {typed}
                {i === prompts.length - 1 && (
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

// --- Scene: Systematic (11-17s) ---
const SystematicScene = ({
  frame,
  fps,
}: {
  frame: number;
  fps: number;
}) => {
  const sceneStart = 11 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Exit
  const exit = interpolate(frame, [16.5 * fps, 17 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const commands = [
    { cmd: "/prime", delay: 0.3 },
    { cmd: "/plan-feature", delay: 1.2 },
    { cmd: "/execute", delay: 2.1 },
    { cmd: "/validate", delay: 3.0 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        opacity: opacity * exit,
        padding: 60,
      }}
    >
      {/* Terminal */}
      <Terminal
        frame={sceneFrame}
        fps={fps}
        title="claude-code workflow"
        width={520}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {commands.map((item, i) => {
            const typed = getTypedText(
              sceneFrame,
              fps,
              item.cmd,
              item.delay,
              0.25
            );
            if (!typed) return null;

            const cmdDone =
              sceneFrame > (item.delay + item.cmd.length / (0.25 * fps) + 0.3) * fps;

            return (
              <div
                key={i}
                style={{
                  fontFamily: FONTS.code,
                  fontSize: 22,
                  color: CC_COLORS.green,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {cmdDone && (
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <polyline
                      points="6 12 10 16 18 8"
                      stroke={CC_COLORS.green}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <span>{typed}</span>
              </div>
            );
          })}
        </div>
      </Terminal>

      {/* Progress Gauge */}
      <ProgressGauge
        frame={frame}
        fps={fps}
        fromPercent={20}
        toPercent={80}
        startDelay={12}
        duration={3}
        size={200}
      />
    </div>
  );
};

// --- Scene: CTA (17-20s) ---
const CTAScene = ({
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
    config: { damping: 12, stiffness: 80 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [30, 0]);

  // Underline animation
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
        gap: 24,
        opacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 36,
          fontWeight: 900,
          color: CC_COLORS.text,
          textAlign: "center",
        }}
      >
        5 technik pracy z Claude Code
      </div>
      <div style={{ position: "relative" }}>
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
export const ClaudeCodeProblem = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade out last second
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

      {/* Particles (clipped to 1080x1080) */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle
            key={i}
            index={i}
            frame={frame}
            color1={`${CC_COLORS.amber}30`}
            color2={`${CC_COLORS.cyan}30`}
          />
        ))}
      </div>

      <ScanlineOverlay opacity={0.04} />

      {/* Scenes */}
      <HookScene frame={frame} fps={fps} />
      <ReactiveScene frame={frame} fps={fps} />
      <SystematicScene frame={frame} fps={fps} />
      <CTAScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
