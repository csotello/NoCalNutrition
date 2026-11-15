import { StyleSheet } from 'react-native';
import { colors } from './colors';

const editFood = StyleSheet.create({
  content: { padding: 16, paddingBottom: 112 },
  section: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  nutrients: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 14,
  },
  nutrientEditor: {
    alignItems: 'center',
    padding: 8,
  },
  select: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: 10,
    minHeight: 30,
  },
  servingRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  additionalToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  additionalList: { paddingHorizontal: 8, paddingBottom: 8 },
  additionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  saveBar: {
    alignItems: 'center',
    padding: 8,
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
  },
  saveButton: {
    minWidth: 260,
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
  },
  saveError: { color: colors.danger, fontSize: 12, marginTop: 8 },
});

export default editFood;
