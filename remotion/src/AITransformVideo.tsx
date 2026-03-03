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

export const TRANSFORM_DURATION = AO_DURATIONS.transform;

// --- Checkmark icon ---
const Checkmark = ({ color }: { color: string }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <circle cx={12} cy={12} r={10} fill={`${color}20`} stroke={color} strokeWidth={2} />
    <polyline
      points="7 12 10.5 15.5 17 9"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Before/After comparison row ---
const TransformRow = ({
  step,
  before,
  after,
  frame,
  fps,
  enterAt,
}: {
  step: string;
  before: string;
  after: string;
  frame: number;
  fps: number;
  enterAt: number;
}) => {
  const sceneFrame = frame - enterAt;

  const rowEntrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(rowEntrance, [0, 1], [0, 1]);
  const slideY = interpolate(rowEntrance, [0, 1], [24, 0]);

  // After column appears slightly later
  const afterEntrance = spring({
    frame: sceneFrame - 0.6 * fps,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const afterOpacity = interpolate(afterEntrance, [0, 1], [0, 1]);
  const afterScale = interpolate(afterEntrance, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slideY}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* Step label */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 13,
          fontWeight: 700,
          color: AO_COLORS.mutedText,
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        {step}
      </div>

      {/* Before/After panels */}
      <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
        {/* Before */}
        <div
          style={{
            flex: 1,
            padding: "14px 16px",
            borderRadius: 12,
            background: `${AO_COLORS.red}10`,
            border: `1px solid ${AO_COLORS.red}30`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 16,
              fontWeight: 600,
              color: `${AO_COLORS.text}cc`,
              lineHeight: 1.3,
            }}
          >
            {before}
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: AO_COLORS.mutedText,
            fontSize: 20,
          }}
        >
          →
        </div>

        {/* After */}
        <div
          style={{
            flex: 1,
            padding: "14px 16px",
            borderRadius: 12,
            background: `${AO_COLORS.green}10`,
            border: `1px solid ${AO_COLORS.green}40`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: afterOpacity,
            transform: `scale(${afterScale})`,
            boxShadow: `0 0 16px ${AO_COLORS.greenGlow}`,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <Checkmark color={AO_COLORS.green} />
          </div>
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 16,
              fontWeight: 600,
              color: AO_COLORS.green,
              lineHeight: 1.3,
            }}
          >
            {after}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Scene: Hook (0-4s) ---
const HookScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 70 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [40, 0]);

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
        gap: 20,
        opacity: opacity * exit,
        transform: `translateY(${slideY}px)`,
        padding: 60,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 42,
          fontWeight: 900,
          color: AO_COLORS.text,
          textAlign: "center",
          lineHeight: 1.25,
        }}
      >
        Jak AI zmienia
        <br />
        każdy etap tworzenia oferty?
      </div>
      <div
        style={{
          padding: "10px 24px",
          borderRadius: 30,
          background: `${AO_COLORS.gold}18`,
          border: `1px solid ${AO_COLORS.gold}50`,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: 18,
            fontWeight: 600,
            color: AO_COLORS.gold,
          }}
        >
          PRZED → PO AI
        </span>
      </div>
    </div>
  );
};

// --- Scene: Steps (4-20s) ---
const StepsScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 4 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [19.5 * fps, 20 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const steps = [
    {
      step: "Krok 1 – Spotkanie/Brief",
      before: "Ręczna transkrypcja notatek",
      after: "Auto-transkrypcja → brief w 2 minuty",
      delay: 0,
    },
    {
      step: "Krok 2 – Analiza",
      before: "Przeszukiwanie dziesiątek folderów",
      after: "AI przeszukuje bazę wiedzy w sekundy",
      delay: 3.5 * fps,
    },
    {
      step: "Krok 3 – Kosztorys",
      before: "Manualne kosztorysowanie od zera",
      after: "Asystent AI generuje wkład z historii",
      delay: 7.0 * fps,
    },
  ];

  // Column headers
  const headersEntrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const headersOpacity = interpolate(headersEntrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 14,
        opacity: opacity * exit,
        padding: "40px 50px",
      }}
    >
      {/* Column headers */}
      <div
        style={{
          display: "flex",
          gap: 12,
          opacity: headersOpacity,
          marginBottom: 4,
          paddingLeft: 0,
        }}
      >
        <div style={{ flex: 1 }} />
        <div style={{ width: 24, flexShrink: 0 }} />
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: FONTS.heading,
            fontSize: 14,
            fontWeight: 700,
            color: AO_COLORS.red,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          PRZED
        </div>
        <div style={{ width: 28, flexShrink: 0 }} />
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: FONTS.heading,
            fontSize: 14,
            fontWeight: 700,
            color: AO_COLORS.green,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          PO AI ✓
        </div>
      </div>

      {/* Steps */}
      {steps.map((step, i) => (
        <TransformRow
          key={i}
          step={step.step}
          before={step.before}
          after={step.after}
          frame={sceneFrame}
          fps={fps}
          enterAt={step.delay}
        />
      ))}
    </div>
  );
};

// --- Scene: Result (20-25s) ---
const ResultScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 20 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.85, 1]);

  // Result badge
  const badgeEntrance = spring({
    frame: sceneFrame - 0.5 * fps,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.7 },
  });
  const badgeScale = interpolate(badgeEntrance, [0, 1], [0.5, 1]);
  const badgeOpacity = interpolate(badgeEntrance, [0, 1], [0, 1]);

  // URL
  const urlEntrance = spring({
    frame: sceneFrame - 1.2 * fps,
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
        transform: `scale(${scale})`,
        padding: 60,
      }}
    >
      {/* Result badge */}
      <div
        style={{
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          padding: "24px 48px",
          borderRadius: 20,
          background: `${AO_COLORS.green}15`,
          border: `2px solid ${AO_COLORS.green}`,
          boxShadow: `0 0 40px ${AO_COLORS.greenGlow}`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 64,
            fontWeight: 900,
            color: AO_COLORS.green,
            lineHeight: 1,
          }}
        >
          50%
        </div>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 22,
            fontWeight: 700,
            color: AO_COLORS.text,
            marginTop: 8,
          }}
        >
          szybsze oferty
        </div>
      </div>

      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 22,
          fontWeight: 400,
          color: AO_COLORS.mutedText,
          textAlign: "center",
        }}
      >
        Bez zwiększania zespołu
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
export const AITransformVideo = () => {
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

      {/* Green ambient glow (right side - "after AI") */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: "40%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AO_COLORS.greenGlow} 0%, transparent 70%)`,
          opacity: 0.5,
        }}
      />

      {/* Red ambient glow (left side - "before") */}
      <div
        style={{
          position: "absolute",
          left: -100,
          top: "40%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AO_COLORS.redGlow} 0%, transparent 70%)`,
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
      <HookScene frame={frame} fps={fps} />
      <StepsScene frame={frame} fps={fps} />
      <ResultScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
