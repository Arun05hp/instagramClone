import React, { useEffect, useState } from "react";
import { Button, View, Text, Image, FlatList, StyleSheet } from "react-native";
import firebase from "firebase";
import { connect } from "react-redux";
const FeedScreen = ({ currentUser, users, userLoaded, following, route }) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [userfollowing, setUserFollowing] = useState(false);

  useEffect(() => {
    let posts = [];
    if (userLoaded === following.length) {
      for (let i = 0; i < following.length; i++) {
        const user = users.find((el) => el.uid === following[i]);

        if (user != undefined) {
          posts = [...posts, ...user.posts];
        }
      }
      posts.sort((x, y) => {
        return x.creation - y.creation;
      });
      console.log(posts);
      setPosts(posts);
    }
  }, [userLoaded]);

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
  users: store.usersState.users,
  userLoaded: store.usersState.userLoaded,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(FeedScreen);
