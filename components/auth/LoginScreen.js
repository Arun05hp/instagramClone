import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import firebase from "firebase";
const LoginScreen = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const handleSignIn = () => {
    const { email, password } = userInfo;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View>
      <TextInput
        placeholder="Email"
        onChangeText={(email) => setUserInfo((prev) => ({ ...prev, email }))}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(password) =>
          setUserInfo((prev) => ({ ...prev, password }))
        }
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

export default LoginScreen;
