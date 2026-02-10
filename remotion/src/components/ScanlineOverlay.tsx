export const ScanlineOverlay = ({
  opacity = 0.08,
  lineHeight = 4,
}: {
  opacity?: number;
  lineHeight?: number;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent ${lineHeight - 1}px,
          rgba(0, 0, 0, ${opacity}) ${lineHeight - 1}px,
          rgba(0, 0, 0, ${opacity}) ${lineHeight}px
        )`,
        pointerEvents: "none",
      }}
    />
  );
};
