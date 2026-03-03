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

export const FOUR_WAY_DECISION_DURATION = AO_DURATIONS.fourWayDecision;

// --- Profile card ---
const ProfileCard = ({
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
    config: { damping: 12, stiffness: 90, mass: 0.8 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.6, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        padding: "16px 20px",
        borderRadius: 14,
        background: `${AO_COLORS.mutedText}12`,
        border: `1px solid ${AO_COLORS.mutedText}25`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        minWidth: 130,
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 36 }}>{emoji}</span>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 15,
          fontWeight: 600,
          color: AO_COLORS.text,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// --- Decision option card ---
const OptionCard = ({
  tool,
  color,
  criteria,
  star,
  frame,
  fps,
  delay,
}: {
  tool: string;
  color: string;
  criteria: string[];
  star?: boolean;
  frame: number;
  fps: number;
  delay: number;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 85, mass: 0.9 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.7, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        flex: 1,
        padding: "18px 16px",
        borderRadius: 14,
        background: star ? `${color}15` : `${AO_COLORS.darkSurface}cc`,
        border: star ? `2px solid ${color}` : `1px solid ${color}30`,
        boxShadow: star ? `0 0 28px ${color}40` : "none",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
      }}
    >
      {star && (
        <div
          style={{
            position: "absolute",
            top: -12,
            right: 12,
            padding: "3px 10px",
            borderRadius: 20,
            background: color,
            fontFamily: FONTS.heading,
            fontSize: 11,
            fontWeight: 700,
            color: "#0a0e1a",
            letterSpacing: 1,
          }}
        >
          2026 ★
        </div>
      )}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 20,
          fontWeight: 800,
          color,
          marginBottom: 4,
        }}
      >
        {tool}
      </div>
      {criteria.map((c) => (
        <div
          key={c}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 6,
            fontFamily: FONTS.heading,
            fontSize: 13,
            fontWeight: 500,
            color: star ? color : AO_COLORS.mutedText,
            lineHeight: 1.3,
          }}
        >
          <span style={{ marginTop: 1, flexShrink: 0 }}>•</span>
          {c}
        </div>
      ))}
    </div>
  );
};

// --- Scene 1: Profiles (0-6s) ---
const ProfilesScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 70 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [40, 0]);

  const exit = interpolate(frame, [5.5 * fps, 6 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const profiles = [
    { emoji: "📣", label: "Non-tech\nMarketig / Ops", delay: 0.3 * fps },
    { emoji: "⚡", label: "Power\nUser", delay: 0.8 * fps },
    { emoji: "🔧", label: "DevOps\nDeveloper", delay: 1.3 * fps },
    { emoji: "🤖", label: "Developer\n+ AI Agent", delay: 1.8 * fps },
  ];

  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);

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
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: FONTS.heading,
          fontSize: 34,
          fontWeight: 900,
          color: AO_COLORS.text,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Który profil opisuje
        <br />
        <span style={{ color: AO_COLORS.gold }}>Twój zespół?</span>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        {profiles.map((p) => (
          <ProfileCard
            key={p.label}
            emoji={p.emoji}
            label={p.label}
            frame={frame}
            fps={fps}
            delay={p.delay}
          />
        ))}
      </div>
    </div>
  );
};

