import 'react-native-gesture-handler';
import React from 'react';
import type { PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { Habits } from './screens/Habits';
import { Nutrition } from './screens/Nutrition';
import { Settings } from './screens/Settings';
import { AddFood } from './screens/AddFood';
import { AddIcon, Icon, SettingsIcon } from '@gluestack-ui/themed';
import styles from './styles/styles';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { Task } from './components/Task';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const headerStyle = {
  headerStyle: {
    backgroundColor: styles.navigator.backgroundColor,
  },
  headerTitleStyle: {
    color: 'white',
  },
  headerTintColor: 'white',
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Tab = createMaterialBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const MainTabs = () => {
    return (
      <Tab.Navigator
        activeColor={styles.navigator.activeColor}
        barStyle={{ backgroundColor: styles.navigator.backgroundColor }}
      >
        <Tab.Screen
          name="Nutrition"
          component={Nutrition}
          // initialParams={{date: new Date().toDateString()}}
          options={{
            tabBarLabel: 'Nutrition',
            // headerShown: false,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Icon as={AddIcon} color={focused ? 'black' : 'white'} m={1} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Icon as={SettingsIcon} color={focused ? 'black' : 'white'} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

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
            // options={{headerShown: false}}
            options={headerStyle}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

export default App;
