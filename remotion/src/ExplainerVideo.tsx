import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFiraCode } from "@remotion/google-fonts/FiraCode";
import { ProblemScene } from "./scenes/ProblemScene";
import { TraditionalScene } from "./scenes/TraditionalScene";
import { HeroScene } from "./scenes/HeroScene";
import { WorkflowScene } from "./scenes/WorkflowScene";
import { CTAScene } from "./scenes/CTAScene";
import { COLORS, SCENE_TIMING, secondsToFrames } from "./constants";

// Load fonts
loadInter("normal", { weights: ["400", "700", "900"], subsets: ["latin", "latin-ext"] });
loadFiraCode("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const ExplainerVideo = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: Problem (0-8s) */}
      <Sequence
        from={secondsToFrames(SCENE_TIMING.problem.start)}
        durationInFrames={secondsToFrames(SCENE_TIMING.problem.end - SCENE_TIMING.problem.start)}
        premountFor={fps}
      >
        <ProblemScene />
      </Sequence>

      {/* Scene 2: Traditional Approach (8-16s) */}
      <Sequence
        from={secondsToFrames(SCENE_TIMING.traditional.start)}
        durationInFrames={secondsToFrames(SCENE_TIMING.traditional.end - SCENE_TIMING.traditional.start)}
        premountFor={fps}
      >
        <TraditionalScene />
      </Sequence>

      {/* Scene 3: Hero - Remotion + AI (16-28s) */}
      <Sequence
        from={secondsToFrames(SCENE_TIMING.hero.start)}
        durationInFrames={secondsToFrames(SCENE_TIMING.hero.end - SCENE_TIMING.hero.start)}
        premountFor={fps}
      >
        <HeroScene />
      </Sequence>

      {/* Scene 4: Workflow Demo (28-38s) */}
      <Sequence
        from={secondsToFrames(SCENE_TIMING.workflow.start)}
        durationInFrames={secondsToFrames(SCENE_TIMING.workflow.end - SCENE_TIMING.workflow.start)}
        premountFor={fps}
      >
        <WorkflowScene />
      </Sequence>

      {/* Scene 5: CTA (38-45s) */}
      <Sequence
        from={secondsToFrames(SCENE_TIMING.cta.start)}
        durationInFrames={secondsToFrames(SCENE_TIMING.cta.end - SCENE_TIMING.cta.start)}
        premountFor={fps}
      >
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
