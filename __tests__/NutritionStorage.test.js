import EncryptedStorage from 'react-native-encrypted-storage';
import {
  emptyNutritionDay,
  loadNutrition,
  saveNutrition,
  loadCustomFoods,
  saveCustomFoods,
} from '../storage/foodRepository';

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

it('loads an empty custom-food list when there is no saved value', async () => {
  EncryptedStorage.getItem.mockResolvedValueOnce(null);

  await expect(loadCustomFoods()).resolves.toEqual([]);
  expect(EncryptedStorage.getItem).toHaveBeenCalledWith('customFood');
});

it('round-trips custom foods using the existing storage key and shape', async () => {
  const foods = [{ UUID: 'food-1', description: 'Oats', servings: '1' }];
  EncryptedStorage.getItem.mockResolvedValueOnce(JSON.stringify(foods));

  await expect(loadCustomFoods()).resolves.toEqual(foods);
  await saveCustomFoods(foods);

  expect(EncryptedStorage.setItem).toHaveBeenCalledWith(
    'customFood',
    JSON.stringify(foods),
  );
});

it('rejects malformed custom foods and invalid nutrient values', async () => {
  EncryptedStorage.getItem.mockResolvedValueOnce(JSON.stringify({ foods: [] }));
  await expect(loadCustomFoods()).rejects.toThrow(
    'Stored custom foods must be an array.',
  );

  EncryptedStorage.getItem.mockResolvedValueOnce(
    '[{"description":"Oats","foodNutrients":[{"nutrientName":"Protein","value":"3"}]}]',
  );
  await expect(loadCustomFoods()).rejects.toThrow(
    'must have a finite numeric value',
  );
});

it('rejects invalid food records and nutrient arrays when saving nutrition', async () => {
  const invalidNutrition = {
    ...emptyNutritionDay(),
    Breakfast: [{ description: 'Oats', foodNutrients: {} }],
  };

  await expect(
    saveNutrition('2026-11-15', invalidNutrition),
  ).rejects.toThrow('nutrients must be an array');
  expect(EncryptedStorage.setItem).not.toHaveBeenCalled();
});

it('rejects invalid nested nutrition records and serving values', async () => {
  EncryptedStorage.getItem.mockResolvedValueOnce(
    JSON.stringify({ Breakfast: [null] }),
  );
  await expect(loadNutrition('2026-11-15')).rejects.toThrow(
    'food 0 must be an object',
  );

  EncryptedStorage.getItem.mockResolvedValueOnce(
    JSON.stringify({ Breakfast: [{ servings: 'many' }] }),
  );
  await expect(loadNutrition('2026-11-15')).rejects.toThrow(
    'invalid serving values',
  );

  EncryptedStorage.getItem.mockResolvedValueOnce(
    JSON.stringify({
      Breakfast: [{ foodNutrients: [null] }],
    }),
  );
  await expect(loadNutrition('2026-11-15')).rejects.toThrow(
    'nutrient 0 must be an object',
  );
});

it('propagates custom-food storage read and write errors', async () => {
  EncryptedStorage.getItem.mockRejectedValueOnce(new Error('custom read failed'));
  EncryptedStorage.setItem.mockRejectedValueOnce(
    new Error('custom write failed'),
  );

  await expect(loadCustomFoods()).rejects.toThrow('custom read failed');
  await expect(saveCustomFoods([])).rejects.toThrow('custom write failed');
});
