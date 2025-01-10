export const getRelativePosition = (
  dbPosition: { x: number; y: number },
  screenWidth: number, 
  screenHeight: number,
) => ({
  x: screenWidth * dbPosition.x,
  y: screenHeight * dbPosition.y,
  radius: Math.min(screenWidth, screenHeight) * 0.05
});

