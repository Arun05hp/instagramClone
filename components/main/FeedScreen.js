import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
const FeedScreen = ({
  currentUser,
  users,
  userFollowingLoaded,
  following,
  route,
  navigation,
}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let posts = [];
    if (userFollowingLoaded === following.length) {
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
  }, [userFollowingLoaded]);

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
  userFollowingLoaded: store.usersState.userFollowingLoaded,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(FeedScreen);
