import React, { useEffect, useState } from "react";

import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/LandingScreen";
import RegisterScreen from "./components/auth/RegisterScreen";

const Stack = createStackNavigator();

export default function App() {
  const [checkUser, setCheckUser] = useState({
    loaded: false,
    loggedIn: false,
  });
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setCheckUser({
          loaded: true,
          loggedIn: false,
        });
      } else {
        setCheckUser({
          loaded: true,
          loggedIn: true,
        });
      }
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
