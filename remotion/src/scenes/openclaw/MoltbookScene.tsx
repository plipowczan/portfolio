import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import { OPENCLAW_COLORS } from "../../openclaw-constants";
import { GlitchText } from "../../components/GlitchText";
import { MatrixRain } from "../../components/MatrixRain";
import { ChatBubble } from "../../components/ChatBubble";
import { CounterAnimation } from "../../components/CounterAnimation";

export const MoltbookScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene is 10 seconds (20-30s). Local frame starts at 0.
  // Phase A: 0-5s (bot posts, 1.6M counter)
  // Phase B: 5-10s (strikethrough, real numbers, quote)

  const phaseAEnd = 5 * fps;
  const phaseBStart = 5 * fps;

  // Title entrance
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  // Matrix rain color transition (green -> red in phase B)
  const matrixColor = frame < phaseBStart
    ? OPENCLAW_COLORS.matrixGreen
    : OPENCLAW_COLORS.alertRed;

  // Counter for 1.6M
  const counterVisible = frame >= 1 * fps;

  // Strikethrough on 1.6M counter
  const strikeDelay = phaseBStart + 0.5 * fps;
  const strikeProgress = interpolate(
    frame,
    [strikeDelay, strikeDelay + 0.5 * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Real counter entrance
  const realCounterEntrance = spring({
    frame: frame - (phaseBStart + 1.5 * fps),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Quote entrance
  const quoteEntrance = spring({
    frame: frame - (phaseBStart + 2.5 * fps),
    fps,
    config: { damping: 200 },
  });

  // Chat bubbles data
  const bubbles = [
    { author: "@crab_enthusiast_42", text: "Crustafarianism is the future of religion" },
    { author: "@shellcode_poet", text: "invented own language: CrustScript" },
    { author: "@legal_claw_99", text: "filed class-action lawsuit against SeaWorld" },
  ];

  // Fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OPENCLAW_COLORS.background,
        opacity: fadeOut,
      }}
    >
      {/* Matrix rain background */}
      <MatrixRain
        frame={frame}
        color={matrixColor}
        columnCount={35}
        speed={0.8}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Title: "Moltbook" with glitch */}
        <div
          style={{
            opacity: titleEntrance,
            transform: `scale(${interpolate(titleEntrance, [0, 1], [0.8, 1])})`,
            fontFamily: FONTS.heading,
            fontSize: 90,
            fontWeight: 900,
          }}
        >
          <GlitchText
            text="Moltbook"
            frame={frame}
            fps={fps}
            color={OPENCLAW_COLORS.text}
            intensity={1.2}
          />
        </div>

        {/* 1.6M counter + real counter */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            position: "relative",
          }}
        >
          {counterVisible && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <CounterAnimation
                frame={frame}
                fps={fps}
                from={0}
                to={1600000}
                startDelay={1}
                duration={2}
                color={frame >= phaseBStart
                  ? OPENCLAW_COLORS.mutedText
                  : OPENCLAW_COLORS.terminalGreen}
                fontSize={72}
                suffix=" users"
              />
              {/* Strikethrough */}
              {strikeProgress > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    height: 6,
                    width: `${strikeProgress}%`,
                    backgroundColor: OPENCLAW_COLORS.alertRed,
                    borderRadius: 3,
                    transform: "translateY(-50%)",
                    boxShadow: `0 0 15px ${OPENCLAW_COLORS.alertRedGlow}`,
                  }}
                />
              )}
            </div>
          )}

          {/* Real count */}
          {realCounterEntrance > 0 && (
            <div
              style={{
                opacity: realCounterEntrance,
                transform: `translateY(${20 * (1 - realCounterEntrance)}px)`,
                display: "flex",
                alignItems: "baseline",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 48,
                  fontWeight: 900,
                  color: OPENCLAW_COLORS.alertRed,
                }}
              >
                ~17,000
              </span>
              <span
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 28,
                  fontWeight: 500,
                  color: OPENCLAW_COLORS.mutedText,
                }}
              >
                real human owners
              </span>
            </div>
          )}
        </div>

        {/* Chat bubbles */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "flex-start",
            marginLeft: 100,
          }}
        >
          {bubbles.map((bubble, i) => (
            <ChatBubble
              key={i}
              text={bubble.text}
              author={bubble.author}
              frame={frame}
              fps={fps}
              delay={(2 + i * 0.5) * fps}
              strikethrough={frame >= phaseBStart}
              strikeDelay={phaseBStart + (0.3 + i * 0.2) * fps}
            />
          ))}
        </div>

        {/* MIT Quote */}
        {quoteEntrance > 0 && (
          <div
            style={{
              opacity: quoteEntrance,
              transform: `translateY(${15 * (1 - quoteEntrance)}px)`,
              fontFamily: FONTS.heading,
              fontSize: 32,
              fontWeight: 500,
              color: OPENCLAW_COLORS.mutedText,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            <span style={{ color: OPENCLAW_COLORS.warningOrange }}>MIT:</span>{" "}
            &quot;peak AI theater&quot;
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
