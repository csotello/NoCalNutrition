import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import styles from '../styles/styles';
import { retrieve } from '../utils';

interface NutrientProps {
  Protein: number;
  Fat: number;
  Carbs: number;
}

const nutrientColors: Record<keyof NutrientProps, string> = {
  Protein: styles.colors.protein,
  Fat: styles.colors.fat,
  Carbs: styles.colors.carbs,
};

export function Nutrients(props: NutrientProps) {
  const [goals, setGoals] = useState<Record<keyof NutrientProps, string>>({
    Protein: '0',
    Fat: '0',
    Carbs: '0',
  });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const val = await retrieve('goals');
        const saved = val ? JSON.parse(val) : {};
        if (active) {
          setGoals({
            Protein: saved.Protein ?? '0',
            Fat: saved.Fat ?? '0',
            Carbs: saved.Carbs ?? '0',
          });
        }
      } catch {
        if (active) setGoals({ Protein: '0', Fat: '0', Carbs: '0' });
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  function nutrient(name: keyof NutrientProps) {
    const goal = Number(goals[name]);
    const current = Number(props[name]) || 0;
    const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    const color = nutrientColors[name];
    return (
      <View style={styles.nutrientRow} key={name}>
        <Text style={styles.nutrientLabel}>
          {name}  {current} / {goals[name]}
        </Text>
        <View
          style={styles.nutrientTrack}
          accessible
          accessibilityLabel={`${name}: ${current} grams of ${goals[name]} gram goal`}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: progress }}
        >
          <View
            style={{ width: `${progress}%`, height: '100%', backgroundColor: color }}
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      {nutrient('Protein')}
      {nutrient('Fat')}
      {nutrient('Carbs')}
    </View>
  );
}

export default Nutrients;
