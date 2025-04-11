import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider } from '../Screens/Ecommerce/CartContext';

import Home from '@/Screens/Home/Home';
import Gears from '@/Screens/Ecommerce/Gears';
import Dashboard from '@/Screens/Energy/Energy';
import BeachSuitabilityMapScreen from '../Screens/Maps/MapScreen'


const Stack = createStackNavigator();

const App = () => {

  return (
    <GestureHandlerRootView style={styles.container}>
      <CartProvider>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
            <Stack.Screen name="Gears" component={Gears} options={{ title: 'Gears' }}/>
            <Stack.Screen name="Energy" component={Dashboard} options={{ headerShown: false }}/>
            <Stack.Screen name="Maps" component={BeachSuitabilityMapScreen} />
          </Stack.Navigator>
      </CartProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
