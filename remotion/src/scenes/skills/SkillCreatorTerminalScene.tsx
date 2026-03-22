import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SK_COLORS } from "../../skills-constants";
import { FONTS } from "../../constants";
import { Terminal, getTypedText, Cursor } from "../../components/Terminal";
import { ScanlineOverlay } from "../../components/ScanlineOverlay";

const LINES = [
  { text: "$ /skill-creator", delay: 0.3, color: SK_COLORS.green },
  { text: "Intent: Tax optimization agent for Polish solopreneur", delay: 1.5, color: SK_COLORS.mutedText },
  { text: "Generating SKILL.md...", delay: 3.0, color: SK_COLORS.purple },
  { text: "Running evals...", delay: 4.0, color: SK_COLORS.blue },
  { text: "12/12 evals passed", delay: 4.8, color: SK_COLORS.green },
  { text: "Pass rate: 97.3%", delay: 5.5, color: SK_COLORS.green },
];

export const SkillCreatorTerminalScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SK_COLORS.background,
      }}
    >
      <ScanlineOverlay opacity={0.04} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
        }}
      >
        <Terminal
          frame={frame}
          fps={fps}
          title="skill-creator"
          width={900}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              fontFamily: FONTS.code,
              fontSize: 24,
              lineHeight: 1.6,
            }}
          >
            {LINES.map((line, i) => {
              const typedText = getTypedText(
                frame,
                fps,
                line.text,
                line.delay,
                0.2
              );

              if (typedText.length === 0) return null;

              const isCurrentlyTyping =
                typedText.length > 0 && typedText.length < line.text.length;

              // Highlight pass rate and eval count
              const isSuccess =
                line.text.includes("passed") ||
                line.text.includes("97.3%");

              return (
                <div
                  key={i}
                  style={{
                    color: line.color,
                    display: "flex",
                    alignItems: "center",
                    fontWeight: isSuccess ? 700 : 400,
                  }}
                >
                  {isSuccess && (
                    <span style={{ marginRight: 8 }}>✓</span>
                  )}
                  <span>{typedText}</span>
                  {isCurrentlyTyping && (
                    <Cursor
                      visible={Math.floor(frame / 15) % 2 === 0}
                      color={line.color}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Terminal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
