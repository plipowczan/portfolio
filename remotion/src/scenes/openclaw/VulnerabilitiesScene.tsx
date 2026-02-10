import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  random,
} from "remotion";
import { FONTS } from "../../constants";
import { OPENCLAW_COLORS } from "../../openclaw-constants";
import { Terminal, getTypedText, Cursor } from "../../components/Terminal";
import { ScanlineOverlay } from "../../components/ScanlineOverlay";
import { NetworkMesh } from "../../components/NetworkMesh";
import { ThreatBar } from "../../components/ThreatBar";
import { CounterAnimation } from "../../components/CounterAnimation";

// World map as a dot grid
const WorldMapGrid = ({
  frame,
  fps,
  activeProgress,
}: {
  frame: number;
  fps: number;
  activeProgress: number;
}) => {
  // Simplified dot grid representing world map shape
  const hotspots = [
    { x: 480, y: 350 }, // North America
    { x: 540, y: 420 }, // Central America
    { x: 620, y: 480 }, // South America
    { x: 920, y: 320 }, // Europe
    { x: 960, y: 380 }, // Mediterranean
    { x: 1020, y: 340 }, // Eastern Europe
    { x: 1100, y: 400 }, // Middle East
    { x: 1200, y: 360 }, // Central Asia
    { x: 1350, y: 420 }, // East Asia
    { x: 1300, y: 500 }, // Southeast Asia
    { x: 1150, y: 520 }, // India
    { x: 900, y: 550 }, // Africa
  ];

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {/* Background dot grid */}
      {Array.from({ length: 60 }).map((_, i) =>
        Array.from({ length: 30 }).map((_, j) => {
          const x = 200 + i * 26;
          const y = 200 + j * 24;
          return (
            <circle
              key={`${i}-${j}`}
              cx={x}
              cy={y}
              r="1.5"
              fill={OPENCLAW_COLORS.mutedText}
              opacity="0.15"
            />
          );
        })
      )}

      {/* Pulsing red hotspots */}
      {hotspots.map((spot, i) => {
        const spotDelay = i * 0.15;
        const spotProgress = Math.max(
          0,
          Math.min(1, (activeProgress - spotDelay) * 3)
        );
        const pulse =
          Math.sin((frame - spotDelay * fps) * 0.15) * 0.3 + 0.7;

        return (
          <g key={i}>
            {/* Glow */}
            <circle
              cx={spot.x}
              cy={spot.y}
              r={20 * spotProgress}
              fill={OPENCLAW_COLORS.alertRed}
              opacity={0.15 * pulse * spotProgress}
            />
            {/* Core */}
            <circle
              cx={spot.x}
              cy={spot.y}
              r={6 * spotProgress}
              fill={OPENCLAW_COLORS.alertRed}
              opacity={0.9 * spotProgress}
            />
            {/* Ring */}
            <circle
              cx={spot.x}
              cy={spot.y}
              r={12 * spotProgress + Math.sin(frame * 0.1 + i) * 3}
              fill="none"
              stroke={OPENCLAW_COLORS.alertRed}
              strokeWidth="1"
              opacity={0.4 * pulse * spotProgress}
            />
          </g>
        );
      })}
    </svg>
  );
};

