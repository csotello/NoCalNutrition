import 'react-native-gesture-handler';
import React from 'react';
import { Habits } from './screens/Habits';
import { Nutrition } from './screens/Nutrition';
import { Settings } from './screens/Settings';
import { AddFood } from './screens/AddFood';
import { AddIcon, Icon, SettingsIcon } from '@gluestack-ui/themed';
import styles from './styles/styles';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const headerStyle = {
  headerStyle: {
    backgroundColor: styles.navigator.backgroundColor,
  },
  headerTitleStyle: {
    color: styles.colors.white,
  },
  headerTintColor: styles.colors.white,
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: styles.navigator.activeColor,
        tabBarInactiveTintColor: styles.colors.textMuted,
        tabBarStyle: {
          backgroundColor: styles.navigator.backgroundColor,
          borderTopColor: styles.colors.border,
        },
        tabBarLabelStyle: { fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Nutrition"
        component={Nutrition}
        // initialParams={{date: new Date().toDateString()}}
        options={{
          tabBarLabel: 'Nutrition',
          // headerShown: false,
          tabBarIcon: ({ color }: { color: string }) => (
            <Icon as={AddIcon} color={color} m={1} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => (
            <Icon as={SettingsIcon} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function App(): React.JSX.Element {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Habits"
            component={Habits}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddFood"
            component={AddFood}
            options={headerStyle}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

export default App;
