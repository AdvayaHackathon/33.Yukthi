import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.3;

const snapOfTheWeekData = {
  imageName: "Malpe Beach",
  instaId: "@beachlover123", 
};

const SnapOfTheWeekSec = () => (
  <View style={styles.carouselContainer}>
    <Text style={styles.sectionTitle}>Snap of the Week</Text>
    <View style={styles.centeredCardContainer}>
      <View style={styles.card}>
        <Image
          source={require("@/assets/images/snapweek.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.imageName}>{snapOfTheWeekData.imageName}</Text>
        <View style={styles.bottomContainer}>
          <Text style={styles.snapInsta}>{snapOfTheWeekData.instaId}</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  centeredCardContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0)", // Slight overlay for better text visibility
  },
  imageName: {
    position: "absolute",
    top: 5,
    right: 5,
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 10,
  },
  snapInsta: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default SnapOfTheWeekSec;
