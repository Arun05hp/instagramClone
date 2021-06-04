import React, { useState, useEffect } from "react";
import { Button, FlatList, TextInput, View, Text } from "react-native";
import firebase from "firebase";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreator } from "redux";
import { fetchUserData } from "../../redux/actions";

const CommentScreen = ({ route, fetchUserData }) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }
        const user = user.find((x) => x.uid === comments[i].creator);
        if (user == undefined) {
          fetchUserData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }

    if (route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(route.params.uid)
        .collection("userPosts")
        .doc(route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return {
              id,
              ...data,
            };
          });
          matchUserToComment(comments);
          setPostId(route.params.postId);
        });
    } else {
      matchUserToComment(comments);
    }
  }, [route.params.postId, users]);
  const onCommentSend = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(route.params.uid)
      .collection("userPosts")
      .doc(route.params.postId)
      .collection("comments")
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
      });
  };
  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View>
            {item.user !== undefined ? <Text>{item.user.name}</Text> : null}
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View>
        <TextInput
          placeholder="Comment..."
          onChangeText={(text) => setText(text)}
        />
        <Button title="Submit" onPress={() => onCommentSend()} />
      </View>
    </View>
  );
};

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUserData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(CommentScreen);