export const VulnerabilitiesScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene is 12 seconds (8-20s). Local frame starts at 0.
  // Phase A: 0-4s (terminal)
  // Phase B: 4-8s (map)
  // Phase C: 8-12s (threat bars)

  const phaseAEnd = 4 * fps;
  const phaseBStart = 4 * fps;
  const phaseBEnd = 8 * fps;
  const phaseCStart = 8 * fps;

  // Phase transitions
  const phaseAFade = interpolate(
    frame,
    [phaseAEnd - 0.5 * fps, phaseAEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const phaseBEntrance = interpolate(
    frame,
    [phaseBStart, phaseBStart + 0.3 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const phaseBFade = interpolate(
    frame,
    [phaseBEnd - 0.5 * fps, phaseBEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const phaseCEntrance = interpolate(
    frame,
    [phaseCStart, phaseCStart + 0.3 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scene fade out
  const sceneFade = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase A: Terminal typing
  const command = "nmap -sV --script vuln openclaw.io";
  const typedCommand = getTypedText(frame, fps, command, 0.3, 0.25);
  const commandComplete = typedCommand.length >= command.length;

  // Terminal output lines
  const outputDelay = 2;
  const outputLines = [
    { text: "CVE-2026-25253  CRITICAL", color: OPENCLAW_COLORS.alertRed, delay: 0 },
    { text: "Remote Code Execution: CONFIRMED", color: OPENCLAW_COLORS.alertRed, delay: 0.3 },
    { text: "12,812 vulnerable instances found", color: OPENCLAW_COLORS.warningOrange, delay: 0.6 },
  ];

  // Phase B: Map counter progress
  const mapProgress = interpolate(
    frame,
    [phaseBStart, phaseBEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase C: Threat vectors
  const threats = [
    { label: "Prompt Injection", severity: 95 },
    { label: "Data Exfiltration", severity: 88 },
    { label: "Supply Chain", severity: 82 },
    { label: "Sandbox Escape", severity: 75 },
    { label: "Model Poisoning", severity: 70 },
  ];

  // Red pulse for terminal border
  const redPulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.3, 0.8]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OPENCLAW_COLORS.background,
        opacity: sceneFade,
      }}
    >
      {/* Phase A: Terminal */}
      {frame < phaseAEnd && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: phaseAFade,
          }}
        >
          <ScanlineOverlay opacity={0.05} />
          <div
            style={{
              border: commandComplete
                ? `2px solid ${OPENCLAW_COLORS.alertRed}${Math.floor(redPulse * 255).toString(16).padStart(2, "0")}`
                : "2px solid transparent",
              borderRadius: 18,
              transition: "border-color 0.3s",
            }}
          >
            <Terminal frame={frame} fps={fps} title="nmap scan" width={1000}>
              {/* Command line */}
              <div
                style={{
                  fontFamily: FONTS.code,
                  fontSize: 22,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ color: OPENCLAW_COLORS.alertRed }}>root@kali</span>
                <span style={{ color: OPENCLAW_COLORS.mutedText }}>:</span>
                <span style={{ color: OPENCLAW_COLORS.secondary }}>~</span>
                <span style={{ color: OPENCLAW_COLORS.mutedText }}>$ </span>
                <span style={{ color: OPENCLAW_COLORS.text }}>{typedCommand}</span>
                {!commandComplete && (
                  <Cursor
                    visible={Math.floor(frame / (fps * 0.5)) % 2 === 0}
                    color={OPENCLAW_COLORS.alertRed}
                  />
                )}
              </div>

              {/* Output */}
              {commandComplete && (
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {outputLines.map((line, i) => {
                    const lineEntrance = spring({
                      frame: frame - (outputDelay + line.delay) * fps,
                      fps,
                      config: { damping: 200 },
                    });
                    return (
                      <div
                        key={i}
                        style={{
                          fontFamily: FONTS.code,
                          fontSize: 20,
                          color: line.color,
                          opacity: lineEntrance,
                          transform: `translateX(${10 * (1 - lineEntrance)}px)`,
                        }}
                      >
                        [{">"}] {line.text}
                      </div>
                    );
                  })}
                </div>
              )}
            </Terminal>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase B: World Map */}
      {frame >= phaseBStart && frame < phaseBEnd && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: phaseBEntrance * phaseBFade,
          }}
        >
          <WorldMapGrid frame={frame} fps={fps} activeProgress={mapProgress} />

          {/* Counter overlay */}
          <div
            style={{
              position: "absolute",
              top: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: 28,
                color: OPENCLAW_COLORS.mutedText,
                fontWeight: 500,
              }}
            >
              EXPOSED INSTANCES
            </span>
            <div
              style={{
                background: `${OPENCLAW_COLORS.alertRed}15`,
                padding: "12px 40px",
                borderRadius: 12,
                border: `1px solid ${OPENCLAW_COLORS.alertRed}40`,
              }}
            >
              <CounterAnimation
                frame={frame - phaseBStart}
                fps={fps}
                from={0}
                to={28663}
                startDelay={0.3}
                duration={3}
                color={OPENCLAW_COLORS.alertRed}
                fontSize={80}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase C: Threat bars */}
      {frame >= phaseCStart && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: phaseCEntrance,
          }}
        >
          {/* Red network mesh background */}
          <div style={{ opacity: 0.2 }}>
            <NetworkMesh
              frame={frame}
              color={OPENCLAW_COLORS.alertRed}
              nodeCount={20}
              maxDistance={250}
            />
          </div>

          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: 140,
              fontFamily: FONTS.heading,
              fontSize: 48,
              fontWeight: 900,
              color: OPENCLAW_COLORS.alertRed,
              textShadow: `0 0 20px ${OPENCLAW_COLORS.alertRedGlow}`,
            }}
          >
            ATTACK VECTORS
          </div>

          {/* Threat bars */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              marginTop: 40,
            }}
          >
            {threats.map((threat, i) => (
              <ThreatBar
                key={threat.label}
                label={threat.label}
                severity={threat.severity}
                frame={frame - phaseCStart}
                fps={fps}
                delay={i * 0.3 * fps}
                color={OPENCLAW_COLORS.alertRed}
              />
            ))}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