// --- Scene 2: Decision tree questions (6-28s) ---
const DecisionScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 6 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [27.5 * fps, 28 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const questions = [
    {
      q: "Kompetencje?",
      answers: ["Non-technical → Zapier", "Power User → Make"],
      delay: 0,
    },
    {
      q: "Skala operacji?",
      answers: ["< 5K → Zapier", "5–50K → Make", "> 50K → n8n"],
      delay: 3.5 * fps,
    },
    {
      q: "Compliance?",
      answers: ["HIPAA/GDPR on-prem → n8n", "Standard → Zapier/Make"],
      delay: 8 * fps,
    },
    {
      q: "Masz developera + AI?",
      answers: ["Tak → Kod + AI ✨", "Nie → wróć wyżej"],
      delay: 13 * fps,
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 16,
        opacity: opacity * exit,
        padding: "40px 50px",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 20,
          fontWeight: 700,
          color: AO_COLORS.mutedText,
          textAlign: "center",
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Framework decyzyjny
      </div>

      {questions.map((item, i) => {
        const qEntrance = spring({
          frame: sceneFrame - item.delay,
          fps,
          config: { damping: 13, stiffness: 90 },
        });
        const qOpacity = interpolate(qEntrance, [0, 1], [0, 1]);
        const qSlide = interpolate(qEntrance, [0, 1], [20, 0]);
        const isAI = item.q.includes("AI");

        return (
          <div
            key={i}
            style={{
              opacity: qOpacity,
              transform: `translateX(${qSlide}px)`,
              padding: "14px 20px",
              borderRadius: 12,
              background: isAI ? `${AO_COLORS.green}12` : `${AO_COLORS.darkSurface}cc`,
              border: isAI ? `1px solid ${AO_COLORS.green}40` : `1px solid ${AO_COLORS.mutedText}20`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 15,
                fontWeight: 700,
                color: isAI ? AO_COLORS.green : AO_COLORS.text,
                minWidth: 180,
                flexShrink: 0,
              }}
            >
              {item.q}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {item.answers.map((a) => (
                <div
                  key={a}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: isAI
                      ? `${AO_COLORS.green}20`
                      : `${AO_COLORS.mutedText}15`,
                    fontFamily: FONTS.heading,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isAI ? AO_COLORS.green : AO_COLORS.mutedText,
                  }}
                >
                  {a}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Scene 3: 4 options side-by-side (28-35s) ---
const OptionsScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 28 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 13, stiffness: 85 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [34.5 * fps, 35 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const options = [
    {
      tool: "Zapier",
      color: AO_COLORS.gold,
      criteria: ["Non-technical", "< 5K zadań", "Szybki start"],
      delay: 0,
    },
    {
      tool: "Make",
      color: AO_COLORS.blue,
      criteria: ["Power users", "5–50K zadań", "Best value"],
      delay: 0.5 * fps,
    },
    {
      tool: "n8n",
      color: AO_COLORS.mutedText,
      criteria: ["DevOps", "> 50K zadań", "Compliance"],
      delay: 1.0 * fps,
    },
    {
      tool: "Kod + AI",
      color: AO_COLORS.green,
      criteria: ["Developer + AI", "Zero limitów", "Zero lock-in"],
      star: true,
      delay: 1.5 * fps,
    },
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
        gap: 20,
        opacity: opacity * exit,
        padding: "40px 40px",
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
        Wybierz właściwe narzędzie
      </div>

      <div style={{ display: "flex", gap: 14, width: "100%" }}>
        {options.map((opt) => (
          <OptionCard
            key={opt.tool}
            tool={opt.tool}
            color={opt.color}
            criteria={opt.criteria}
            star={opt.star}
            frame={sceneFrame}
            fps={fps}
            delay={opt.delay}
          />
        ))}
      </div>
    </div>
  );
};

// --- Scene 4: CTA (35-40s) ---
const CTAScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 35 * fps;
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
        Pełny przewodnik{" "}
        <span style={{ color: AO_COLORS.green }}>→</span>
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
export const FourWayDecisionVideo = () => {
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

      {/* Gold ambient glow (left) */}
      <div
        style={{
          position: "absolute",
          left: -100,
          top: "30%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AO_COLORS.goldGlow} 0%, transparent 70%)`,
          opacity: 0.3,
        }}
      />

      {/* Green ambient glow (right) */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: "50%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AO_COLORS.greenGlow} 0%, transparent 70%)`,
          opacity: 0.3,
        }}
      />

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <Particle
            key={i}
            index={i}
            frame={frame}
            color1={`${AO_COLORS.gold}25`}
            color2={`${AO_COLORS.green}20`}
          />
        ))}
      </div>

      <ScanlineOverlay opacity={0.04} />

      {/* Scenes */}
      <ProfilesScene frame={frame} fps={fps} />
      <DecisionScene frame={frame} fps={fps} />
      <OptionsScene frame={frame} fps={fps} />
      <CTAScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
