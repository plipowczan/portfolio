import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFiraCode } from "@remotion/google-fonts/FiraCode";
import { HypeScene } from "./scenes/openclaw/HypeScene";
import { VulnerabilitiesScene } from "./scenes/openclaw/VulnerabilitiesScene";
import { MoltbookScene } from "./scenes/openclaw/MoltbookScene";
import { LessonsScene } from "./scenes/openclaw/LessonsScene";
import { CTAOpenClawScene } from "./scenes/openclaw/CTAOpenClawScene";
import { OPENCLAW_COLORS, OPENCLAW_TIMING, secondsToFrames } from "./openclaw-constants";

// Load fonts
loadInter("normal", { weights: ["400", "700", "900"], subsets: ["latin", "latin-ext"] });
loadFiraCode("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const OpenClawVideo = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: OPENCLAW_COLORS.background }}>
      {/* Scene 1: Hype (0-8s) */}
      <Sequence
        from={secondsToFrames(OPENCLAW_TIMING.hype.start)}
        durationInFrames={secondsToFrames(OPENCLAW_TIMING.hype.end - OPENCLAW_TIMING.hype.start)}
        premountFor={fps}
      >
        <HypeScene />
      </Sequence>

      {/* Scene 2: Vulnerabilities (8-20s) */}
      <Sequence
        from={secondsToFrames(OPENCLAW_TIMING.vulnerabilities.start)}
        durationInFrames={secondsToFrames(OPENCLAW_TIMING.vulnerabilities.end - OPENCLAW_TIMING.vulnerabilities.start)}
        premountFor={fps}
      >
        <VulnerabilitiesScene />
      </Sequence>

      {/* Scene 3: Moltbook / AI Theater (20-30s) */}
      <Sequence
        from={secondsToFrames(OPENCLAW_TIMING.moltbook.start)}
        durationInFrames={secondsToFrames(OPENCLAW_TIMING.moltbook.end - OPENCLAW_TIMING.moltbook.start)}
        premountFor={fps}
      >
        <MoltbookScene />
      </Sequence>

      {/* Scene 4: Lessons (30-42s) */}
      <Sequence
        from={secondsToFrames(OPENCLAW_TIMING.lessons.start)}
        durationInFrames={secondsToFrames(OPENCLAW_TIMING.lessons.end - OPENCLAW_TIMING.lessons.start)}
        premountFor={fps}
      >
        <LessonsScene />
      </Sequence>

      {/* Scene 5: CTA (42-50s) */}
      <Sequence
        from={secondsToFrames(OPENCLAW_TIMING.cta.start)}
        durationInFrames={secondsToFrames(OPENCLAW_TIMING.cta.end - OPENCLAW_TIMING.cta.start)}
        premountFor={fps}
      >
        <CTAOpenClawScene />
      </Sequence>
    </AbsoluteFill>
  );
};
