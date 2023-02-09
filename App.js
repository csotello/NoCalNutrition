import React, {useState, useRef, useEffect} from 'react';
import Tasks from './screens/Tasks';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Habits from './screens/Habits';
import Nutrition from './screens/Nutrition';
import Customize from './screens/Customize';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeBaseProvider} from 'native-base';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddFood from './screens/AddFood';

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Nutrition" component={Nutrition} />
      <HomeStack.Screen name="AddFood" component={AddFood} />
    </HomeStack.Navigator>
  );
}

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
            name="Home"
            component={HomeStackScreen}
            options={{
              headerShown: false,
              tabBarLabel: 'Nutrition',
              tabBarIcon: ({color}) => (
                <Icon name="nutrition" color={color} size={26} />
              ),
            }}
          />
          {/* <Tab.Screen
            name="Tasks"
            component={Home}
            options={{
              tabBarLabel: 'Tasks',
              tabBarIcon: ({color}) => (
                <Icon name="clipboard" color={color} size={26} />
              ),
            }} */}
          {/* /> */}
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
          {/* <Tab.Screen
            name="Customize"
            component={Customize}
            options={{
              tabBarLabel: 'Customize',
              tabBarIcon: ({color}) => (
                <Icon name="build" color={color} size={26} />
              ),
            }} */}
          {/* /> */}
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
