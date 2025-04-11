import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, G } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const EARLY_MORNING_START = 5;
const MORNING_START = 7;
const NOON_START = 11;
const AFTERNOON_START = 13;
const EVENING_START = 19;
const SUNSET_START = 21;
const NIGHT_START = 17;

const SUN_RISE_HOUR = 6.5;
const SUN_SET_HOUR = 18.5;

const Cloud = ({ startPosition, speed, size, top, zIndex }) => {
  const position = useRef(new Animated.Value(startPosition)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(position, {
        toValue: SCREEN_WIDTH,
        duration: speed,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          transform: [{ translateX: position }],
          top,
          zIndex,
        },
      ]}
    >
      <Image
        source={require("@/assets/images/cloud.png")}
        style={{ width: size, height: size * 0.6 }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const Sun = ({ size = 40 }) => {
  const rayLength = 15;
  const numRays = 8;

  return (
    <Svg height={size + rayLength * 2} width={size + rayLength * 2}>
      <Circle
        cx={size / 2 + rayLength}
        cy={size / 2 + rayLength}
        r={size / 2}
        fill="yellow"
      />
      <G>
        {[...Array(numRays)].map((_, i) => {
          const angle = (i * 2 * Math.PI) / numRays;
          const x1 = Math.cos(angle) * (size / 2);
          const y1 = Math.sin(angle) * (size / 2);
          const x2 = Math.cos(angle) * (size / 2 + rayLength);
          const y2 = Math.sin(angle) * (size / 2 + rayLength);
          return (
            <Path
              key={i}
              d={`M${x1 + size / 2 + rayLength} ${y1 + size / 2 + rayLength} L${
                x2 + size / 2 + rayLength
              } ${y2 + size / 2 + rayLength}`}
              stroke="yellow"
              strokeWidth="2"
            />
          );
        })}
      </G>
    </Svg>
  );
};

const Moon = ({ size = 30 }) => (
  <Svg height={size} width={size}>
    <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="#FFFFFF" />
    <Circle cx={size / 3} cy={size / 3} r={size / 6} fill="#E0E0E0" />
    <Circle
      cx={(size * 2) / 3}
      cy={(size * 2) / 3}
      r={size / 8}
      fill="#E0E0E0"
    />
  </Svg>
);

export const DynamicBackground = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const sunProgress = useRef(new Animated.Value(0)).current;
  const moonProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    let sunProg = 0;
    let moonProg = 0;

    if (hour >= SUN_RISE_HOUR && hour < SUN_SET_HOUR) {
      sunProg =
        (hour - SUN_RISE_HOUR + minute / 60) / (SUN_SET_HOUR - SUN_RISE_HOUR);
      moonProg = 0;
    } else {
      sunProg = 0;
      if (hour >= SUN_SET_HOUR) {
        moonProg =
          (hour - SUN_SET_HOUR + minute / 60) /
          (24 - SUN_SET_HOUR + SUN_RISE_HOUR);
      } else {
        moonProg =
          (hour + 24 - SUN_SET_HOUR + minute / 60) /
          (24 - SUN_SET_HOUR + SUN_RISE_HOUR);
      }
    }

    Animated.timing(sunProgress, {
      toValue: sunProg,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(moonProgress, {
      toValue: moonProg,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [currentTime]);

  const getBackgroundColors = () => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const time = hour + minute / 60;

    if (time >= EARLY_MORNING_START && time < MORNING_START) {
      // Early morning: blue to orangish-yellow
      return ["#87CEEB", "#FFA500"];
    } else if (time >= MORNING_START && time < NOON_START) {
      // Morning: blue and white gradient
      return ["#87CEEB", "#FFFFFF"];
    } else if (time >= NOON_START && time < AFTERNOON_START) {
      // Noon: intense blue and white gradient
      return ["#1E90FF", "#FFFFFF"];
    } else if (time >= AFTERNOON_START && time < EVENING_START) {
      // Afternoon: softer blue and white gradient
      return ["#F0F8FF", "#87CEEB"];
    } else if (time >= EVENING_START && time < SUNSET_START) {
      // Evening: orangish-yellow gradient
      return ["#FFA500", "#FFD700"];
    } else if (time >= SUNSET_START && time < NIGHT_START) {
      // Sunset: darker orange to purple transition
      return ["#FF4500", "#8A2BE2"];
    } else {
      // Night: dark blue with a hint of white
      return ["#191970", "#483D8B", "#FFFFFF"];
    }
  };

  const sunPositionX = sunProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, SCREEN_WIDTH / 2, SCREEN_WIDTH],
  });

  const sunPositionY = sunProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [80, 20, 80],
  });

  const moonPositionX = moonProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, SCREEN_WIDTH / 2, SCREEN_WIDTH],
  });

  const moonPositionY = moonProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [80, 20, 80],
  });

  return (
    <LinearGradient colors={getBackgroundColors()} style={styles.background}>
      <View style={styles.skyContainer}>
        <Cloud
          startPosition={-100}
          speed={25000}
          size={60}
          top={10}
          zIndex={2}
        />
        <Cloud startPosition={50} speed={30000} size={80} top={30} zIndex={2} />
        <Cloud
          startPosition={200}
          speed={28000}
          size={70}
          top={50}
          zIndex={2}
        />
        <Animated.View
          style={[
            styles.sunContainer,
            {
              transform: [
                { translateX: sunPositionX },
                { translateY: sunPositionY },
              ],
              opacity: sunProgress,
            },
          ]}
        >
          <Sun size={40} />
        </Animated.View>
        <Animated.View
          style={[
            styles.moonContainer,
            {
              transform: [
                { translateX: moonPositionX },
                { translateY: moonPositionY },
              ],
              opacity: moonProgress,
            },
          ]}
        >
          <Moon size={30} />
        </Animated.View>
      </View>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  skyContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    overflow: "hidden",
  },
  sunContainer: {
    position: "absolute",
    width: 70,
    height: 70,
    zIndex: 1,
  },
  moonContainer: {
    position: "absolute",
    width: 60,
    height: 60,
    zIndex: 1,
  },
  cloud: {
    position: "absolute",
    opacity: 0.7,
  },
});
