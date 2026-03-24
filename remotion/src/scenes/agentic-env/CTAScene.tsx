import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import { SK_COLORS } from "../../skills-constants";
import { ScanlineOverlay } from "../../components/ScanlineOverlay";

export const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main title
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleScale = interpolate(titleEntrance, [0, 1], [0.9, 1]);

  // URL line
  const urlDelay = 0.8 * fps;
  const urlEntrance = spring({
    frame: frame - urlDelay,
    fps,
    config: { damping: 200 },
  });

  // SKILL CTA
  const skillDelay = 1.6 * fps;
  const skillEntrance = spring({
    frame: frame - skillDelay,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const skillOpacity = interpolate(skillEntrance, [0, 1], [0, 1]);
  const skillScale = interpolate(skillEntrance, [0, 1], [0.8, 1]);

  // Pulse on SKILL badge
  const pulsePhase = Math.max(0, frame - skillDelay - fps);
  const pulseGlow = interpolate(
    Math.sin(pulsePhase * 0.12),
    [-1, 1],
    [8, 24]
  );

  // Arrow
  const arrowDelay = 2.2 * fps;
  const arrowEntrance = spring({
    frame: frame - arrowDelay,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SK_COLORS.background,
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${SK_COLORS.mutedText}08 1px, transparent 1px),
            linear-gradient(90deg, ${SK_COLORS.mutedText}08 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${SK_COLORS.greenGlow} 0%, transparent 70%)`,
          opacity: 0.4,
        }}
      />

      <ScanlineOverlay opacity={0.03} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 28,
          padding: "60px 80px",
        }}
      >
        {/* Main CTA */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            fontFamily: FONTS.heading,
            fontSize: 44,
            fontWeight: 900,
            color: SK_COLORS.text,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          Pełny artykuł na blogu
        </div>

        {/* URL */}
        <div
          style={{
            opacity: urlEntrance,
            transform: `translateY(${8 * (1 - urlEntrance)}px)`,
            padding: "14px 32px",
            borderRadius: 14,
            background: `${SK_COLORS.green}15`,
            border: `2px solid ${SK_COLORS.green}40`,
            fontFamily: FONTS.code,
            fontSize: 22,
            fontWeight: 700,
            color: SK_COLORS.green,
          }}
        >
          pawel.lipowczan.pl/blog
        </div>

        {/* Divider */}
        <div
          style={{
            width: 60,
            height: 2,
            backgroundColor: `${SK_COLORS.mutedText}30`,
            borderRadius: 1,
            opacity: urlEntrance,
          }}
        />

        {/* SKILL CTA */}
        <div
          style={{
            opacity: skillOpacity,
            transform: `scale(${skillScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 24,
              fontWeight: 600,
              color: SK_COLORS.mutedText,
              textAlign: "center",
            }}
          >
            Chcesz dostęp do repozytorium?
          </div>

          {/* SKILL badge */}
          <div
            style={{
              padding: "12px 36px",
              borderRadius: 16,
              background: `${SK_COLORS.purple}20`,
              border: `2px solid ${SK_COLORS.purple}60`,
              boxShadow: `0 0 ${pulseGlow}px ${SK_COLORS.purpleGlow}`,
              fontFamily: FONTS.code,
              fontSize: 28,
              fontWeight: 900,
              color: SK_COLORS.purple,
              letterSpacing: 2,
            }}
          >
            SKILL
          </div>

          {/* Arrow pointing up (to comment) */}
          <div
            style={{
              opacity: arrowEntrance,
              fontFamily: FONTS.heading,
              fontSize: 18,
              fontWeight: 500,
              color: SK_COLORS.mutedText,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>↑</span>
            <span>napisz w komentarzu</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
