import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '@/Screens/Home/Home';
import Gears from '@/Screens/Gears';
import Energy from '@/Screens/Energy';
import SurakshaMap from '../Screens/Map';


const Stack = createStackNavigator();

const App = () => {

  return (
    <GestureHandlerRootView style={styles.container}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
            <Stack.Screen name="Gears" component={Gears} options={{ title: 'Gears' }}/>
            <Stack.Screen name="Energy" component={Energy} options={{ headerShown: false }}/>
            <Stack.Screen name="Maps" component={SurakshaMap} />

     


          </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
