import EncryptedStorage from 'react-native-encrypted-storage';
import {
  emptyNutritionDay,
  loadNutrition,
  saveNutrition,
} from '../utils';

it('loads an empty nutrition day when there is no saved value', async () => {
  EncryptedStorage.getItem.mockResolvedValueOnce(null);

  await expect(loadNutrition('2026-11-15')).resolves.toEqual(emptyNutritionDay());
  expect(EncryptedStorage.getItem).toHaveBeenCalledWith('nutrition-2026-11-15');
});

it('normalizes missing meal arrays when loading legacy nutrition data', async () => {
  EncryptedStorage.getItem.mockResolvedValueOnce(
    JSON.stringify({ Breakfast: [{ description: 'Oats' }] }),
  );

  await expect(loadNutrition('2026-11-15')).resolves.toEqual({
    Breakfast: [{ description: 'Oats' }],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });
});

it('writes a normalized nutrition day using the existing storage key format', async () => {
  const nutrition = {
    Breakfast: [{ description: 'Oats' }],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  };

  await saveNutrition('2026-11-15', nutrition);

  expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
    'nutrition-2026-11-15',
    JSON.stringify(nutrition),
  );
});

it('rejects malformed stored nutrition instead of treating it as an empty day', async () => {
  EncryptedStorage.getItem.mockResolvedValueOnce('{broken json');

  await expect(loadNutrition('2026-11-15')).rejects.toThrow(
    'Stored nutrition for 2026-11-15 is not valid JSON',
  );
});

it('propagates encrypted storage read and write errors', async () => {
  EncryptedStorage.getItem.mockRejectedValueOnce(new Error('read failed'));
  EncryptedStorage.setItem.mockRejectedValueOnce(new Error('write failed'));

  await expect(loadNutrition('2026-11-15')).rejects.toThrow('read failed');
  await expect(saveNutrition('2026-11-15', emptyNutritionDay())).rejects.toThrow(
    'write failed',
  );
});
