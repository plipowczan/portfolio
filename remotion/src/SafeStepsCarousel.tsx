import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { FONTS } from "./constants";
import { OPENCLAW_COLORS } from "./openclaw-constants";
import { ScanlineOverlay } from "./components/ScanlineOverlay";

// Load fonts
loadInter("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin", "latin-ext"],
});

// Duration
export const CAROUSEL_DURATION = 40;

const SLIDE_DURATION_SECONDS = 5;
const SLIDE_COUNT = 8;
const FADE_SECONDS = 0.5;

// --- SVG Icon components (48x48, stroke-based) ---

const ShieldIcon = () => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 24 24"
    fill="none"
    stroke={OPENCLAW_COLORS.terminalGreen}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const ServerIcon = () => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 24 24"
    fill="none"
    stroke={OPENCLAW_COLORS.terminalGreen}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const DollarShieldIcon = () => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 24 24"
    fill="none"
    stroke={OPENCLAW_COLORS.terminalGreen}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v8" />
    <path d="M9.5 10.5c0-1 1-1.5 2.5-1.5s2.5.5 2.5 1.5-1 1.5-2.5 2-2.5.5-2.5 1.5 1 1.5 2.5 1.5 2.5-.5 2.5-1.5" />
  </svg>
);

const LockIcon = () => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 24 24"
    fill="none"
    stroke={OPENCLAW_COLORS.terminalGreen}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
    <circle cx="12" cy="16" r="1" />
  </svg>
);

const SearchCodeIcon = () => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 24 24"
    fill="none"
    stroke={OPENCLAW_COLORS.terminalGreen}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <polyline points="8 8 11 11 8 14" />
  </svg>
);

const AlertBellIcon = () => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 24 24"
    fill="none"
    stroke={OPENCLAW_COLORS.terminalGreen}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <circle cx="18" cy="4" r="3" fill={OPENCLAW_COLORS.terminalGreen} stroke="none" opacity={0.3} />
    <circle cx="18" cy="4" r="2" fill="none" stroke={OPENCLAW_COLORS.terminalGreen} strokeWidth="1.5" />
  </svg>
);

const HumanGearIcon = () => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 24 24"
    fill="none"
    stroke={OPENCLAW_COLORS.terminalGreen}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
    <circle cx="19" cy="11" r="2" />
    <path d="M19 8v1" />
    <path d="M19 13v1" />
    <path d="M16.5 9.5l.87.5" />
    <path d="M20.63 12l.87.5" />
    <path d="M16.5 12.5l.87-.5" />
    <path d="M20.63 10l.87-.5" />
  </svg>
);

// --- Slide data ---

