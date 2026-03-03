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

export const MICRO_TOOL_DURATION = AO_DURATIONS.microTool;

// --- Build time bar ---
const BuildTimeBar = ({
  label,
  sublabel,
  widthRatio,
  color,
  glowColor,
  frame,
  fps,
  delay,
}: {
  label: string;
  sublabel: string;
  widthRatio: number;
  color: string;
  glowColor: string;
  frame: number;
  fps: number;
  delay: number;
}) => {
  const sceneFrame = frame - delay;

  const rowEntrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const opacity = interpolate(rowEntrance, [0, 1], [0, 1]);
  const slideX = interpolate(rowEntrance, [0, 1], [-30, 0]);

  const barProgress = interpolate(
    sceneFrame,
    [0.2 * fps, 1.2 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const maxBarWidth = 320;
  const barWidth = widthRatio * maxBarWidth * barProgress;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${slideX}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Label */}
      <div style={{ width: 200, flexShrink: 0 }}>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 17,
            fontWeight: 700,
            color: AO_COLORS.text,
            lineHeight: 1.2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 13,
            fontWeight: 400,
            color: AO_COLORS.mutedText,
          }}
        >
          {sublabel}
        </div>
      </div>

      {/* Bar track */}
      <div
        style={{
          position: "relative",
          width: maxBarWidth,
          height: 28,
          borderRadius: 8,
          background: `${AO_COLORS.mutedText}15`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: barWidth,
            borderRadius: 8,
            background: `linear-gradient(90deg, ${color}, ${glowColor})`,
            boxShadow: `0 0 12px ${glowColor}`,
          }}
        />
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 17,
          fontWeight: 800,
          color,
          width: 80,
          flexShrink: 0,
        }}
      >
        {label.includes("2022") ? "2–4 tyg." : "1–2 dni"}
      </div>
    </div>
  );
};

// --- Module block in pipeline ---
const PipelineModule = ({
  emoji,
  label,
  frame,
  fps,
  delay,
}: {
  emoji: string;
  label: string;
  frame: number;
  fps: number;
  delay: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.7 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.5, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderRadius: 12,
          background: `${AO_COLORS.green}12`,
          border: `1px solid ${AO_COLORS.green}35`,
          fontSize: 28,
          lineHeight: 1,
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 12,
          fontWeight: 600,
          color: AO_COLORS.mutedText,
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: 80,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// --- Small arrow ---
const SmallArrow = ({
  frame,
  fps,
  delay,
}: {
  frame: number;
  fps: number;
  delay: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        color: `${AO_COLORS.green}70`,
        fontSize: 20,
        flexShrink: 0,
        alignSelf: "flex-start",
        marginTop: 18,
      }}
    >
      →
    </div>
  );
};

// --- Scene 1: Build time comparison (0-8s) ---
const BuildTimeScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 70 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [40, 0]);

  const exit = interpolate(frame, [7.5 * fps, 8 * fps], [1, 0], {
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
        gap: 28,
        opacity: opacity * exit,
        transform: `translateY(${slideY}px)`,
        padding: "40px 60px",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 28,
          fontWeight: 900,
          color: AO_COLORS.text,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        "Własny kod jest za wolny."
        <br />
        <span style={{ fontSize: 20, fontWeight: 400, color: AO_COLORS.mutedText }}>
          To był prawdziwy argument. Do 2026.
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          width: "100%",
          maxWidth: 640,
        }}
      >
        <BuildTimeBar
          label="Kod 2022"
          sublabel="bez AI agenta"
          widthRatio={1}
          color={AO_COLORS.red}
          glowColor={AO_COLORS.redGlow}
          frame={frame}
          fps={fps}
          delay={0.5 * fps}
        />
        <BuildTimeBar
          label="Kod 2026 + AI"
          sublabel="z Claude Code"
          widthRatio={0.15}
          color={AO_COLORS.green}
          glowColor={AO_COLORS.greenGlow}
          frame={frame}
          fps={fps}
          delay={1.5 * fps}
        />
      </div>
    </div>
  );
};

