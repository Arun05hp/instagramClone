import React, { useState } from "react";
import { View, Text, TextInput, Image, Button } from "react-native";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");
const SaveScreen = ({ route, navigation }) => {
  const { image } = route.params;
  const [caption, setCaption] = useState("");

  const uploadImage = async () => {
    const res = await fetch(image);
    const blob = await res.blob();
    const path = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(path);
    const task = firebase.storage().ref().child(path).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred:${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => navigation.popToTop());
  };
  return (
    <View style={{ flex: 1 }}>
      {image && <Image source={{ uri: image }} style={{ flex: 0.5 }} />}
      <TextInput
        placeholder="Write a Caption"
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save" onPress={uploadImage} />
    </View>
  );
};

export default SaveScreen;
