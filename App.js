import React,{useState,useRef, useEffect} from 'react';
import Home from './screens/Home'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Habits from './screens/Habits';
import Customize from './screens/Customize';

const App = () => {
  const Tab = createBottomTabNavigator()
  return(
    <NavigationContainer>
    <Tab.Navigator>
        <Tab.Screen name="Tasks" component={Home} />
        <Tab.Screen name="Habits" component={Habits} />
        <Tab.Screen name="Customize" component={Customize} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App;
