import React, { useEffect, useState } from "react";
import { Button, View, Text, Image, FlatList, StyleSheet } from "react-native";
import firebase from "firebase";
import { connect } from "react-redux";
const FeedScreen = ({
  currentUser,
  userFollowingLoaded,
  feed,
  following,
  route,
  navigation,
}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (userFollowingLoaded === following.length && following.length !== 0) {
      feed.sort((x, y) => {
        return x.creation - y.creation;
      });

      setPosts(feed);
      console.log("feed", feed);
    }
  }, [userFollowingLoaded, feed]);

  const onLike = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislike = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };
  console.log(posts);
  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Text style={styles.container}>{item.user.name}</Text>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />

              {item.currentUserLike ? (
                <Button
                  title="Dislike"
                  onPress={() => onDislike(item.user.uid, item.id)}
                />
              ) : (
                <Button
                  title="Like"
                  onPress={() => onLike(item.user.uid, item.id)}
                />
              )}
              <Text
                onPress={() =>
                  navigation.navigate("Comment", {
                    postId: item.id,
                    uid: item.user.uid,
                  })
                }
              >
                View Comments...
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
  },
  containerImage: {
    flex: 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  feed: store.usersState.feed,
  userFollowingLoaded: store.usersState.userFollowingLoaded,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(FeedScreen);
