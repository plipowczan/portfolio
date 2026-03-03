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

export const PROCESS_DURATION = AO_DURATIONS.process;

// --- Arrow between process steps ---
const Arrow = ({
  frame,
  fps,
  delay,
  vertical = false,
}: {
  frame: number;
  fps: number;
  delay: number;
  vertical?: boolean;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.3, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        color: AO_COLORS.mutedText,
        fontSize: vertical ? 32 : 28,
        lineHeight: 1,
        textAlign: "center",
        flexShrink: 0,
      }}
    >
      {vertical ? "↓" : "→"}
    </div>
  );
};

// --- Single process step box ---
const ProcessStep = ({
  emoji,
  label,
  sublabel,
  frame,
  fps,
  delay,
  highlight = false,
}: {
  emoji: string;
  label: string;
  sublabel?: string;
  frame: number;
  fps: number;
  delay: number;
  highlight?: boolean;
}) => {
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.7, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        padding: "20px 24px",
        borderRadius: 16,
        background: highlight ? `${AO_COLORS.gold}18` : `${AO_COLORS.darkSurface}cc`,
        border: highlight
          ? `2px solid ${AO_COLORS.gold}`
          : `1px solid ${AO_COLORS.mutedText}20`,
        backdropFilter: "blur(8px)",
        boxShadow: highlight ? `0 0 24px ${AO_COLORS.goldGlow}` : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        minWidth: 160,
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 32 }}>{emoji}</span>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 18,
          fontWeight: 700,
          color: highlight ? AO_COLORS.gold : AO_COLORS.text,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
      {sublabel && (
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 13,
            fontWeight: 400,
            color: AO_COLORS.mutedText,
            lineHeight: 1.3,
          }}
        >
          {sublabel}
        </div>
      )}
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
          fontSize: 44,
          fontWeight: 900,
          color: AO_COLORS.text,
          textAlign: "center",
          lineHeight: 1.25,
        }}
      >
        Ile kroków dzieli Cię
        <br />
        od gotowej oferty?
      </div>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 20,
          fontWeight: 400,
          color: AO_COLORS.mutedText,
          textAlign: "center",
        }}
      >
        Typowy proces w agencji lub firmie usługowej
      </div>
    </div>
  );
};

// --- Scene: Flow Diagram (4-14s) ---
const FlowScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 4 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [13.5 * fps, 14 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Step timing delays (in frames, relative to sceneFrame)
  const step1Delay = 0;
  const arrow1Delay = 0.7 * fps;
  const step2Delay = 1.4 * fps;
  const arrow2Delay = 2.0 * fps;
  const step3Delay = 2.6 * fps;
  const arrow3Delay = 3.4 * fps;
  const step4Delay = 4.0 * fps;
  const arrow4Delay = 4.8 * fps;
  const step5Delay = 5.4 * fps;

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
        padding: 50,
      }}
    >
      {/* Row 1: Spotkanie → Brief */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          justifyContent: "center",
        }}
      >
        <ProcessStep
          emoji="📞"
          label="Spotkanie"
          sublabel="lub brief"
          frame={sceneFrame}
          fps={fps}
          delay={step1Delay}
        />
        <Arrow frame={sceneFrame} fps={fps} delay={arrow1Delay} />
        <ProcessStep
          emoji="📋"
          label="Brief"
          sublabel="z notatek"
          frame={sceneFrame}
          fps={fps}
          delay={step2Delay}
        />
      </div>

      {/* Vertical arrow */}
      <Arrow frame={sceneFrame} fps={fps} delay={arrow2Delay} vertical />

      {/* Row 2: Analiza */}
      <ProcessStep
        emoji="🔍"
        label="Analiza"
        sublabel="wyceny + baza wiedzy"
        frame={sceneFrame}
        fps={fps}
        delay={step3Delay}
      />

      {/* Vertical arrow */}
      <Arrow frame={sceneFrame} fps={fps} delay={arrow3Delay} vertical />

      {/* Row 3: Wkład → Oferta końcowa */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          justifyContent: "center",
        }}
      >
        <ProcessStep
          emoji="📝"
          label="Wkład"
          sublabel="do oferty"
          frame={sceneFrame}
          fps={fps}
          delay={step4Delay}
        />
        <Arrow frame={sceneFrame} fps={fps} delay={arrow4Delay} />
        <ProcessStep
          emoji="📄"
          label="Oferta końcowa"
          frame={sceneFrame}
          fps={fps}
          delay={step5Delay}
          highlight
        />
      </div>
    </div>
  );
};

// --- Scene: CTA (14-20s) ---
const CTAScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 14 * fps;
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

  // Question entrance
  const questionEntrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const questionOpacity = interpolate(questionEntrance, [0, 1], [0, 1]);

  // URL entrance – delayed
  const urlEntrance = spring({
    frame: sceneFrame - 1 * fps,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const urlOpacity = interpolate(urlEntrance, [0, 1], [0, 1]);
  const urlSlide = interpolate(urlEntrance, [0, 1], [20, 0]);

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
        opacity,
        transform: `translateY(${slideY}px)`,
        padding: 60,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 36,
          fontWeight: 900,
          color: AO_COLORS.text,
          textAlign: "center",
          lineHeight: 1.35,
          opacity: questionOpacity,
        }}
      >
        A co gdyby AI zajął się
        <br />
        <span style={{ color: AO_COLORS.gold }}>połową z tego?</span>
      </div>

      <div
        style={{
          opacity: urlOpacity,
          transform: `translateY(${urlSlide}px)`,
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 22,
            fontWeight: 600,
            color: AO_COLORS.green,
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
            background: `linear-gradient(90deg, ${AO_COLORS.green}, ${AO_COLORS.gold})`,
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
};

// --- Main Composition ---
export const AgencyProcessVideo = () => {
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

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <Particle
            key={i}
            index={i}
            frame={frame}
            color1={`${AO_COLORS.gold}30`}
            color2={`${AO_COLORS.green}30`}
          />
        ))}
      </div>

      <ScanlineOverlay opacity={0.04} />

      {/* Scenes */}
      <HookScene frame={frame} fps={fps} />
      <FlowScene frame={frame} fps={fps} />
      <CTAScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
