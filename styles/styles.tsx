import { StyleSheet } from 'react-native';
import { colors } from './colors';

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

const navigator = {
  activeColor: colors.accentSoft,
  backgroundColor: colors.surface,
} as const;

const typography = StyleSheet.create({
  whiteText: { color: colors.white },
  screenTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  body: { fontSize: 14, color: colors.text, lineHeight: 20 },
  muted: { fontSize: 13, color: colors.textMuted },
});

const common = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  screenContent: { padding: 16, paddingBottom: 32 },
  screenHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  field: {
    color: colors.text,
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: colors.background, fontSize: 15, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: colors.text, fontWeight: '600' },
  listItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modal: { backgroundColor: colors.surface, borderColor: colors.border },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 15,
    borderBottomWidth: 2,
    backgroundColor: colors.black,
    marginBottom: 5,
  },
  nutrient: {
    textAlign: 'center',
    fontSize: 12,
    minWidth: '30%',
    maxWidth: '30%',
    marginLeft: 5,
  },
  nutrientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  nutrientLabel: {
    width: 112,
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  nutrientTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  customFood: { width: 40, left: 10 },
  modalTab: {
    width: '34%',
    padding: 10,
    justifyContent: 'center',
    marginBottom: 10,
    textAlign: 'center',
    borderColor: colors.gray,
    elevation: 1,
    color: colors.white,
  },
  additionalNutrients: { width: '100%', color: colors.white },
});

const addFood = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTab: { backgroundColor: colors.accent, borderColor: colors.accent },
  tabText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  selectedTabText: { color: colors.background },
});

const settings = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  action: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});

const habits = StyleSheet.create({
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalField: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    marginBottom: 12,
  },
});

const habit = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  title: { color: colors.text, fontSize: 17, fontWeight: '700', flex: 1 },
  category: { color: colors.textMuted, fontSize: 13 },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    marginTop: 10,
  },
  dayText: { color: colors.background, fontWeight: '700' },
});

const task = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  row: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { color: colors.text, flex: 1, fontSize: 15 },
  input: {
    color: colors.text,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
});

const customFoods = StyleSheet.create({
  list: { width: '100%', paddingHorizontal: 12, paddingBottom: 24 },
  card: {
    width: '100%',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  details: { flex: 1, minWidth: 0, paddingRight: 4 },
  macro: { minWidth: 28, alignItems: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center' },
});

const dialogs = StyleSheet.create({
  content: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
  },
  heading: { color: colors.text },
  body: { color: colors.textMuted, fontSize: 14, lineHeight: 21 },
  footer: { flexDirection: 'row', gap: 10 },
  cancel: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
  },
  confirm: { backgroundColor: colors.accentSoft, borderRadius: 10 },
  destructive: { backgroundColor: colors.danger, borderRadius: 10 },
  destructiveText: { color: colors.background, fontWeight: '700' },
});

const styles = {
  primaryBackgroundColor: colors.legacyBackground,
  colors,
  spacing,
  navigator,
  typography,
  ...common,
  addFood,
  settings,
  habits,
  habit,
  task,
  customFoods,
  dialogs,
};

export default styles;
