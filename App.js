import React from 'react';
import Tasks from './screens/Tasks';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Habits from './screens/Habits';
import Nutrition from './screens/Nutrition';
import Customize from './screens/Customize';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeBaseProvider} from 'native-base';
import styles from './styles/styles';

const App = () => {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          activeColor={styles.navigator.activeColor}
          barStyle={{backgroundColor: styles.navigator.backgroundColor}}>
          <Tab.Screen
            name="Home"
            component={Nutrition}
            options={{
              headerShown: false,
              shifting: true,
              tabBarLabel: 'Nutrition',
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
            name="Tasks"
            component={Tasks}
            options={{
              tabBarLabel: 'Tasks',
              tabBarIcon: ({focused}) => (
                <Icon
                  name="clipboard"
                  color={focused ? 'black' : 'white'}
                  size={26}
                />
              ),
            }}
          />
          {/*<Tab.Screen
            name="Habits"
            component={Habits}
            options={{
              tabBarLabel: 'Habits',
              tabBarIcon: ({color}) => (
                <Icon name="calendar" color={color} size={26} />
              ),
            }}
          /> */}
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