// --- Scene 2: Pipeline animation (8-18s) ---
const PipelineScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 8 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [17.5 * fps, 18 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const modules = [
    { emoji: "🔗", label: "Webhook\n3 źródła", delay: 0 },
    { emoji: "🔄", label: "Dedu-\nplikacja", delay: 0.7 * fps },
    { emoji: "📡", label: "API\nEnrichment", delay: 1.4 * fps },
    { emoji: "💾", label: "CRM\nWrite", delay: 2.1 * fps },
    { emoji: "💬", label: "Slack\nNotify", delay: 2.8 * fps },
  ];

  const labelEntrance = spring({
    frame: sceneFrame - 3.8 * fps,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const labelOpacity = interpolate(labelEntrance, [0, 1], [0, 1]);

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
        padding: "40px 50px",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 22,
          fontWeight: 700,
          color: AO_COLORS.text,
          textAlign: "center",
        }}
      >
        Micro-tool jako klocki Lego
      </div>

      {/* Pipeline */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {modules.map((mod, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <PipelineModule
              emoji={mod.emoji}
              label={mod.label}
              frame={sceneFrame}
              fps={fps}
              delay={mod.delay}
            />
            {i < modules.length - 1 && (
              <SmallArrow
                frame={sceneFrame}
                fps={fps}
                delay={mod.delay + 0.4 * fps}
              />
            )}
          </div>
        ))}
      </div>

      {/* Bottom label */}
      <div
        style={{
          opacity: labelOpacity,
          padding: "12px 28px",
          borderRadius: 30,
          background: `${AO_COLORS.green}12`,
          border: `1px solid ${AO_COLORS.green}40`,
          fontFamily: FONTS.heading,
          fontSize: 16,
          fontWeight: 600,
          color: AO_COLORS.green,
          textAlign: "center",
        }}
      >
        Zbudowane z Claude Code w 1-2 dni · $15/mies. hosting
      </div>
    </div>
  );
};

// --- Scene 3: Cost comparison (18-25s) ---
const CostScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 18 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [24.5 * fps, 25 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const makeEntrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 13, stiffness: 90 },
  });
  const makeOpacity = interpolate(makeEntrance, [0, 1], [0, 1]);
  const makeScale = interpolate(makeEntrance, [0, 1], [0.7, 1]);

  const codeEntrance = spring({
    frame: sceneFrame - 0.8 * fps,
    fps,
    config: { damping: 11, stiffness: 100, mass: 0.7 },
  });
  const codeOpacity = interpolate(codeEntrance, [0, 1], [0, 1]);
  const codeScale = interpolate(codeEntrance, [0, 1], [0.5, 1]);

  const savingsEntrance = spring({
    frame: sceneFrame - 2 * fps,
    fps,
    config: { damping: 12, stiffness: 90 },
  });
  const savingsOpacity = interpolate(savingsEntrance, [0, 1], [0, 1]);

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
        padding: "40px 60px",
      }}
    >
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
        Porównanie kosztów
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {/* Make */}
        <div
          style={{
            opacity: makeOpacity,
            transform: `scale(${makeScale})`,
            padding: "24px 32px",
            borderRadius: 16,
            background: `${AO_COLORS.red}08`,
            border: `1px solid ${AO_COLORS.red}30`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 16,
              fontWeight: 600,
              color: AO_COLORS.mutedText,
            }}
          >
            Make
          </div>
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 48,
              fontWeight: 900,
              color: `${AO_COLORS.text}80`,
              lineHeight: 1,
            }}
          >
            $150-200
          </div>
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 14,
              fontWeight: 400,
              color: AO_COLORS.mutedText,
            }}
          >
            miesięcznie
          </div>
        </div>

        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 28,
            color: AO_COLORS.mutedText,
          }}
        >
          vs
        </div>

        {/* Code */}
        <div
          style={{
            opacity: codeOpacity,
            transform: `scale(${codeScale})`,
            padding: "24px 32px",
            borderRadius: 16,
            background: `${AO_COLORS.green}12`,
            border: `2px solid ${AO_COLORS.green}`,
            boxShadow: `0 0 40px ${AO_COLORS.greenGlow}`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 16,
              fontWeight: 600,
              color: AO_COLORS.green,
            }}
          >
            Kod + AI
          </div>
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 48,
              fontWeight: 900,
              color: AO_COLORS.green,
              lineHeight: 1,
            }}
          >
            $15
          </div>
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 14,
              fontWeight: 400,
              color: AO_COLORS.mutedText,
            }}
          >
            miesięcznie
          </div>
        </div>
      </div>

      {/* Savings badge */}
      <div
        style={{
          opacity: savingsOpacity,
          padding: "14px 32px",
          borderRadius: 30,
          background: `${AO_COLORS.green}18`,
          border: `1px solid ${AO_COLORS.green}50`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: 18,
            fontWeight: 700,
            color: AO_COLORS.green,
          }}
        >
          savings: $135+/mies. → $1,620/rok
        </span>
      </div>
    </div>
  );
};

// --- Scene 4: CTA (25-30s) ---
const CTAScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 25 * fps;
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
          fontSize: 28,
          fontWeight: 900,
          color: AO_COLORS.text,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        Pełna kalkulacja TCO
        <br />
        <span style={{ color: AO_COLORS.green }}>4 opcje, kiedy kod się opłaca</span>
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
export const MicroToolVideo = () => {
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

      {/* Green ambient glow (center) */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AO_COLORS.greenGlow} 0%, transparent 70%)`,
          opacity: 0.35,
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
            color2={`${AO_COLORS.gold}15`}
          />
        ))}
      </div>

      <ScanlineOverlay opacity={0.04} />

      {/* Scenes */}
      <BuildTimeScene frame={frame} fps={fps} />
      <PipelineScene frame={frame} fps={fps} />
      <CostScene frame={frame} fps={fps} />
      <CTAScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
