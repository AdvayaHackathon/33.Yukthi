import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function Index() {
  const [selectedTab, setSelectedTab] = useState("Ross Journey");
  const [selectedYear, setSelectedYear] = useState(2024);

  const years = [
    { year: 2024, image: require("@/assets/images/malpe.jpg") },
    { year: 2023, image: require("@/assets/images/sunny.jpg") },
    { year: 2022, image: require("@/assets/images/palm.jpg") },
    { year: 2021, image: require("@/assets/images/crystal.jpg") },
    { year: 2020, image: require("@/assets/images/kovalam_beach.jpg") },
  ];

  const images = [
    {
      name: "Malpe Beach",
      location: "Udupi, India",
      date: "12th January, 2024",
      image: require("@/assets/images/malpe.jpg"),
    },
    {
      name: "Sunny Coast",
      location: "Goa, India",
      date: "20th February, 2024",
      image: require("@/assets/images/sunny.jpg"),
    },
    {
      name: "Palm Bay",
      location: "North Goa, India",
      date: "15th March, 2023",
      image: require("@/assets/images/palm.jpg"),
    },
    {
      name: "Crystal Shores",
      location: "Puri Beach, India",
      date: "10th April, 2024",
      image: require("@/assets/images/crystal.jpg"),
    },
    {
      name: "Kovalam Beach",
      location: "Kerala, India",
      date: "22nd May, 2024",
      image: require("@/assets/images/kovalam_beach.jpg"),
    },
    {
      name: "Marina Beach",
      location: "Chennai, India",
      date: "8th June, 2023",
      image: require("@/assets/images/marina_beach.jpg"),
    },
    {
      name: "Varkala Beach",
      location: "Kerala, India",
      date: "30th July, 2024",
      image: require("@/assets/images/varkala_beach.jpg"),
    },
    {
      name: "Alibaug Beach",
      location: "Maharashtra, India",
      date: "17th August, 2022",
      image: require("@/assets/images/alibaug_beach.jpg"),
    },
    {
      name: "Ganpatipule Beach",
      location: "Maharashtra, India",
      date: "1st September, 2024",
      image: require("@/assets/images/ganpatipule_beach.jpg"),
    },
    {
      name: "Gokarna Beach",
      location: "Karnataka, India",
      date: "28th October, 2024",
      image: require("@/assets/images/gokarna_beach.jpg"),
    },
    {
      name: "Om Beach",
      location: "Gokarna, India",
      date: "5th November, 2023",
      image: require("@/assets/images/om_beach.jpg"),
    },
    {
      name: "Radhanagar Beach",
      location: "Andaman, India",
      date: "11th December, 2023",
      image: require("@/assets/images/radhanagar_beach.jpg"),
    },
    {
      name: "Dhanushkodi Beach",
      location: "Rameswaram, India",
      date: "7th January, 2022",
      image: require("@/assets/images/dhanushkodi_beach.jpg"),
    },
    {
      name: "Elephant Beach",
      location: "Havelock Island, India",
      date: "14th February, 2021",
      image: require("@/assets/images/elephant_beach.jpg"),
    },
    {
      name: "Colva Beach",
      location: "Goa, India",
      date: "3rd March, 2020",
      image: require("@/assets/images/colva_beach1.jpg"),
    },
    {
      name: "Kapu Beach",
      location: "Udupi, India",
      date: "18th April, 2023",
      image: require("@/assets/images/kapu_beach.jpg"),
    },
    {
      name: "Minicoy Beach",
      location: "Lakshadweep, India",
      date: "27th May, 2024",
      image: require("@/assets/images/minicoy_beach.jpg"),
    },
    {
      name: "Mandarmani Beach",
      location: "West Bengal, India",
      date: "9th June, 2023",
      image: require("@/assets/images/mandarmani_beach.jpg"),
    },
    {
      name: "Puri Beach",
      location: "Odisha, India",
      date: "16th July, 2024",
      image: require("@/assets/images/puri_beach.jpg"),
    },
    {
      name: "Murudeshwar Beach",
      location: "Karnataka, India",
      date: "4th August, 2021",
      image: require("@/assets/images/murudeshwar_beach.jpg"),
    },
    {
      name: "Murudeshwar Beach",
      location: "Karnataka, India",
      date: "4th August, 2016",
      image: require("@/assets/images/murudeshwar_beach.jpg"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")} // Replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Memories</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Left Side - Years with Images */}
        <View style={styles.yearContainer}>
          {years.map((item) => (
            <TouchableOpacity
              key={item.year}
              style={[
                styles.yearButton,
                selectedYear === item.year && styles.selectedYearButton,
              ]}
              onPress={() => setSelectedYear(item.year)}
            >
              <Image source={item.image} style={styles.yearImage} />
              <Text
                style={[
                  styles.yearText,
                  selectedYear === item.year && styles.selectedYearText,
                ]}
              >
                {item.year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Right Side - Images */}
        <ScrollView style={styles.memoriesContainer}>
          <View style={styles.imageGrid}>
            {images
              .filter((item) => item.date.includes(selectedYear.toString())) // Filter images based on the selected year
              .map((item, index) => (
                <View key={index} style={styles.card}>
                  <Image source={item.image} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardDate}>{item.date}</Text>
                </View>
              ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#ADD8E0",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    position: "absolute",
    left: 20,
    top: 40, // Matches the header's paddingTop
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  yearContainer: {
    width: 100,
    backgroundColor: "#fff",
    paddingVertical: 20,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#eee",
  },
  yearButton: {
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
  },
  selectedYearButton: {
    backgroundColor: "#F0F8FF",
  },
  yearImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  yearText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  selectedYearText: {
    color: "#ADD8E0",
    fontWeight: "bold",
  },
  memoriesContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageGrid: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#d3d3d3",
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    marginHorizontal: 10,
  },
  cardDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    marginHorizontal: 10,
  },
});
