import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// --- SCREEN IMPORTS ---
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen'; 
import FeedScreen from './screens/FeedScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen'; 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * MainTabs: The "Floating Island" navigation.
 * Designed to eliminate bottom whiteness and center icons.
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // Clean look without text labels
        tabBarStyle: styles.floatingIsland,
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'car-sport' : 'car-sport-outline';
          } else if (route.name === 'ChatList') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          }

          return (
            <View style={[styles.pill, focused && styles.activePill]}>
              <Ionicons 
                name={iconName} 
                size={26} 
                color={focused ? '#004D26' : '#FFCC33'} // Gold for inactive icons
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={FeedScreen} 
        listeners={{ 
          tabPress: () => Platform.OS !== 'web' && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) 
        }}
      />
      <Tab.Screen 
        name="ChatList" 
        component={ChatScreen} 
        listeners={{ 
          tabPress: () => Platform.OS !== 'web' && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) 
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        listeners={{ 
          tabPress: () => Platform.OS !== 'web' && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) 
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root App: Handles Auth flow and Settings modal.
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} /> 
        
        {/* App Stack */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Settings Modal - Slides up from Profile */}
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{
            presentation: 'modal', 
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            }),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  floatingIsland: {
    position: 'absolute',
    bottom: 30, // Floats above the bottom of the screen
    left: 20,
    right: 20,
    height: 70, // Fixed height for vertical centering
    backgroundColor: '#004D26', // Mason Green restored
    borderRadius: 35,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 0, // Removes Android white background/border
    paddingBottom: 0,
  },
  pill: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60, 
    height: 48, 
    borderRadius: 24,
    // Centers icons vertically inside the 70px bar
    marginTop: Platform.OS === 'ios' ? 15 : 0, 
  },
  activePill: {
    backgroundColor: '#FFCC33', // Mason Gold
    transform: [{ scale: 1.05 }],
  },
});
