import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { FONTS } from "./constants";
import { S3_COLORS, S3_DURATION_SEC, S3_SCENES } from "./software3-constants";
import { Particle } from "./components/Particle";
import { ScanlineOverlay } from "./components/ScanlineOverlay";

loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

export const S3_FLOOR_CEILING_DURATION = S3_DURATION_SEC;

// Smooth in/out opacity for a scene given its [start, end] in seconds.
const sceneOpacity = (
  frame: number,
  fps: number,
  start: number,
  end: number,
  fade = 0.4
) =>
  interpolate(
    frame,
    [
      start * fps,
      (start + fade) * fps,
      (end - fade) * fps,
      end * fps,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

// --- Scene 1: Hook (0-4s) ---
const IntroScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const { start, end } = S3_SCENES.intro;
  const opacity = sceneOpacity(frame, fps, start, end);
  if (opacity <= 0) return null;

  const t = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const slideY = interpolate(t, [0, 1], [40, 0]);

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
        padding: 80,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 40,
          fontWeight: 900,
          color: S3_COLORS.text,
          textAlign: "center",
          lineHeight: 1.25,
        }}
      >
        Vibe coding
        <br />
        <span style={{ color: S3_COLORS.mutedText, fontWeight: 700 }}>to nie to samo, co</span>
        <br />
        Agentic engineering
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: FONTS.heading,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        <span style={{ color: S3_COLORS.floor }}>↑ podłoga</span>
        <span style={{ color: S3_COLORS.mutedText }}>vs</span>
        <span style={{ color: S3_COLORS.ceiling }}>sufit ─</span>
      </div>
    </div>
  );
};

