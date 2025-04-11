import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const boxData = [
  { label: "Warnings", icon: "alert-outline", screen: "Warnings" },
  { label: "BeachEvents", icon: "cube-outline", screen: "BeachEvents" },
  { label: "Snap&Win", icon: "camera-outline", screen: "SnapAndWin" },
  { label: "Memories", icon: "image-multiple-outline", screen: "Memories" },
  { label: "Event Booking", icon: "video-outline", screen: "FilmShooting" },
  { label: "Artifacts", icon: "cube-outline", screen: "Artifacts" },

];

export default function Boxes() {
  const navigation = useNavigation();

  const handleBoxPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {boxData.map((box, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleBoxPress(box.screen)}
        >
          <View style={styles.box}>
            <Icon name={box.icon} size={30} color="#ADD8E0" />
            <Text style={styles.label}>{box.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 10,
  },
  box: {
    width: 90,
    height: 80,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
    padding: 5,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
});
