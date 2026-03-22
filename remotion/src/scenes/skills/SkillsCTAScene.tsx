import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import { SK_COLORS } from "../../skills-constants";
import { NetworkMesh } from "../../components/NetworkMesh";
import { ScanlineOverlay } from "../../components/ScanlineOverlay";

export const SkillsCTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline entrance
  const headlineEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const headlineOpacity = interpolate(headlineEntrance, [0, 1], [0, 1]);
  const headlineY = interpolate(headlineEntrance, [0, 1], [-30, 0]);

  // URL entrance
  const urlEntrance = spring({
    frame: frame - 1 * fps,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const urlScale = interpolate(urlEntrance, [0, 1], [0.8, 1]);
  const urlOpacity = interpolate(urlEntrance, [0, 1], [0, 1]);

  // Animated underline
  const underlineWidth = interpolate(
    frame,
    [1.5 * fps, 2.5 * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card entrance
  const cardEntrance = spring({
    frame: frame - 2.5 * fps,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const cardOpacity = interpolate(cardEntrance, [0, 1], [0, 1]);
  const cardY = interpolate(cardEntrance, [0, 1], [30, 0]);

  // Author entrance
  const authorEntrance = spring({
    frame: frame - 3.5 * fps,
    fps,
    config: { damping: 200 },
  });

  // Glow pulse
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [15, 35]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SK_COLORS.background,
      }}
    >
      {/* Network mesh background */}
      <div style={{ opacity: 0.15 }}>
        <NetworkMesh
          frame={frame}
          color={SK_COLORS.purple}
          nodeCount={20}
        />
      </div>

      <ScanlineOverlay opacity={0.04} />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 36,
        }}
      >
        {/* "Pelny przewodnik na blogu" */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: FONTS.heading,
            fontSize: 44,
            fontWeight: 700,
            color: SK_COLORS.mutedText,
          }}
        >
          Pelny przewodnik na blogu
        </div>

        {/* URL with animated underline */}
        <div
          style={{
            transform: `scale(${urlScale})`,
            opacity: urlOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -30,
              background: `linear-gradient(135deg, ${SK_COLORS.purpleGlow}, ${SK_COLORS.blueGlow})`,
              filter: `blur(${glowPulse}px)`,
              borderRadius: 20,
            }}
          />
          <h2
            style={{
              fontFamily: FONTS.heading,
              fontSize: 68,
              fontWeight: 900,
              color: SK_COLORS.text,
              margin: 0,
              position: "relative",
              letterSpacing: "-1px",
            }}
          >
            pawel.lipowczan.pl
          </h2>
          <div
            style={{
              width: `${underlineWidth}%`,
              height: 6,
              background: `linear-gradient(90deg, ${SK_COLORS.purple}, ${SK_COLORS.blue})`,
              borderRadius: 3,
              marginTop: 8,
              boxShadow: `0 0 20px ${SK_COLORS.purpleGlow}`,
            }}
          />
        </div>

        {/* Glassmorphism CTA card */}
        <div
          style={{
            opacity: cardOpacity,
            transform: `translateY(${cardY}px)`,
            padding: "28px 48px",
            borderRadius: 20,
            background: `${SK_COLORS.darkSurface}cc`,
            border: `2px solid ${SK_COLORS.purple}40`,
            backdropFilter: "blur(10px)",
            boxShadow: `0 8px 40px ${SK_COLORS.purpleGlow}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.heading,
              fontSize: 36,
              fontWeight: 700,
              color: SK_COLORS.text,
            }}
          >
            Zostaw{" "}
            <span
              style={{
                color: SK_COLORS.purple,
                fontWeight: 900,
              }}
            >
              SKILL
            </span>{" "}
            w komentarzu
          </span>
          <span
            style={{
              fontFamily: FONTS.heading,
              fontSize: 28,
              fontWeight: 500,
              color: SK_COLORS.mutedText,
            }}
          >
            Wysle link do repo
          </span>
        </div>

        {/* Author mark */}
        <div
          style={{
            opacity: authorEntrance,
            transform: `translateY(${15 * (1 - authorEntrance)}px)`,
            fontFamily: FONTS.heading,
            fontSize: 24,
            fontWeight: 500,
            color: SK_COLORS.mutedText,
            marginTop: 10,
          }}
        >
          Pawel Lipowczan
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
