import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";

const store = createStore(rootReducer, applyMiddleware(thunk));
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/LandingScreen";
import RegisterScreen from "./components/auth/RegisterScreen";
import MainScreen from "./components/MainScreen";
import AddScreen from "./components/main/AddScreen";
import SaveScreen from "./components/main/SaveScreen";

const Stack = createStackNavigator();

export default function App() {
  const [checkUser, setCheckUser] = useState({
    loaded: false,
    loggedIn: false,
  });
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
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

  if (!checkUser.loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading</Text>
      </View>
    );
  }

  if (!checkUser.loggedIn) {
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

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="Add" component={AddScreen} />
          <Stack.Screen name="Save" component={SaveScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
