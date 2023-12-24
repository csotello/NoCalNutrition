import 'react-native-gesture-handler';
import React from 'react';
import type {PropsWithChildren} from 'react';
import {useColorScheme} from 'react-native';
import {Habits} from './screens/Habits';
import {Nutrition} from './screens/Nutrition';
import {Settings} from './screens/Settings';
import {AddFood} from './screens/AddFood';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles/styles';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import {NavigationContainer} from '@react-navigation/native';

import {Task} from './components/Task';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
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
          // initialParams={{date: new Date().toDateString()}}
          options={{
            tabBarLabel: 'Nutrition',
            // headerShown: false,
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
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={MainTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Habits"
            component={Habits}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddFood"
            component={AddFood}
            // options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
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
}

//   return (
//     <NavigationContainer>
//       <GluestackUIProvider config={config}>

//       </GluestackUIProvider>
//     </NavigationContainer>
//   );
// }

export default App;
