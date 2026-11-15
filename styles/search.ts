import { StyleSheet } from 'react-native';
import { colors } from './colors';

const search = StyleSheet.create({
  content: { flex: 1, padding: 16 },
  queryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  queryField: { flex: 1, marginRight: 8 },
  searchButton: {
    minHeight: 48,
    minWidth: 90,
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  resultDetail: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  macros: { flexDirection: 'row', gap: 14 },
  macro: { color: colors.text, fontSize: 12, fontWeight: '600' },
  macroItem: { minWidth: 26, alignItems: 'center' },
  macroLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  message: {
    color: colors.textMuted,
    paddingVertical: 18,
    textAlign: 'center',
  },
});

export default search;
