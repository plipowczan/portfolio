import { Composition } from "remotion";
import { ExplainerVideo } from "./ExplainerVideo";

// 45 seconds at 30fps = 1350 frames
const FPS = 30;
const DURATION_SECONDS = 45;

export const RemotionRoot = () => {
  return (
    <Composition
      id="ExplainerVideo"
      component={ExplainerVideo}
      durationInFrames={DURATION_SECONDS * FPS}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
