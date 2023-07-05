import React from 'react';
import Tasks from './screens/Tasks';
import AddFood from './screens/AddFood';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Habits from './screens/Habits';
import Nutrition from './screens/Nutrition';
import Settings from './screens/Settings';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeBaseProvider} from 'native-base';
import styles from './styles/styles';

const App = () => {
  const Tab = createMaterialBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const MainTabs = () => {
    return (
      <Tab.Navigator
        activeColor={styles.navigator.activeColor}
        barStyle={{backgroundColor: styles.navigator.backgroundColor}}>
        <Tab.Screen
          name="Nutrition"
          component={Nutrition}
          options={{
            tabBarLabel: 'Nutrition',
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <Icon
                name="nutrition"
                color={focused ? 'black' : 'white'}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({focused}) => (
              <Icon
                name="build"
                color={focused ? 'black' : 'white'}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={MainTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Habits" component={Habits} />
          <Stack.Screen name="AddFood" component={AddFood} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );

  //         {/* <Tab.Screen
  //           name="Tasks"
  //           component={Tasks}
  //           options={{
  //             tabBarLabel: 'Tasks',
  //             tabBarIcon: ({focused}) => (
  //               <Icon
  //                 name="clipboard"
  //                 color={focused ? 'black' : 'white'}
  //                 size={26}
  //               />
  //             ),
  //           }}
  //         /> */}
  //         {/*<Tab.Screen
  //           name="Habits"
  //           component={Habits}
  //           options={{
  //             tabBarLabel: 'Habits',
  //             tabBarIcon: ({color}) => (
  //               <Icon name="calendar" color={color} size={26} />
  //             ),
  //           }}
  //         /> */}
};

export default App;
