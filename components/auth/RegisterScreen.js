import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import firebase from "firebase";
const RegisterScreen = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    name: "",
  });
  const handleSignUp = () => {
    const { email, password, name } = userInfo;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
          });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View>
      <TextInput
        placeholder="Name"
        onChangeText={(name) => setUserInfo((prev) => ({ ...prev, name }))}
      />
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
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default RegisterScreen;
