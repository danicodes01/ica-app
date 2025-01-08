export const getRelativePosition = (
    width: number,
    height: number,
    percentX: number,
    percentY: number,
  ): { x: number; y: number; radius: number } => ({
    x: width * percentX,
    y: height * percentY,
    radius: Math.min(width, height) * 0.05, // 5% of the smallest dimension
  });