interface StepSlide {
  type: "step";
  stepNumber: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface SpecialSlide {
  type: "intro" | "outro";
}

type Slide = StepSlide | SpecialSlide;

const SLIDES: Slide[] = [
  { type: "intro" },
  {
    type: "step",
    stepNumber: "01",
    title: "Izolowane środowisko",
    description:
      "Uruchamiaj agentów w kontenerach lub maszynach wirtualnych. Nigdy nie dawaj im dostępu do produkcyjnych systemów.",
    icon: <ServerIcon />,
  },
  {
    type: "step",
    stepNumber: "02",
    title: "Limity budżetowe",
    description:
      "Ustaw twarde limity wydatków na API i zasoby chmurowe. Agent bez limitów to karta kredytowa bez PIN-u.",
    icon: <DollarShieldIcon />,
  },
  {
    type: "step",
    stepNumber: "03",
    title: "Minimalne uprawnienia",
    description:
      "Stosuj zasadę najmniejszych uprawnień. Agent powinien mieć dostęp tylko do tego, czego faktycznie potrzebuje.",
    icon: <LockIcon />,
  },
  {
    type: "step",
    stepNumber: "04",
    title: "Weryfikacja umiejętności",
    description:
      "Sprawdzaj kod i narzędzia, które agent pobiera. Audytuj MCP servery i zewnętrzne zależności przed użyciem.",
    icon: <SearchCodeIcon />,
  },
  {
    type: "step",
    stepNumber: "05",
    title: "Monitoring kosztów",
    description:
      "Wdróż alerty budżetowe i monitoring w czasie rzeczywistym. Reaguj, zanim koszty wymkną się spod kontroli.",
    icon: <AlertBellIcon />,
  },
  {
    type: "step",
    stepNumber: "06",
    title: "Alternatywy z kontrolą",
    description:
      "Wybieraj narzędzia z human-in-the-loop. Potwierdzenie człowieka przed każdą krytyczną akcją to Twoja polisa.",
    icon: <HumanGearIcon />,
  },
  { type: "outro" },
];

// --- Helper: compute slide opacity ---

const getSlideOpacity = (
  frame: number,
  fps: number,
  slideIndex: number
): number => {
  const slideStart = slideIndex * SLIDE_DURATION_SECONDS * fps;
  const slideEnd = slideStart + SLIDE_DURATION_SECONDS * fps;
  const fadeFrames = FADE_SECONDS * fps;

  const fadeIn = interpolate(
    frame,
    [slideStart, slideStart + fadeFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fadeOut = interpolate(
    frame,
    [slideEnd - fadeFrames, slideEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return Math.min(fadeIn, fadeOut);
};

// --- Progress dots ---

const ProgressDots = ({
  currentStep,
  frame,
  fps,
}: {
  currentStep: number;
  frame: number;
  fps: number;
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {Array.from({ length: 6 }, (_, i) => {
        const isActive = i + 1 === currentStep;
        const isPast = i + 1 < currentStep;

        const dotScale = isActive
          ? spring({
              frame: frame - (i + 1) * SLIDE_DURATION_SECONDS * fps,
              fps,
              config: { damping: 10, stiffness: 200, mass: 0.5 },
            })
          : 1;

        return (
          <div
            key={i}
            style={{
              width: isActive ? 32 : 12,
              height: 12,
              borderRadius: 6,
              background: isActive
                ? OPENCLAW_COLORS.terminalGreen
                : isPast
                  ? `${OPENCLAW_COLORS.terminalGreen}80`
                  : `${OPENCLAW_COLORS.mutedText}40`,
              transform: `scale(${dotScale})`,
              transition: "width 0.3s",
            }}
          />
        );
      })}
    </div>
  );
};

// --- Intro slide ---

const IntroSlide = ({
  opacity,
  frame,
  fps,
}: {
  opacity: number;
  frame: number;
  fps: number;
}) => {
  const titleEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const titleY = interpolate(titleEntrance, [0, 1], [40, 0]);

  const iconScale = spring({
    frame: frame - 0.3 * fps,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.8 },
  });

  const subtitleEntrance = spring({
    frame: frame - 0.8 * fps,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const subtitleY = interpolate(subtitleEntrance, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        gap: 40,
        padding: "0 80px",
      }}
    >
      {/* Large shield icon */}
      <div
        style={{
          transform: `scale(${iconScale})`,
          width: 160,
          height: 160,
          borderRadius: 80,
          background: `${OPENCLAW_COLORS.terminalGreen}12`,
          border: `2px solid ${OPENCLAW_COLORS.terminalGreen}30`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <svg
          width={80}
          height={80}
          viewBox="0 0 24 24"
          fill="none"
          stroke={OPENCLAW_COLORS.terminalGreen}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </div>

      {/* Title */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 28,
            fontWeight: 600,
            color: OPENCLAW_COLORS.terminalGreen,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          OpenClaw Security
        </div>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 56,
            fontWeight: 900,
            color: OPENCLAW_COLORS.text,
            lineHeight: 1.2,
          }}
        >
          6 kroków bezpiecznego eksperymentowania z agentami AI
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleEntrance,
          transform: `translateY(${subtitleY}px)`,
          fontFamily: FONTS.heading,
          fontSize: 26,
          fontWeight: 400,
          color: OPENCLAW_COLORS.mutedText,
          textAlign: "center",
        }}
      >
        Praktyczny przewodnik bezpieczeństwa
      </div>
    </div>
  );
};

// --- Step slide ---

const StepSlide = ({
  slide,
  opacity,
  frame,
  fps,
}: {
  slide: StepSlide;
  opacity: number;
  frame: number;
  fps: number;
}) => {
  const slideLocalFrame =
    frame - SLIDES.indexOf(slide) * SLIDE_DURATION_SECONDS * fps;

  const iconEntrance = spring({
    frame: slideLocalFrame - 0.2 * fps,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });
  const iconScale = interpolate(iconEntrance, [0, 1], [0.5, 1]);

  const titleEntrance = spring({
    frame: slideLocalFrame - 0.4 * fps,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const titleY = interpolate(titleEntrance, [0, 1], [30, 0]);

  const dividerEntrance = spring({
    frame: slideLocalFrame - 0.6 * fps,
    fps,
    config: { damping: 15, stiffness: 100 },
  });
  const dividerWidth = interpolate(dividerEntrance, [0, 1], [0, 1]);

  const descEntrance = spring({
    frame: slideLocalFrame - 0.8 * fps,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const descY = interpolate(descEntrance, [0, 1], [20, 0]);

  const stepIndex = SLIDES.indexOf(slide);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        padding: "0 80px",
        gap: 36,
      }}
    >
      {/* Step number watermark */}
      <div
        style={{
          position: "absolute",
          top: 180,
          right: 80,
          fontFamily: FONTS.heading,
          fontSize: 280,
          fontWeight: 900,
          color: `${OPENCLAW_COLORS.terminalGreen}08`,
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {slide.stepNumber}
      </div>

      {/* Step label */}
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 22,
          fontWeight: 700,
          color: OPENCLAW_COLORS.terminalGreen,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: titleEntrance,
        }}
      >
        Krok {slide.stepNumber}
      </div>

      {/* Icon in glassmorphism circle */}
      <div
        style={{
          transform: `scale(${iconScale})`,
          width: 120,
          height: 120,
          borderRadius: 60,
          background: `${OPENCLAW_COLORS.darkSurface}cc`,
          border: `2px solid ${OPENCLAW_COLORS.terminalGreen}30`,
          backdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: `0 0 40px ${OPENCLAW_COLORS.terminalGreen}15`,
        }}
      >
        {slide.icon}
      </div>

      {/* Title */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleEntrance,
          fontFamily: FONTS.heading,
          fontSize: 52,
          fontWeight: 900,
          color: OPENCLAW_COLORS.text,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {slide.title}
      </div>

      {/* Gradient divider */}
      <div
        style={{
          width: 800,
          height: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${OPENCLAW_COLORS.terminalGreen}60, transparent)`,
            transform: `scaleX(${dividerWidth})`,
          }}
        />
      </div>

      {/* Description */}
      <div
        style={{
          opacity: descEntrance,
          transform: `translateY(${descY}px)`,
          fontFamily: FONTS.heading,
          fontSize: 32,
          fontWeight: 400,
          color: OPENCLAW_COLORS.mutedText,
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 800,
        }}
      >
        {slide.description}
      </div>

      {/* Progress dots */}
      <div style={{ marginTop: 20 }}>
        <ProgressDots
          currentStep={stepIndex}
          frame={frame}
          fps={fps}
        />
      </div>
    </div>
  );
};

// --- Outro slide ---

const OutroSlide = ({
  opacity,
  frame,
  fps,
}: {
  opacity: number;
  frame: number;
  fps: number;
}) => {
  const slideLocalFrame =
    frame - (SLIDE_COUNT - 1) * SLIDE_DURATION_SECONDS * fps;

  const badgeEntrance = spring({
    frame: slideLocalFrame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });
  const badgeScale = interpolate(badgeEntrance, [0, 1], [0.6, 1]);

  const textEntrance = spring({
    frame: slideLocalFrame - 0.5 * fps,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const textY = interpolate(textEntrance, [0, 1], [30, 0]);

  const urlEntrance = spring({
    frame: slideLocalFrame - 1 * fps,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        gap: 50,
        padding: "0 80px",
      }}
    >
      {/* Checkmark badge */}
      <div
        style={{
          transform: `scale(${badgeScale})`,
          width: 140,
          height: 140,
          borderRadius: 70,
          background: `${OPENCLAW_COLORS.terminalGreen}15`,
          border: `3px solid ${OPENCLAW_COLORS.terminalGreen}50`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: `0 0 60px ${OPENCLAW_COLORS.terminalGreen}20`,
        }}
      >
        <svg
          width={70}
          height={70}
          viewBox="0 0 24 24"
          fill="none"
          stroke={OPENCLAW_COLORS.terminalGreen}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* CTA text */}
      <div
        style={{
          opacity: textEntrance,
          transform: `translateY(${textY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 48,
            fontWeight: 900,
            color: OPENCLAW_COLORS.text,
            lineHeight: 1.3,
            marginBottom: 20,
          }}
        >
          Eksperymentuj bezpiecznie
        </div>
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 30,
            fontWeight: 400,
            color: OPENCLAW_COLORS.mutedText,
            lineHeight: 1.5,
          }}
        >
          Przeczytaj pełny artykuł o bezpieczeństwie agentów AI
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          opacity: urlEntrance,
          padding: "16px 40px",
          borderRadius: 16,
          background: `${OPENCLAW_COLORS.darkSurface}cc`,
          border: `2px solid ${OPENCLAW_COLORS.terminalGreen}30`,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.heading,
            fontSize: 28,
            fontWeight: 700,
            color: OPENCLAW_COLORS.terminalGreen,
          }}
        >
          pawel.lipowczan.pl
        </span>
      </div>
    </div>
  );
};

// --- Main component ---

export const SafeStepsCarousel = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background glow animation
  const glowIntensity = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.03, 0.08]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OPENCLAW_COLORS.background,
        fontFamily: FONTS.heading,
      }}
    >
      {/* Background grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${OPENCLAW_COLORS.mutedText}08 1px, transparent 1px),
            linear-gradient(90deg, ${OPENCLAW_COLORS.mutedText}08 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated green glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "20%",
          width: 600,
          height: 600,
          marginLeft: -300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${OPENCLAW_COLORS.terminalGreen}${Math.floor(glowIntensity * 255)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Scanline overlay */}
      <ScanlineOverlay opacity={0.04} />

      {/* Slides */}
      {SLIDES.map((slide, i) => {
        const slideOpacity = getSlideOpacity(frame, fps, i);
        if (slideOpacity <= 0) return null;

        if (slide.type === "intro") {
          return (
            <IntroSlide
              key="intro"
              opacity={slideOpacity}
              frame={frame}
              fps={fps}
            />
          );
        }

        if (slide.type === "outro") {
          return (
            <OutroSlide
              key="outro"
              opacity={slideOpacity}
              frame={frame}
              fps={fps}
            />
          );
        }

        const stepSlide = slide as StepSlide;
        return (
          <StepSlide
            key={stepSlide.stepNumber}
            slide={stepSlide}
            opacity={slideOpacity}
            frame={frame}
            fps={fps}
          />
        );
      })}

      {/* Footer URL on step slides */}
      {(() => {
        const currentSlideIndex = Math.floor(
          frame / (SLIDE_DURATION_SECONDS * fps)
        );
        if (currentSlideIndex >= 1 && currentSlideIndex <= 6) {
          const slideOpacity = getSlideOpacity(frame, fps, currentSlideIndex);
          return (
            <div
              style={{
                position: "absolute",
                bottom: 40,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                opacity: slideOpacity * 0.6,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 20,
                  fontWeight: 400,
                  color: OPENCLAW_COLORS.mutedText,
                }}
              >
                pawel.lipowczan.pl
              </span>
            </div>
          );
        }
        return null;
      })()}
    </AbsoluteFill>
  );
};
