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
import { CounterAnimation } from "./components/CounterAnimation";
import { Particle } from "./components/Particle";
import { ScanlineOverlay } from "./components/ScanlineOverlay";

loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

export const TIME_DURATION = AO_DURATIONS.time;

// --- Time bar item ---
const TimeBar = ({
  label,
  minH,
  maxH,
  frame,
  fps,
  delay,
}: {
  label: string;
  minH: number;
  maxH: number;
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
  const slideX = interpolate(rowEntrance, [0, 1], [-40, 0]);

  // Bar fill animation (slightly delayed after row)
  const barProgress = interpolate(
    sceneFrame,
    [0.3 * fps, 1.2 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Width proportional to maxH (max is 5h)
  const maxWidth = 380;
  const barWidth = (maxH / 5) * maxWidth * barProgress;

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
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 18,
          fontWeight: 600,
          color: AO_COLORS.text,
          width: 280,
          flexShrink: 0,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>

      {/* Bar track */}
      <div
        style={{
          position: "relative",
          width: maxWidth,
          height: 28,
          borderRadius: 8,
          background: `${AO_COLORS.mutedText}18`,
          overflow: "hidden",
        }}
      >
        {/* Filled bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: barWidth,
            borderRadius: 8,
            background: `linear-gradient(90deg, ${AO_COLORS.gold}, ${AO_COLORS.goldGlow})`,
            boxShadow: `0 0 12px ${AO_COLORS.goldGlow}`,
          }}
        />
      </div>

      {/* Hours label */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 18,
          fontWeight: 700,
          color: AO_COLORS.gold,
          width: 60,
          flexShrink: 0,
        }}
      >
        {minH}–{maxH}h
      </div>
    </div>
  );
};

// --- Scene: Big Number (0-4s) ---
const BigNumberScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80, mass: 0.8 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.7, 1]);

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
        transform: `scale(${scale})`,
      }}
    >
      <CounterAnimation
        frame={frame}
        fps={fps}
        from={0}
        to={16}
        startDelay={0.2}
        duration={2.5}
        color={AO_COLORS.gold}
        fontSize={140}
        suffix="h"
        formatNumber={false}
      />
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 30,
          fontWeight: 700,
          color: AO_COLORS.text,
          textAlign: "center",
        }}
      >
        na jedną ofertę
      </div>
    </div>
  );
};

// --- Scene: Breakdown (4-11s) ---
const BreakdownScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 4 * fps;
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

  const items = [
    { label: "Brief / Transkrypcja spotkania", minH: 1, maxH: 2, delay: 0 },
    { label: "Analiza bazy wiedzy i wycen", minH: 3, maxH: 5, delay: 0.7 * fps },
    { label: "Przygotowanie wkładu", minH: 2, maxH: 4, delay: 1.4 * fps },
    { label: "Finalna oferta", minH: 2, maxH: 5, delay: 2.1 * fps },
  ];

  // Total label appearance
  const totalEntrance = spring({
    frame: sceneFrame - 3.2 * fps,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const totalOpacity = interpolate(totalEntrance, [0, 1], [0, 1]);
  const totalScale = interpolate(totalEntrance, [0, 1], [0.8, 1]);

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
        padding: "40px 60px",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 26,
          fontWeight: 700,
          color: AO_COLORS.mutedText,
          marginBottom: 8,
        }}
      >
        Skąd te godziny?
      </div>

      {/* Bars */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
          maxWidth: 760,
        }}
      >
        {items.map((item, i) => (
          <TimeBar
            key={i}
            label={item.label}
            minH={item.minH}
            maxH={item.maxH}
            frame={sceneFrame}
            fps={fps}
            delay={item.delay}
          />
        ))}
      </div>

      {/* Total */}
      <div
        style={{
          opacity: totalOpacity,
          transform: `scale(${totalScale})`,
          padding: "14px 32px",
          borderRadius: 14,
          background: `${AO_COLORS.gold}18`,
          border: `2px solid ${AO_COLORS.gold}60`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 4,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: 20,
            fontWeight: 600,
            color: AO_COLORS.text,
          }}
        >
          Łącznie:
        </span>
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: 28,
            fontWeight: 900,
            color: AO_COLORS.gold,
          }}
        >
          8–16h
        </span>
      </div>
    </div>
  );
};

// --- Scene: Punch (11-15s) ---
const PunchScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const sceneStart = 11 * fps;
  const sceneFrame = frame - sceneStart;

  if (sceneFrame < 0) return null;

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const slideY = interpolate(entrance, [0, 1], [30, 0]);

  // Second line delayed
  const line2Entrance = spring({
    frame: sceneFrame - 0.8 * fps,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const line2Opacity = interpolate(line2Entrance, [0, 1], [0, 1]);
  const line2Slide = interpolate(line2Entrance, [0, 1], [20, 0]);

  // URL
  const urlEntrance = spring({
    frame: sceneFrame - 1.6 * fps,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const urlOpacity = interpolate(urlEntrance, [0, 1], [0, 1]);

  const underlineWidth = interpolate(
    sceneFrame,
    [2 * fps, 3 * fps],
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
        gap: 20,
        opacity,
        transform: `translateY(${slideY}px)`,
        padding: 60,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 38,
          fontWeight: 900,
          color: AO_COLORS.text,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        ×15 ofert miesięcznie ={" "}
        <span style={{ color: AO_COLORS.gold }}>120–240h</span>
      </div>

      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 28,
          fontWeight: 700,
          color: AO_COLORS.red,
          textAlign: "center",
          opacity: line2Opacity,
          transform: `translateY(${line2Slide}px)`,
        }}
      >
        = 3 pełne etaty
      </div>

      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 18,
          fontWeight: 400,
          color: AO_COLORS.mutedText,
          textAlign: "center",
          opacity: line2Opacity,
          transform: `translateY(${line2Slide}px)`,
        }}
      >
        poświęcone wyłącznie na ofertowanie
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
export const OfferTimeVideo = () => {
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

      {/* Gold ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${AO_COLORS.goldGlow} 0%, transparent 70%)`,
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
            color1={`${AO_COLORS.gold}25`}
            color2={`${AO_COLORS.red}20`}
          />
        ))}
      </div>

      <ScanlineOverlay opacity={0.04} />

      {/* Scenes */}
      <BigNumberScene frame={frame} fps={fps} />
      <BreakdownScene frame={frame} fps={fps} />
      <PunchScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
