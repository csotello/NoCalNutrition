import React,{useState,useRef, useEffect} from 'react';
import Home from './screens/Home'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const App = () => {
  const Tab = createBottomTabNavigator()
  return(
    <NavigationContainer>
    <Tab.Navigator>
        <Tab.Screen name="Tasks" component={Home} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App;
