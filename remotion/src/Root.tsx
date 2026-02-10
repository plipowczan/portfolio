import { Composition } from "remotion";
import { ExplainerVideo } from "./ExplainerVideo";
import { OpenClawVideo } from "./OpenClawVideo";
import { OPENCLAW_DURATION } from "./openclaw-constants";

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
    </>
  );
};
