import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

const BeachSnap = ({ navigation }) => {
  const initialPosts = [
    {
      id: "1",
      username: "Vaishnavi Kumar",
      time: "11 mins ago",
      image: require("@/assets/images/beach1.jpg"),
      likes: "1.2k",
      isLiked: false,
    },
    {
      id: "2",
      username: "Ayesha Kousar",
      time: "20 mins ago",
      image: require("@/assets/images/beach2.jpg"),
      likes: "1.8k",
      isLiked: false,
    },
    {
      id: "3",
      username: "Bhavish Kunder",
      time: "1 hour ago",
      image: require("@/assets/images/beach3.jpg"),
      likes: "5k",
      isLiked: false,
    },
  ];

  const [posts, setPosts] = useState(initialPosts);

  const toggleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, isLiked: !post.isLiked } : post
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={18} color="#FF4C4C" />
          <Text style={styles.locationText}>Malpe beach, Udupi, Karnataka</Text>
        </View>
      </View>

      {/* Snap of the Week Button */}
      <View style={styles.snapButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonText}>Snap of the week</Text>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <Ionicons name="person-circle-outline" size={40} color="#999" />
              <View style={styles.userDetails}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
            <Image source={item.image} style={styles.postImage} />
            <View style={styles.likesContainer}>
              <TouchableOpacity onPress={() => toggleLike(item.id)}>
                <FontAwesome
                  name={item.isLiked ? "heart" : "heart-o"}
                  size={20}
                  color={item.isLiked ? "red" : "black"}
                />
              </TouchableOpacity>
              <Text style={styles.likes}>{item.likes} likes</Text>
            </View>
          </View>
        )}
      />
      {/* Floating Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="flower" size={24} color="#d11d1d" />
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="camera-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BeachSnap; // Corrected this line

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BCE2D1",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  logo: {
    top: 20,
    left: 8,
    width: 70,
    height: 50,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 15,
    right: 20,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  backButton: {
    position: "absolute",
    bottom: 8,
    left: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  lightningButton: {
    position: "absolute",
    right: 15,
  },
  snapButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 50,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userDetails: {
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 14,
    color: "#777",
  },
  postImage: {
    width: "100%",
    height: screenWidth * 0.6,
    borderRadius: 10,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  likes: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: "#1e2758",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D3D3D3",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconButton: {
    padding: 10,
  },
  separator: {
    width: 1,
    backgroundColor: "#000",
    height: "80%",
    marginHorizontal: 5,
  },
});
