import { Button, Input, InputField } from '@gluestack-ui/themed';
import { API_KEY } from '@env';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, Pressable, ScrollView, Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getMainNutrients } from '../utils';
import styles from '../styles/styles';
import searchStyles from '../styles/search';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

interface SearchFoodProps {
  date: string;
}

export function SearchFood(props: SearchFoodProps): React.JSX.Element {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);

  type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<RootNavigation>();

  async function search(food: string) {
    const query = food.trim();
    if (!query) return;
    setLoading(true);
    setHasSearched(true);
    setSearchFailed(false);
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
      query,
    )}&api_key=${API_KEY}&pageSize=8&dataType=Branded`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(Array.isArray(data.foods) ? data.foods : []);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
      setSearchFailed(true);
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  }

  return (
    <View style={searchStyles.content}>
      <Text style={[styles.screenHeading, styles.typography.whiteText]}>Find a food</Text>
      <View style={searchStyles.queryRow}>
        <Input style={[styles.field, searchStyles.queryField]}>
          <InputField
            value={text}
            onChangeText={setText}
            color={styles.colors.text}
            placeholder="Cheese"
            placeholderTextColor={styles.colors.textMuted}
            returnKeyType="search"
            onSubmitEditing={() => search(text)}
          />
        </Input>
        <Button
          style={searchStyles.searchButton}
          isDisabled={loading}
          onPress={() => search(text)}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Searching…' : 'Search'}
          </Text>
        </Button>
      </View>
      {loading && <Text style={searchStyles.message}>Searching foods…</Text>}
      {!loading && hasSearched && searchFailed && (
        <Text style={searchStyles.message}>
          Search failed. Check your connection and try again.
        </Text>
      )}
      {!loading &&
        hasSearched &&
        !searchFailed &&
        searchResults.length === 0 && (
          <Text style={searchStyles.message}>
            No foods found. Try another search.
          </Text>
        )}
      {searchResults.length > 0 && (
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          {searchResults.map((item, index) => {
            const nutrients = getMainNutrients(item);
            return (
              <Pressable
                key={item.fdcId || `${item.description}-${index}`}
                accessibilityRole="button"
                accessibilityLabel={`Add ${item.description}`}
                onPress={() =>
                  navigation.push('AddFood', {
                    page: 'edit',
                    food: item,
                    isNew: true,
                    date: props.date,
                    isCustom: false,
                  })
                }
                style={searchStyles.resultCard}
              >
                <Text style={searchStyles.resultTitle}>
                  {item.description}
                </Text>
                {!!item.brandName && (
                  <Text style={searchStyles.resultDetail}>
                    {item.brandName}
                  </Text>
                )}
                <View style={searchStyles.resultFooter}>
                  <View>
                    {!!item.servingSize && !!item.servingSizeUnit && (
                      <Text style={searchStyles.resultDetail}>
                        {Number(item.servingSize).toFixed(2)}{' '}
                        {item.servingSizeUnit}
                      </Text>
                    )}
                    {!!item.householdServingFullText && (
                      <Text style={searchStyles.resultDetail}>
                        {item.householdServingFullText}
                      </Text>
                    )}
                  </View>
                  <View style={searchStyles.macros}>
                    <View style={searchStyles.macroItem}>
                      <Text style={searchStyles.macroLabel}>P</Text>
                      <Text style={searchStyles.macro}>
                        {nutrients.protein?.value || 0}
                      </Text>
                    </View>
                    <View style={searchStyles.macroItem}>
                      <Text style={searchStyles.macroLabel}>C</Text>
                      <Text style={searchStyles.macro}>
                        {nutrients.carbs?.value || 0}
                      </Text>
                    </View>
                    <View style={searchStyles.macroItem}>
                      <Text style={searchStyles.macroLabel}>F</Text>
                      <Text style={searchStyles.macro}>
                        {nutrients.fat?.value || 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
