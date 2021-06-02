import React, { useEffect, useState } from "react";
import { Button, View, Text, Image, FlatList, StyleSheet } from "react-native";
import firebase from "firebase";
import { connect } from "react-redux";
const ProfileScreen = ({ currentUser, posts, following, route }) => {
  const [userPosts, setuserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [userfollowing, setUserFollowing] = useState(false);

  useEffect(() => {
    if (route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setuserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });
      firebase
        .firestore()
        .collection("posts")
        .doc(route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });

          setuserPosts(posts);
        });
    }
    console.log(following);
    if (following.indexOf(route.params.uid) > -1) {
      setUserFollowing(true);
    } else {
      setUserFollowing(false);
    }
  }, [route.params.uid, following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(route.params.uid)
      .set({});
  };

  const onUnFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(route.params.uid)
      .delete();
  };

  if (user === null) return <View />;
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        {route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {userfollowing ? (
              <Button title="Following" onPress={() => onUnFollow()} />
            ) : (
              <Button title="Follow" onPress={() => onFollow()} />
            )}
          </View>
        ) : null}
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image source={{ uri: item.downloadURL }} style={styles.image} />
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
    marginTop: 40,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(ProfileScreen);
