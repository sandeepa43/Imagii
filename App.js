import React from 'react';
import { View, StyleSheet, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DisplayImagesComponent from "./src/components/DisplayImage";
import CameraComponent from './src/components/Camera'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context"
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={CameraComponent} />
          <Tab.Screen name="Gallery" component={DisplayImagesComponent} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  notchStyle: {
    flex: 1,
    backgroundColor: 'blue'
  }

});
