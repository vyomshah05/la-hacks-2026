import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screenBackground: {
    backgroundColor: colors.background,
  },
  homeScrollBackground: {
    backgroundColor: colors.primary,
  },
  content: {
    gap: 20,
    padding: spacing.screenX,
  },
  noPadding: {
    padding: 0,
  },
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
  padded: {
    gap: 20,
    padding: spacing.screenX,
  },
  homeBody: {
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  withFooter: {
    paddingBottom: 120,
  },
  footer: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    paddingHorizontal: spacing.screenX,
    paddingTop: 16,
  },
  footerNote: {
    marginBottom: 4,
  },
  heroIcon: {
    height: 64,
    width: 64,
  },
  mutedLead: {
    color: colors.mutedForeground,
    fontSize: 17,
    lineHeight: 25,
  },
  stack: {
    gap: 14,
    marginTop: 16,
  },
  stackLarge: {
    gap: 16,
    marginTop: 24,
  },
  cardRow: {
    alignItems: 'flex-start',
    gap: 14,
  },
  gap: {
    gap: 12,
  },
  gapSmall: {
    gap: 6,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  between: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  center: {
    textAlign: 'center',
  },
  topGap: {
    marginTop: 12,
  },
  topGapSmall: {
    marginTop: 6,
  },
  homeHero: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingBottom: 20,
  },
  aiHero: {
    position: 'relative',
  },
  whiteText: {
    color: colors.white,
  },
  whiteMuted: {
    color: '#ffffffb8',
    fontSize: 14,
  },
  raisedCard: {
    marginTop: -40,
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  homeStatusCard: {
    marginTop: 12,
  },
  statusRow: {
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionTile: {
    alignItems: 'center',
    borderRadius: 20,
    flexBasis: '47%',
    gap: 12,
    minHeight: 126,
    justifyContent: 'center',
    padding: 18,
  },
  actionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  mapPreview: {
    alignItems: 'center',
    backgroundColor: '#e6f0e2',
    borderRadius: 16,
    height: 190,
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  mapPreviewLarge: {
    height: 280,
  },
  mapRing: {
    alignItems: 'center',
    borderColor: '#2f7d4f55',
    borderRadius: 70,
    borderStyle: 'dashed',
    borderWidth: 4,
    height: 118,
    justifyContent: 'center',
    width: 118,
  },
  mapDot: {
    borderRadius: 999,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  routeLine: {
    backgroundColor: '#2f7d4f55',
    borderRadius: 999,
    height: 5,
    position: 'absolute',
    transform: [{ rotate: '-18deg' }],
    width: '70%',
  },
  linkText: {
    color: colors.primary,
    fontWeight: '700',
  },
  checkCircle: {
    alignItems: 'center',
    borderRadius: 999,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  listItem: {
    marginBottom: 12,
  },
  mapCanvas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e7efe4',
    justifyContent: 'center',
    padding: 24,
  },
  mapControls: {
    gap: 16,
    paddingTop: 6,
  },
  mapSheet: {
    shadowColor: colors.black,
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
  },
  input: {
    color: colors.foreground,
    flex: 1,
    minHeight: 48,
  },
  chipButton: {
    borderColor: colors.border,
    borderWidth: 1,
    minHeight: 44,
  },
  darkButtonText: {
    color: colors.foreground,
    fontWeight: '700',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  featureRow: {
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  progressTrack: {
    backgroundColor: colors.muted,
    borderRadius: 999,
    height: 8,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: '100%',
  },
  warningHero: {
    backgroundColor: '#fff7ed',
    gap: 18,
    padding: 24,
  },
  wideAction: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 14,
    padding: 20,
  },
  wideActionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  wideActionSub: {
    color: '#ffffffb8',
    fontSize: 12,
  },
  tipBox: {
    backgroundColor: `${colors.primary}0f`,
    borderColor: `${colors.primary}33`,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  arScreen: {
    backgroundColor: '#334155',
    flex: 1,
  },
  glassBadge: {
    backgroundColor: '#00000088',
    borderColor: '#ffffff33',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  glassButton: {
    backgroundColor: '#00000077',
    borderColor: '#ffffff33',
  },
  glassText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  glassTextLarge: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  glassPill: {
    alignItems: 'center',
    backgroundColor: '#00000099',
    borderColor: '#ffffff33',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  arCenter: {
    alignItems: 'center',
    flex: 1,
    gap: 18,
    justifyContent: 'center',
  },
  compassCircle: {
    alignItems: 'center',
    backgroundColor: '#2f7d4f44',
    borderColor: colors.primary,
    borderRadius: 80,
    borderWidth: 4,
    height: 150,
    justifyContent: 'center',
    width: 150,
  },
  arDistance: {
    color: colors.white,
    fontSize: 64,
    fontWeight: '800',
  },
  successPill: {
    backgroundColor: `${colors.success}dd`,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  successPillText: {
    color: colors.white,
    fontWeight: '700',
  },
  arFooter: {
    backgroundColor: '#00000099',
    borderColor: '#ffffff33',
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  metricLabel: {
    color: '#ffffffaa',
    fontSize: 12,
  },
  metricValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  primaryHeader: {
    backgroundColor: colors.primary,
    gap: 14,
    padding: 24,
  },
  dangerHeader: {
    backgroundColor: colors.destructive,
    gap: 14,
    padding: 24,
  },
  headerBack: {
    backgroundColor: '#ffffff22',
    borderColor: '#ffffff33',
  },
  headerClose: {
    alignSelf: 'flex-end',
  },
  aiHeaderClose: {
    position: 'absolute',
    right: 24,
    zIndex: 1,
  },
  headerPill: {
    alignItems: 'center',
    backgroundColor: '#ffffff22',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  headerPillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  chatScrollContent: {
    flexGrow: 1,
  },
  chatContent: {
    flexGrow: 1,
    gap: 16,
    padding: 24,
  },
  chatInputBar: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  chatInput: {
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.foreground,
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  suggestion: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: '47%',
    padding: 14,
  },
  chatRow: {
    alignItems: 'flex-start',
    gap: 10,
  },
  chatAvatar: {
    height: 34,
    width: 34,
  },
  chatBubble: {
    borderTopLeftRadius: 6,
  },
  micButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 70,
    height: 130,
    justifyContent: 'center',
    marginVertical: 18,
    width: 130,
  },
  contact: {
    backgroundColor: colors.muted,
    borderRadius: 16,
    gap: 12,
    marginBottom: 12,
    padding: 14,
  },
  nextStepCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 20,
  },
  topBorder: {
    borderColor: '#ffffff33',
    borderTopWidth: 1,
    marginTop: 18,
    paddingTop: 18,
  },
  routeStep: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  inactive: {
    opacity: 0.55,
  },
});
