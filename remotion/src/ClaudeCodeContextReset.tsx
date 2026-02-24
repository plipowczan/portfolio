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
import { GlitchText } from "./components/GlitchText";
import { NetworkMesh } from "./components/NetworkMesh";
import { CounterAnimation } from "./components/CounterAnimation";
import { ContextWindowBar } from "./scenes/claude-code/ContextWindowBar";

loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

export const CONTEXT_RESET_DURATION = CC_DURATIONS.contextReset;

// --- Scene: Hook (0-5s) ---
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

  const exit = interpolate(frame, [4.5 * fps, 5 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Word-by-word reveal
  const words = ["Dlaczego", "najlepsi", "programiści"];
  const words2 = ["w połowie", "pracy?"];

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
        {words.map((word, i) => {
          const wordEntrance = spring({
            frame: frame - i * 4,
            fps,
            config: { damping: 15, stiffness: 120 },
          });
          return (
            <span
              key={i}
              style={{
                opacity: interpolate(wordEntrance, [0, 1], [0, 1]),
                display: "inline-block",
                marginRight: 10,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* KASUJĄ with glitch */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 56,
          fontWeight: 900,
        }}
      >
        <GlitchText
          text="KASUJĄ"
          frame={frame}
          fps={fps}
          color={CC_COLORS.red}
          intensity={1.2}
        />
      </div>

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
        rozmowę{" "}
        {words2.map((word, i) => {
          const wordEntrance = spring({
            frame: frame - (i + 5) * 4,
            fps,
            config: { damping: 15, stiffness: 120 },
          });
          return (
            <span
              key={i}
              style={{
                opacity: interpolate(wordEntrance, [0, 1], [0, 1]),
                display: "inline-block",
                marginRight: 10,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// --- Scene: Polluted Context (5-11s) ---
const PollutedScene = ({
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

  const exit = interpolate(frame, [10.5 * fps, 11 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const segments = [
    { label: "Czytanie plików", color: CC_COLORS.cyan, heightPercent: 20 },
    { label: "Eksploracja", color: CC_COLORS.blue, heightPercent: 22 },
    { label: "Dyskusje", color: CC_COLORS.purple, heightPercent: 25 },
    { label: "Porównywanie", color: CC_COLORS.amber, heightPercent: 23 },
  ];

  // "BRAK MIEJSCA" pulsing text
  const pulseOpacity = interpolate(
    Math.sin(sceneFrame * 0.15),
    [-1, 1],
    [0.5, 1]
  );
  const showWarning = sceneFrame > 3 * fps;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
        opacity: opacity * exit,
        padding: 60,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 22,
            fontWeight: 700,
            color: CC_COLORS.mutedText,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Okno kontekstu
        </div>

        <ContextWindowBar
          frame={frame}
          fps={fps}
          segments={segments}
          startDelay={5.5}
          segmentInterval={0.8}
          barWidth={90}
          barHeight={480}
        />
      </div>

      {/* Warning label */}
      {showWarning && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 350,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 24,
              fontWeight: 900,
              color: CC_COLORS.red,
              opacity: pulseOpacity,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            BRAK MIEJSCA
            <br />
            NA REASONING
          </div>
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 16,
              fontWeight: 400,
              color: CC_COLORS.mutedText,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Agent walczy z przeładowanym kontekstem
          </div>
        </div>
      )}
    </div>
  );
};

// --- Scene: Clean Context (11-17s) ---
const CleanScene = ({
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

  const exit = interpolate(frame, [16.5 * fps, 17 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider animation
  const dividerHeight = interpolate(
    sceneFrame,
    [0, 0.5 * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const cleanSegments = [
    { label: "Plan.md", color: CC_COLORS.cyan, heightPercent: 10 },
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
        padding: 40,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 32,
          fontWeight: 900,
          color: CC_COLORS.cyan,
          textTransform: "uppercase",
          letterSpacing: 3,
        }}
      >
        RESET KONTEKSTU
      </div>

      {/* Split view */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          width: "100%",
        }}
      >
        {/* Left: old session (faded, crossed out) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            opacity: 0.35,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 16,
              fontWeight: 600,
              color: CC_COLORS.mutedText,
              textDecoration: "line-through",
            }}
          >
            Sesja planowania
          </div>
          <div
            style={{
              width: 60,
              height: 300,
              borderRadius: 10,
              background: `${CC_COLORS.darkSurface}cc`,
              border: `2px solid ${CC_COLORS.red}30`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Filled bar */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "90%",
                background: `${CC_COLORS.red}20`,
              }}
            />
            {/* X overlay */}
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              viewBox="0 0 60 300"
            >
              <line x1="10" y1="10" x2="50" y2="290" stroke={CC_COLORS.red} strokeWidth="2" opacity="0.5" />
              <line x1="50" y1="10" x2="10" y2="290" stroke={CC_COLORS.red} strokeWidth="2" opacity="0.5" />
            </svg>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 3,
            height: `${dividerHeight}%`,
            maxHeight: 350,
            background: `linear-gradient(180deg, transparent, ${CC_COLORS.cyan}, transparent)`,
            borderRadius: 2,
          }}
        />

        {/* Right: clean session */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 16,
              fontWeight: 600,
              color: CC_COLORS.green,
            }}
          >
            Nowa sesja
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            <ContextWindowBar
              frame={frame}
              fps={fps}
              segments={cleanSegments}
              startDelay={12}
              segmentInterval={0.5}
              barWidth={60}
              barHeight={300}
              showLabels={false}
              borderColor={CC_COLORS.green}
            />

            {/* Reasoning space label */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                justifyContent: "flex-start",
                height: 300,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 14,
                  fontWeight: 600,
                  color: CC_COLORS.green,
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: `${CC_COLORS.green}15`,
                  border: `1px solid ${CC_COLORS.green}30`,
                  boxShadow: `0 0 12px ${CC_COLORS.green}15`,
                }}
              >
                PRZESTRZEŃ
                <br />
                NA REASONING
              </div>
            </div>
          </div>

          {/* 90% counter */}
          <div style={{ marginTop: 8 }}>
            <CounterAnimation
              frame={frame}
              fps={fps}
              from={0}
              to={90}
              startDelay={12.5}
              duration={2}
              color={CC_COLORS.green}
              fontSize={48}
              suffix="%"
              formatNumber={false}
            />
          </div>
        </div>
      </div>
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
          fontSize: 24,
          fontWeight: 600,
          color: CC_COLORS.mutedText,
        }}
      >
        Context reset to technika #4
      </div>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 36,
          fontWeight: 900,
          color: CC_COLORS.text,
        }}
      >
        Poznaj wszystkie 5
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
export const ClaudeCodeContextReset = () => {
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

      {/* NetworkMesh background (clipped) */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <NetworkMesh
          frame={frame}
          color={CC_COLORS.cyan}
          nodeCount={18}
          maxDistance={250}
        />
      </div>

      {/* Scenes */}
      <HookScene frame={frame} fps={fps} />
      <PollutedScene frame={frame} fps={fps} />
      <CleanScene frame={frame} fps={fps} />
      <CTAScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
