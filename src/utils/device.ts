const customMediaQuery = (minWidth: number) =>
  `@media (min-width: ${minWidth}px)`

export const media = {
  custom: customMediaQuery,
  md: customMediaQuery(1241),
  lg: customMediaQuery(1366),
  xl: customMediaQuery(1517),
  xxl: customMediaQuery(1707),
}