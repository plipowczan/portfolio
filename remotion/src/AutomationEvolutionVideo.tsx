import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { FONTS } from "./constants";
import { AO_COLORS, AO_DURATIONS } from "./agency-offer-constants";
import { Particle } from "./components/Particle";
import { ScanlineOverlay } from "./components/ScanlineOverlay";

loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

export const AUTOMATION_EVOLUTION_DURATION = AO_DURATIONS.automationEvolution;

// --- Tool logo badge ---
const ToolBadge = ({
  name,
  color,
  frame,
  fps,
  delay,
}: {
  name: string;
  color: string;
  frame: number;
  fps: number;
  delay: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 90, mass: 0.8 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.6, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        padding: "12px 24px",
        borderRadius: 12,
        background: `${color}18`,
        border: `1px solid ${color}50`,
        fontFamily: FONTS.heading,
        fontSize: 20,
        fontWeight: 700,
        color,
        textAlign: "center",
        minWidth: 110,
      }}
    >
      {name}
    </div>
  );
};

// --- Scene 1: Timeline 2019-2024 (0-7s) ---
const TimelineScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 70 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [40, 0]);

  const exit = interpolate(frame, [6.5 * fps, 7 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tools = [
    { name: "Zapier", color: AO_COLORS.gold, delay: 0.4 * fps },
    { name: "Make", color: AO_COLORS.blue, delay: 1.0 * fps },
    { name: "n8n", color: AO_COLORS.green, delay: 1.6 * fps },
  ];

  const questionEntrance = spring({
    frame: frame - 2.2 * fps,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const questionOpacity = interpolate(questionEntrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        opacity: opacity * exit,
        transform: `translateY(${slideY}px)`,
        padding: 60,
      }}
    >
      {/* Era label */}
      <div
        style={{
          padding: "8px 28px",
          borderRadius: 30,
          background: `${AO_COLORS.mutedText}15`,
          border: `1px solid ${AO_COLORS.mutedText}30`,
          fontFamily: FONTS.heading,
          fontSize: 22,
          fontWeight: 700,
          color: AO_COLORS.mutedText,
          letterSpacing: 2,
        }}
      >
        2019 – 2024
      </div>

      {/* Tool badges */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {tools.map((tool) => (
          <ToolBadge
            key={tool.name}
            name={tool.name}
            color={tool.color}
            frame={frame}
            fps={fps}
            delay={tool.delay}
          />
        ))}
      </div>

      {/* Question */}
      <div
        style={{
          opacity: questionOpacity,
          fontFamily: FONTS.heading,
          fontSize: 26,
          fontWeight: 700,
          color: AO_COLORS.text,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        The Question:{" "}
        <span style={{ color: AO_COLORS.gold }}>"Which platform?"</span>
      </div>
    </div>
  );
};

// --- Scene 2: 2026 reveal – Code + AI (7-15s) ---
const RevealScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 7 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 11, stiffness: 75 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [30, 0]);

  const exit = interpolate(frame, [14.5 * fps, 15 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const yearEntrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 10, stiffness: 80, mass: 0.7 },
  });
  const yearScale = interpolate(yearEntrance, [0, 1], [0.7, 1]);
  const yearOpacity = interpolate(yearEntrance, [0, 1], [0, 1]);

  const codeEntrance = spring({
    frame: sceneFrame - 0.8 * fps,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.6 },
  });
  const codeScale = interpolate(codeEntrance, [0, 1], [0.5, 1]);
  const codeOpacity = interpolate(codeEntrance, [0, 1], [0, 1]);

  const subtitleEntrance = spring({
    frame: sceneFrame - 1.8 * fps,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const subtitleOpacity = interpolate(subtitleEntrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        opacity: opacity * exit,
        transform: `translateY(${slideY}px)`,
        padding: 60,
      }}
    >
      {/* 2026 year badge */}
      <div
        style={{
          opacity: yearOpacity,
          transform: `scale(${yearScale})`,
          padding: "10px 36px",
          borderRadius: 30,
          background: `${AO_COLORS.green}20`,
          border: `2px solid ${AO_COLORS.green}`,
          boxShadow: `0 0 32px ${AO_COLORS.greenGlow}`,
          fontFamily: FONTS.heading,
          fontSize: 26,
          fontWeight: 900,
          color: AO_COLORS.green,
          letterSpacing: 3,
        }}
      >
        2026
      </div>

      {/* 4th option reveal */}
      <div
        style={{
          opacity: codeOpacity,
          transform: `scale(${codeScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "28px 48px",
          borderRadius: 20,
          background: `${AO_COLORS.green}12`,
          border: `2px solid ${AO_COLORS.green}60`,
          boxShadow: `0 0 48px ${AO_COLORS.greenGlow}`,
        }}
      >
        <div style={{ fontSize: 52, lineHeight: 1 }}>✨</div>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 32,
            fontWeight: 900,
            color: AO_COLORS.green,
          }}
        >
          Kod + AI Agent
        </div>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 16,
            fontWeight: 600,
            color: AO_COLORS.mutedText,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          4. opcja, której brakowało
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          fontFamily: FONTS.heading,
          fontSize: 20,
          fontWeight: 400,
          color: AO_COLORS.mutedText,
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 560,
        }}
      >
        Claude Code, Cursor i GitHub Copilot zrobiły z pisania kodu to,
        co Zapier zrobił z integracjami
      </div>
    </div>
  );
};

// --- Scene 3: Split screen comparison (15-23s) ---
const CompareScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 15 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 13, stiffness: 85 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [22.5 * fps, 23 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Left panel (Zapier – dims)
  const leftEntrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const leftOpacity = interpolate(leftEntrance, [0, 1], [0, 1]);

  // Right panel (Kod – glows)
  const rightEntrance = spring({
    frame: sceneFrame - 0.6 * fps,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const rightOpacity = interpolate(rightEntrance, [0, 1], [0, 1]);
  const rightScale = interpolate(rightEntrance, [0, 1], [0.9, 1]);

  const leftItems = ["$300/mies.", "limity kroków", "vendor lock-in", "mniej kontroli"];
  const rightItems = ["$15/mies.", "zero limitów", "pełna kontrola", "dowolne API"];

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
        padding: "40px 50px",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 22,
          fontWeight: 700,
          color: AO_COLORS.mutedText,
          textAlign: "center",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        Kalkulacja się zmienia
      </div>

      {/* Side by side */}
      <div style={{ display: "flex", gap: 20, width: "100%", maxWidth: 700 }}>
        {/* Left: Zapier */}
        <div
          style={{
            flex: 1,
            opacity: leftOpacity,
            padding: "24px 20px",
            borderRadius: 16,
            background: `${AO_COLORS.red}08`,
            border: `1px solid ${AO_COLORS.red}25`,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 20,
              fontWeight: 800,
              color: AO_COLORS.gold,
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            Zapier
          </div>
          {leftItems.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONTS.heading,
                fontSize: 16,
                fontWeight: 500,
                color: `${AO_COLORS.text}80`,
              }}
            >
              <span style={{ color: AO_COLORS.red }}>✗</span>
              {item}
            </div>
          ))}
        </div>

        {/* Right: Code */}
        <div
          style={{
            flex: 1,
            opacity: rightOpacity,
            transform: `scale(${rightScale})`,
            padding: "24px 20px",
            borderRadius: 16,
            background: `${AO_COLORS.green}12`,
            border: `2px solid ${AO_COLORS.green}70`,
            boxShadow: `0 0 32px ${AO_COLORS.greenGlow}`,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 20,
              fontWeight: 800,
              color: AO_COLORS.green,
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            Kod + AI
          </div>
          {rightItems.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONTS.heading,
                fontSize: 16,
                fontWeight: 600,
                color: AO_COLORS.green,
              }}
            >
              <span>✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Scene 4: CTA (23-30s) ---
const CTAScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 23 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [30, 0]);

  const urlEntrance = spring({
    frame: sceneFrame - 1 * fps,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const urlOpacity = interpolate(urlEntrance, [0, 1], [0, 1]);

  const underlineWidth = interpolate(
    sceneFrame,
    [1.5 * fps, 2.5 * fps],
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
        padding: 60,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 30,
          fontWeight: 900,
          color: AO_COLORS.text,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        Nowy framework decyzyjny
        <br />
        <span style={{ color: AO_COLORS.green }}>4 opcje, nie 3</span>
      </div>

      <div
        style={{
          opacity: urlOpacity,
          position: "relative",
          marginTop: 8,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 22,
            fontWeight: 600,
            color: AO_COLORS.gold,
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
            background: `linear-gradient(90deg, ${AO_COLORS.gold}, ${AO_COLORS.green})`,
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
};

// --- Main Composition ---
export const AutomationEvolutionVideo = () => {
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
        backgroundColor: AO_COLORS.background,
        opacity: fadeOut,
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${AO_COLORS.mutedText}08 1px, transparent 1px),
            linear-gradient(90deg, ${AO_COLORS.mutedText}08 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Green ambient glow */}
      <div
        style={{
          position: "absolute",
          right: -80,
          bottom: "30%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AO_COLORS.greenGlow} 0%, transparent 70%)`,
          opacity: 0.4,
        }}
      />

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <Particle
            key={i}
            index={i}
            frame={frame}
            color1={`${AO_COLORS.green}25`}
            color2={`${AO_COLORS.gold}20`}
          />
        ))}
      </div>

      <ScanlineOverlay opacity={0.04} />

      {/* Scenes */}
      <TimelineScene frame={frame} fps={fps} />
      <RevealScene frame={frame} fps={fps} />
      <CompareScene frame={frame} fps={fps} />
      <CTAScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
