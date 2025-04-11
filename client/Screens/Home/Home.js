import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Animated, TouchableOpacity, Text, Alert } from "react-native";
import TopBar from "./Topbar/Topbar";
import Banner from "./Banners/Banners";
import NavBar from "./Navbar";
import * as Location from 'expo-location';

const HEADER_MIN_HEIGHT = 200;
const HEADER_MAX_HEIGHT = 280; // Increased to accommodate the expanded menu
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function Home() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);


  const handleSOSPress = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      const nearestHospital = {
        name: "City General Hospital",
        location: "123 Health Street, Cityville"
      };

      Alert.alert(
        "SOS Sent Successfully",
        `Your location (${latitude}, ${longitude}) has been sent to the nearest hospital:\n\n${nearestHospital.name}\n${nearestHospital.location}\n\nEmergency Services will be calling you shortly.`,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert("Error", "Unable to get your location. Please try again.");
    }
  };


  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  const logoAndMenuOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <TopBar
          logoAndMenuOpacity={logoAndMenuOpacity}
          isMenuOpen={isMenuOpen}
          onMenuPress={toggleMenu}
        />
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={{ height: HEADER_MAX_HEIGHT }} />
        <Banner />
        {/* Add other components here */}
      </Animated.ScrollView>
      <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>
      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  }, sosButton: {
    position: 'absolute',
    right: 20,
    bottom: 80, // Adjust this value to position the button above the NavBar
    backgroundColor: 'red',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 3,
  },
  sosButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
