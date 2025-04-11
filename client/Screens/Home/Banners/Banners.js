import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Dimensions, Text } from "react-native";
import ExploreSec from "./sections/exploresec";
import AdSec from "./sections/Adsec";
import SnapOfTheWeekSec from "./sections/snapoftheweek";
import Reccomend from "./sections/recommend";
import UnexploredBeaches from "./sections/Hiddengem";

const { width, height } = Dimensions.get("window");

const Banner = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for all sections
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SkeletonBanner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.exploreContainer}>
        <ExploreSec />
      </View>
      <View style={styles.exploreContainer}>
        <UnexploredBeaches />
      </View>
      <View style={styles.exploreContainer}>
        <Reccomend />
      </View>
      <View style={styles.otherSectionsContainer}>
        <AdSec />
        <View style={styles.compactSection}>
          <SnapOfTheWeekSec />
        </View>
      </View>
    </ScrollView>
  );
};

const SkeletonBanner = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonSection}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonCard} />
    </View>
    <View style={styles.skeletonSection}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonCard} />
    </View>
    <View style={styles.skeletonSection}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonCard} />
    </View>
    <View style={styles.skeletonSection}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonCard} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ded9d5",
    marginTop: -150,
  },
  exploreContainer: {
    marginTop: 50,
  },
  otherSectionsContainer: {
    marginTop: -15,
  },
  compactSection: {
    marginTop: -15,
  },
  skeletonContainer: {
    flex: 1,
    backgroundColor: "#ded9d5",
    paddingTop: 50,
    paddingHorizontal: 20,
    marginTop: -150,
  },
  skeletonSection: {
    marginBottom: 0,
  },
  skeletonTitle: {
    width: "60%",
    height: 24,
    backgroundColor: "#C0C0C0",
    marginBottom: 15,
    alignSelf: "center",
    borderRadius: 4,
  },
  skeletonCard: {
    width: "100%",
    height: height * 0.28,
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
  },
});

export default Banner;
