import { Button, Input, InputField } from '@gluestack-ui/themed';
import { API_KEY } from '@env';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, Pressable, ScrollView, Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getMainNutrients } from '../utils';
import { WhiteText } from '../styledComponents/WhiteText';
import styles from '../styles/styles';

interface SearchFoodProps {
  date: string;
}

export function SearchFood(props: SearchFoodProps): React.JSX.Element {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();

  async function search(food: string) {
    const query = food.trim();
    if (!query) return;
    setLoading(true);
    setHasSearched(true);
    setSearchFailed(false);
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${API_KEY}&pageSize=8&dataType=Branded`;
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
    <View style={styles.search.content}>
      <WhiteText style={styles.screenHeading}>Find a food</WhiteText>
      <View style={styles.search.queryRow}>
        <Input style={[styles.field, styles.search.queryField]}>
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
          style={styles.search.searchButton}
          isDisabled={loading}
          onPress={() => search(text)}
        >
          <Text style={styles.buttonText}>{loading ? 'Searching…' : 'Search'}</Text>
        </Button>
      </View>
      {loading && <Text style={styles.search.message}>Searching foods…</Text>}
      {!loading && hasSearched && searchFailed && (
        <Text style={styles.search.message}>Search failed. Check your connection and try again.</Text>
      )}
      {!loading && hasSearched && !searchFailed && searchResults.length === 0 && (
        <Text style={styles.search.message}>No foods found. Try another search.</Text>
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
                onPress={() => navigation.push('AddFood', {
                  page: 'edit', food: item, isNew: true, date: props.date,
                })}
                style={styles.search.resultCard}
              >
                <Text style={styles.search.resultTitle}>{item.description}</Text>
                {!!item.brandName && <Text style={styles.search.resultDetail}>{item.brandName}</Text>}
                <View style={styles.search.resultFooter}>
                  <View>
                    {!!item.servingSize && !!item.servingSizeUnit && (
                      <Text style={styles.search.resultDetail}>
                        {Number(item.servingSize).toFixed(2)} {item.servingSizeUnit}
                      </Text>
                    )}
                    {!!item.householdServingFullText && (
                      <Text style={styles.search.resultDetail}>{item.householdServingFullText}</Text>
                    )}
                  </View>
                  <View style={styles.search.macros}>
                    <View style={styles.search.macroItem}><Text style={styles.search.macroLabel}>P</Text><Text style={styles.search.macro}>{nutrients.protein?.value || 0}</Text></View>
                    <View style={styles.search.macroItem}><Text style={styles.search.macroLabel}>C</Text><Text style={styles.search.macro}>{nutrients.carbs?.value || 0}</Text></View>
                    <View style={styles.search.macroItem}><Text style={styles.search.macroLabel}>F</Text><Text style={styles.search.macro}>{nutrients.fat?.value || 0}</Text></View>
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
