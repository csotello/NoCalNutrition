import React, {useState, useRef, useEffect} from 'react';
import Home from './screens/Home';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Habits from './screens/Habits';
import Customize from './screens/Customize';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeBaseProvider} from 'native-base';

const App = () => {
  const Tab = createMaterialBottomTabNavigator();
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(111, 220, 111)',
      background: 'rgb(111, 220, 111)',
    },
  };
  return (
    <NativeBaseProvider>
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          initialRouteName="Tasks"
          activeColor="#178237"
          barStyle={{backgroundColor: '#6fdc6f'}}>
          <Tab.Screen
            name="Tasks"
            component={Home}
            options={{
              tabBarLabel: 'Tasks',
              tabBarIcon: ({color}) => (
                <Icon name="clipboard" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Habits"
            component={Habits}
            options={{
              tabBarLabel: 'Habits',
              tabBarIcon: ({color}) => (
                <Icon name="calendar" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Customize"
            component={Customize}
            options={{
              tabBarLabel: 'Customize',
              tabBarIcon: ({color}) => (
                <Icon name="build" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
