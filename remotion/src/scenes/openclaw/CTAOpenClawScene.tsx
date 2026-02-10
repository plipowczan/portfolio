import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import { OPENCLAW_COLORS } from "../../openclaw-constants";
import { NetworkMesh } from "../../components/NetworkMesh";

export const CTAOpenClawScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Main headline entrance
  const headlineEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const headlineScale = interpolate(headlineEntrance, [0, 1], [0.8, 1]);
  const headlineOpacity = interpolate(headlineEntrance, [0, 1], [0, 1]);

  // Subheadline
  const subEntrance = spring({
    frame: frame - 1 * fps,
    fps,
    config: { damping: 200 },
  });

  // URL entrance
  const urlEntrance = spring({
    frame: frame - 2 * fps,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const urlScale = interpolate(urlEntrance, [0, 1], [0.8, 1]);
  const urlOpacity = interpolate(urlEntrance, [0, 1], [0, 1]);

  // Animated underline for URL
  const underlineWidth = interpolate(
    frame,
    [2.5 * fps, 3.5 * fps],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Blog text entrance
  const blogEntrance = spring({
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
        backgroundColor: OPENCLAW_COLORS.background,
      }}
    >
      {/* Network mesh background */}
      <div style={{ opacity: 0.3 }}>
        <NetworkMesh
          frame={frame}
          color={OPENCLAW_COLORS.primary}
          nodeCount={25}
        />
      </div>

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* "Agenci AI to przyszlosc" - gradient text */}
        <div
          style={{
            transform: `scale(${headlineScale})`,
            opacity: headlineOpacity,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -20,
              background: `linear-gradient(135deg, ${OPENCLAW_COLORS.primary}15, ${OPENCLAW_COLORS.secondary}15)`,
              filter: `blur(${glowPulse}px)`,
              borderRadius: 20,
            }}
          />
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontSize: 80,
              fontWeight: 900,
              background: `linear-gradient(135deg, ${OPENCLAW_COLORS.primary}, ${OPENCLAW_COLORS.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              position: "relative",
            }}
          >
            Agenci AI to przyszlosc
          </h1>
        </div>

        {/* "Ale security by design nie jest opcjonalny" */}
        <div
          style={{
            opacity: subEntrance,
            transform: `translateY(${15 * (1 - subEntrance)}px)`,
            fontFamily: FONTS.heading,
            fontSize: 40,
            fontWeight: 600,
            color: OPENCLAW_COLORS.text,
            textAlign: "center",
          }}
        >
          Ale{" "}
          <span style={{ color: OPENCLAW_COLORS.warningOrange }}>
            security by design
          </span>{" "}
          nie jest opcjonalny
        </div>

        {/* URL with animated underline */}
        <div
          style={{
            transform: `scale(${urlScale})`,
            opacity: urlOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 30,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -30,
              background: `linear-gradient(135deg, ${OPENCLAW_COLORS.primary}10, ${OPENCLAW_COLORS.secondary}10)`,
              filter: `blur(${glowPulse * 0.8}px)`,
              borderRadius: 20,
            }}
          />
          <h2
            style={{
              fontFamily: FONTS.heading,
              fontSize: 72,
              fontWeight: 900,
              color: OPENCLAW_COLORS.text,
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
              background: `linear-gradient(90deg, ${OPENCLAW_COLORS.primary}, ${OPENCLAW_COLORS.secondary})`,
              borderRadius: 3,
              marginTop: 8,
              boxShadow: `0 0 20px ${OPENCLAW_COLORS.primary}60`,
            }}
          />
        </div>

        {/* "Wiecej na blogu" */}
        <div
          style={{
            opacity: blogEntrance,
            transform: `translateY(${20 * (1 - blogEntrance)}px)`,
            fontFamily: FONTS.heading,
            fontSize: 40,
            fontWeight: 500,
            color: OPENCLAW_COLORS.mutedText,
          }}
        >
          Wiecej na blogu
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
