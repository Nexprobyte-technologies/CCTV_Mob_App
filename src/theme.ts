/**
 * NetFocus design system tokens (ported from the Kotlin Compose theme).
 */

export const colors = {
  // Core brand & surveillance palette
  deepNavyBg: '#040E2E',
  midnightNavy: '#082047',
  royalBlueDark: '#032D6B',
  royalBlue: '#0056B8',
  electricCyan: '#00A8F3',
  brightSkyCyan: '#1CC8FF',
  deepBlueCtaStart: '#0066CC',
  deepBlueCtaEnd: '#003B8E',

  // Surfaces & cards
  cardNavy: '#0D2852',
  cardNavyElevated: '#113264',
  cardInputBg: '#0A2246',
  cardBorderCyan: '#2866AC',
  cardBorderActive: '#23C4FF',
  lightIceBg: '#EAF5FE',
  pureWhite: '#FFFFFF',
  softGrayBorder: '#D0DCEB',

  // Text colors
  textWhite: '#FFFFFF',
  textIceBlue: '#B5D3F4',
  textMutedBlue: '#7FA6D6',
  textInkNavy: '#07214C',
  textSlate: '#536682',

  // Semantic status colors
  onlineGreen: '#22C55E',
  onlineGreenBright: '#4ADE80',
  eventRed: '#EF4444',
  warningAmber: '#F59E0B',
  timelineNormalBlue: '#0088E8',
};

export const fontFamilies = {
  display: 'Plus Jakarta Sans',
  body: 'Plus Jakarta Sans',
  mono: 'JetBrains Mono',
};

export const typography = {
  displaySmall: { fontFamily: fontFamilies.display, fontWeight: '800' as const, fontSize: 30, lineHeight: 36, letterSpacing: -0.5 },
  headlineMedium: { fontFamily: fontFamilies.display, fontWeight: '700' as const, fontSize: 24, lineHeight: 30 },
  headlineSmall: { fontFamily: fontFamilies.display, fontWeight: '700' as const, fontSize: 20, lineHeight: 26 },
  titleLarge: { fontFamily: fontFamilies.display, fontWeight: '700' as const, fontSize: 18, lineHeight: 24 },
  titleMedium: { fontFamily: fontFamilies.display, fontWeight: '600' as const, fontSize: 16, lineHeight: 22 },
  titleSmall: { fontFamily: fontFamilies.display, fontWeight: '600' as const, fontSize: 14, lineHeight: 20 },
  bodyLarge: { fontFamily: fontFamilies.display, fontWeight: '400' as const, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fontFamilies.display, fontWeight: '400' as const, fontSize: 13, lineHeight: 18 },
  labelLarge: { fontFamily: fontFamilies.display, fontWeight: '600' as const, fontSize: 14, lineHeight: 20 },
  labelMedium: { fontFamily: fontFamilies.display, fontWeight: '500' as const, fontSize: 12, lineHeight: 16 },
  labelSmall: { fontFamily: fontFamilies.display, fontWeight: '500' as const, fontSize: 10, lineHeight: 14 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  drawerWidth: 290,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};
