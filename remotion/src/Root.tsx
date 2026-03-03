import { Composition } from "remotion";
import { ExplainerVideo } from "./ExplainerVideo";
import { OpenClawVideo } from "./OpenClawVideo";
import { ComparisonVideo, COMPARISON_DURATION } from "./ComparisonVideo";
import { SafeStepsCarousel, CAROUSEL_DURATION } from "./SafeStepsCarousel";
import { OPENCLAW_DURATION } from "./openclaw-constants";
import { ClaudeCodeProblem, PROBLEM_DURATION } from "./ClaudeCodeProblem";
import {
  ClaudeCodeContextReset,
  CONTEXT_RESET_DURATION,
} from "./ClaudeCodeContextReset";
import {
  ClaudeCodePIVWorkflow,
  PIV_WORKFLOW_DURATION,
} from "./ClaudeCodePIVWorkflow";
import { CC_SIZE } from "./claude-code-constants";
import {
  AgencyProcessVideo,
  PROCESS_DURATION,
} from "./AgencyProcessVideo";
import { OfferTimeVideo, TIME_DURATION } from "./OfferTimeVideo";
import { AITransformVideo, TRANSFORM_DURATION } from "./AITransformVideo";
import { AO_SIZES } from "./agency-offer-constants";

const FPS = 30;
const EXPLAINER_DURATION = 45;

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ExplainerVideo"
        component={ExplainerVideo}
        durationInFrames={EXPLAINER_DURATION * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="OpenClawVideo"
        component={OpenClawVideo}
        durationInFrames={OPENCLAW_DURATION * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="OpenClawComparison"
        component={ComparisonVideo}
        durationInFrames={COMPARISON_DURATION * FPS}
        fps={FPS}
        width={1080}
        height={1080}
      />
      <Composition
        id="SafeStepsCarousel"
        component={SafeStepsCarousel}
        durationInFrames={CAROUSEL_DURATION * FPS}
        fps={FPS}
        width={1080}
        height={1350}
      />
      <Composition
        id="ClaudeCodeProblem"
        component={ClaudeCodeProblem}
        durationInFrames={PROBLEM_DURATION * FPS}
        fps={FPS}
        width={CC_SIZE.width}
        height={CC_SIZE.height}
      />
      <Composition
        id="ClaudeCodeContextReset"
        component={ClaudeCodeContextReset}
        durationInFrames={CONTEXT_RESET_DURATION * FPS}
        fps={FPS}
        width={CC_SIZE.width}
        height={CC_SIZE.height}
      />
      <Composition
        id="ClaudeCodePIVWorkflow"
        component={ClaudeCodePIVWorkflow}
        durationInFrames={PIV_WORKFLOW_DURATION * FPS}
        fps={FPS}
        width={CC_SIZE.width}
        height={CC_SIZE.height}
      />
      <Composition
        id="AgencyProcess"
        component={AgencyProcessVideo}
        durationInFrames={PROCESS_DURATION * FPS}
        fps={FPS}
        width={AO_SIZES.square.width}
        height={AO_SIZES.square.height}
      />
      <Composition
        id="OfferTime"
        component={OfferTimeVideo}
        durationInFrames={TIME_DURATION * FPS}
        fps={FPS}
        width={AO_SIZES.square.width}
        height={AO_SIZES.square.height}
      />
      <Composition
        id="AITransform"
        component={AITransformVideo}
        durationInFrames={TRANSFORM_DURATION * FPS}
        fps={FPS}
        width={AO_SIZES.portrait.width}
        height={AO_SIZES.portrait.height}
      />
    </>
  );
};