// --- Scene 2: Floor rises (4-12s) ---
const FloorScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const { start, end } = S3_SCENES.floor;
  const opacity = sceneOpacity(frame, fps, start, end);
  if (opacity <= 0) return null;

  const f = frame - start * fps;

  // Floor rises from bottom to mid.
  const rise = spring({ frame: f - 0.4 * fps, fps, config: { damping: 16, stiffness: 60 } });
  const floorY = interpolate(rise, [0, 1], [0, 360]); // pixels up from old floor
  const oldFloorBottom = 220;

  // Arrow grows with the rise.
  const arrowH = interpolate(rise, [0, 1], [0, 300]);

  // Builders pop in above the new floor as it settles.
  const builders = ["👩‍💻", "🧑‍💻", "👨‍💻", "🧑‍🎨", "👩‍🔧", "🧑‍💼"];

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: 110,
          width: "100%",
          textAlign: "center",
          fontFamily: FONTS.heading,
          fontSize: 30,
          fontWeight: 900,
          color: S3_COLORS.floor,
        }}
      >
        Vibe coding podnosi PODŁOGĘ
      </div>
      <div
        style={{
          position: "absolute",
          top: 162,
          width: "100%",
          textAlign: "center",
          fontFamily: FONTS.heading,
          fontSize: 19,
          fontWeight: 600,
          color: S3_COLORS.mutedText,
        }}
      >
        każdy może teraz zbudować software
      </div>

      {/* Old floor (dashed) */}
      <div
        style={{
          position: "absolute",
          bottom: oldFloorBottom,
          left: 120,
          right: 120,
          height: 0,
          borderTop: `3px dashed ${S3_COLORS.mutedText}66`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: oldFloorBottom - 34,
          left: 120,
          fontFamily: FONTS.heading,
          fontSize: 15,
          fontWeight: 600,
          color: `${S3_COLORS.mutedText}aa`,
        }}
      >
        stara podłoga
      </div>

      {/* Rising arrow */}
      <div
        style={{
          position: "absolute",
          bottom: oldFloorBottom,
          left: "50%",
          transform: "translateX(-50%)",
          width: 6,
          height: arrowH,
          background: S3_COLORS.floor,
          borderRadius: 3,
          boxShadow: `0 0 20px ${S3_COLORS.floorGlow}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: oldFloorBottom + arrowH - 4,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          borderBottom: `24px solid ${S3_COLORS.floor}`,
          opacity: arrowH > 30 ? 1 : 0,
        }}
      />

      {/* New floor (solid, glowing) */}
      <div
        style={{
          position: "absolute",
          bottom: oldFloorBottom + floorY,
          left: 100,
          right: 100,
          height: 6,
          background: S3_COLORS.floor,
          borderRadius: 3,
          boxShadow: `0 0 30px ${S3_COLORS.floorGlow}, 0 0 60px ${S3_COLORS.floorGlow}`,
        }}
      />

      {/* Builders standing on the new floor */}
      <div
        style={{
          position: "absolute",
          bottom: oldFloorBottom + floorY + 10,
          left: 100,
          right: 100,
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {builders.map((b, i) => {
          const pop = spring({
            frame: f - (2.6 + i * 0.22) * fps,
            fps,
            config: { damping: 11, stiffness: 120, mass: 0.7 },
          });
          return (
            <span
              key={i}
              style={{
                fontSize: 46,
                opacity: pop,
                transform: `scale(${interpolate(pop, [0, 1], [0.3, 1])})`,
              }}
            >
              {b}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// --- Scene 3: Ceiling held steady (12-20s) ---
const CeilingScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const { start, end } = S3_SCENES.ceiling;
  const opacity = sceneOpacity(frame, fps, start, end);
  if (opacity <= 0) return null;

  const f = frame - start * fps;
  const barTop = 300;

  // Bar draws in left-to-right.
  const draw = interpolate(f, [0.4 * fps, 1.6 * fps], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Support posts drop in.
  const posts = [0.28, 0.5, 0.72];

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <div
        style={{
          position: "absolute",
          top: 110,
          width: "100%",
          textAlign: "center",
          fontFamily: FONTS.heading,
          fontSize: 30,
          fontWeight: 900,
          color: S3_COLORS.ceiling,
        }}
      >
        Agentic engineering trzyma SUFIT
      </div>
      <div
        style={{
          position: "absolute",
          top: 162,
          width: "100%",
          textAlign: "center",
          fontFamily: FONTS.heading,
          fontSize: 19,
          fontWeight: 600,
          color: S3_COLORS.mutedText,
        }}
      >
        poprzeczka jakości trzymana, brak nowych podatności
      </div>

      {/* Quality bar */}
      <div
        style={{
          position: "absolute",
          top: barTop,
          left: 100,
          width: `${draw * 8.8}px`,
          maxWidth: 880,
          height: 8,
          background: S3_COLORS.ceiling,
          borderRadius: 4,
          boxShadow: `0 0 30px ${S3_COLORS.ceilingGlow}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: barTop - 36,
          left: 100,
          fontFamily: FONTS.heading,
          fontSize: 16,
          fontWeight: 700,
          color: S3_COLORS.ceiling,
          opacity: draw > 60 ? 1 : 0,
        }}
      >
        poprzeczka jakości
      </div>

      {/* Support posts holding the bar */}
      {posts.map((pf, i) => {
        const drop = spring({
          frame: f - (2 + i * 0.3) * fps,
          fps,
          config: { damping: 13, stiffness: 100 },
        });
        const h = interpolate(drop, [0, 1], [0, 230]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: barTop + 8,
              left: `${pf * 100}%`,
              width: 5,
              height: h,
              background: `${S3_COLORS.ceiling}cc`,
              borderRadius: 3,
            }}
          />
        );
      })}

      {/* Spiky entities = agents */}
      <div
        style={{
          position: "absolute",
          top: barTop + 300,
          left: 100,
          right: 100,
          display: "flex",
          justifyContent: "center",
          gap: 26,
        }}
      >
        {["⚡", "⚡", "⚡"].map((s, i) => {
          const pop = spring({
            frame: f - (3.4 + i * 0.25) * fps,
            fps,
            config: { damping: 10, stiffness: 130 },
          });
          return (
            <span
              key={i}
              style={{
                fontSize: 44,
                opacity: pop,
                transform: `scale(${interpolate(pop, [0, 1], [0.2, 1])})`,
              }}
            >
              {s}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: barTop + 380,
          left: 100,
          right: 100,
          textAlign: "center",
          fontFamily: FONTS.heading,
          fontSize: 17,
          fontWeight: 600,
          color: S3_COLORS.mutedText,
          opacity: interpolate(f, [3.8 * fps, 4.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        agenci = spiky entities: zawodni, stochastyczni,
        <br />
        ale ekstremalnie potężni. Ty nimi sterujesz.
      </div>
    </div>
  );
};

// --- Scene 4: Divergence — 10x far beyond 10x (20-27s) ---
const DivergeScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const { start, end } = S3_SCENES.diverge;
  const opacity = sceneOpacity(frame, fps, start, end);
  if (opacity <= 0) return null;

  const f = frame - start * fps;
  const grow = interpolate(f, [0.5 * fps, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const originX = 140;
  const originY = 800;
  const width = 800;
  // Top line: steers agents → climbs steeply (kept clear of the title).
  const topEndY = originY - interpolate(grow, [0, 1], [0, 470]);
  // Bottom line: only clicks "accept" → flat.
  const botEndY = originY - interpolate(grow, [0, 1], [0, 60]);
  const endX = originX + width;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <div
        style={{
          position: "absolute",
          top: 130,
          width: "100%",
          textAlign: "center",
          fontFamily: FONTS.heading,
          fontSize: 30,
          fontWeight: 900,
          color: S3_COLORS.text,
        }}
      >
        Sufit jest bardzo wysoko
      </div>
      <div
        style={{
          position: "absolute",
          top: 184,
          width: "100%",
          textAlign: "center",
          fontFamily: FONTS.heading,
          fontSize: 19,
          fontWeight: 600,
          color: S3_COLORS.mutedText,
        }}
      >
        „10x engineer" wzmocniony daleko poza 10x
      </div>

      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {/* Top diverging line */}
        <line
          x1={originX}
          y1={originY}
          x2={endX}
          y2={topEndY}
          stroke={S3_COLORS.floor}
          strokeWidth={6}
          strokeLinecap="round"
        />
        {/* Bottom flat line */}
        <line
          x1={originX}
          y1={originY}
          x2={endX}
          y2={botEndY}
          stroke={S3_COLORS.mutedText}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="2 10"
        />
        {/* Origin dot */}
        <circle cx={originX} cy={originY} r={9} fill={S3_COLORS.text} />
      </svg>

      {/* Top line label */}
      <div
        style={{
          position: "absolute",
          left: endX - 320,
          top: topEndY - 70,
          width: 320,
          textAlign: "right",
          fontFamily: FONTS.heading,
          fontSize: 22,
          fontWeight: 800,
          color: S3_COLORS.floor,
          opacity: grow,
        }}
      >
        kieruje agentami →
        <div style={{ fontSize: 15, fontWeight: 600, color: S3_COLORS.mutedText }}>
          daleko poza 10x
        </div>
      </div>

      {/* Bottom line label */}
      <div
        style={{
          position: "absolute",
          left: endX - 320,
          top: botEndY + 16,
          width: 320,
          textAlign: "right",
          fontFamily: FONTS.heading,
          fontSize: 20,
          fontWeight: 700,
          color: S3_COLORS.mutedText,
          opacity: grow,
        }}
      >
        klika „akceptuj"
      </div>
    </div>
  );
};

// --- Scene 5: Closing line (27-31s) ---
const CloseScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const { start, end } = S3_SCENES.close;
  const opacity = sceneOpacity(frame, fps, start, end, 0.5);
  if (opacity <= 0) return null;

  const f = frame - start * fps;
  const t = spring({ frame: f, fps, config: { damping: 13, stiffness: 80 } });
  const slideY = interpolate(t, [0, 1], [30, 0]);

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
        padding: 90,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 36,
          fontWeight: 900,
          color: S3_COLORS.text,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        Myślenie{" "}
        <span style={{ color: S3_COLORS.floor }}>oddelegujesz</span>.
        <br />
        Zrozumienia{" "}
        <span style={{ color: S3_COLORS.ceiling }}>nie</span>.
      </div>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 18,
          fontWeight: 600,
          color: S3_COLORS.mutedText,
          textAlign: "center",
        }}
      >
        — Andrej Karpathy
      </div>
    </div>
  );
};

// --- Main Composition ---
export const Software3FloorCeilingVideo = () => {
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
      style={{ backgroundColor: S3_COLORS.background, opacity: fadeOut }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${S3_COLORS.mutedText}08 1px, transparent 1px),
            linear-gradient(90deg, ${S3_COLORS.mutedText}08 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Green ambient glow (bottom — floor) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -160,
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${S3_COLORS.floorGlow} 0%, transparent 70%)`,
          opacity: 0.3,
        }}
      />

      {/* Gold ambient glow (top — ceiling) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -160,
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${S3_COLORS.ceilingGlow} 0%, transparent 70%)`,
          opacity: 0.25,
        }}
      />

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <Particle
            key={i}
            index={i}
            frame={frame}
            color1={`${S3_COLORS.floor}25`}
            color2={`${S3_COLORS.ceiling}20`}
          />
        ))}
      </div>

      <ScanlineOverlay opacity={0.04} />

      {/* Scenes */}
      <IntroScene frame={frame} fps={fps} />
      <FloorScene frame={frame} fps={fps} />
      <CeilingScene frame={frame} fps={fps} />
      <DivergeScene frame={frame} fps={fps} />
      <CloseScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
