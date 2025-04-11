import React, { useState, useRef } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "@/components/FilmSearchBar";
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FilmShooting() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBeach, setSelectedBeach] = useState(null); // To store the selected beach
  const scrollViewRef = useRef(null);

  const beaches = [
    {
      name: "Malpe Beach",
      location: "Udupi, India",
      rating: "4.5",
      image: require("@/assets/images/malpe.jpg"),
    },
    {
      name: "Sunny Coast",
      location: "Goa, India",
      rating: "4.7",
      image: require("@/assets/images/sunny.jpg"),
    },
    {
      name: "Palm Bay",
      location: "North Goa, India",
      rating: "4.3",
      image: require("@/assets/images/palm.jpg"),
    },
    {
      name: "Crystal Shores",
      location: "Puri Beach, India",
      rating: "4.9",
      image: require("@/assets/images/crystal.jpg"),
    },
    {
      name: "Kovalam Beach",
      location: "Kerala, India",
      rating: "4.8",
      image: require("@/assets/images/kovalam_beach.jpg"),
    },
    {
      name: "Marina Beach",
      location: "Chennai, India",
      rating: "4.2",
      image: require("@/assets/images/marina_beach.jpg"),
    },
    {
      name: "Varkala Beach",
      location: "Kerala, India",
      rating: "4.6",
      image: require("@/assets/images/varkala_beach.jpg"),
    },
    {
      name: "Alibaug Beach",
      location: "Maharashtra, India",
      rating: "4.4",
      image: require("@/assets/images/alibaug_beach.jpg"),
    },
    {
      name: "Ganpatipule Beach",
      location: "Maharashtra, India",
      rating: "4.5",
      image: require("@/assets/images/ganpatipule_beach.jpg"),
    },
    {
      name: "Gokarna Beach",
      location: "Karnataka, India",
      rating: "4.7",
      image: require("@/assets/images/gokarna_beach.jpg"),
    },
    {
      name: "Om Beach",
      location: "Gokarna, India",
      rating: "4.8",
      image: require("@/assets/images/om_beach.jpg"),
    },
    {
      name: "Radhanagar Beach",
      location: "Andaman, India",
      rating: "4.9",
      image: require("@/assets/images/radhanagar_beach.jpg"),
    },
    {
      name: "Dhanushkodi Beach",
      location: "Rameswaram, India",
      rating: "4.6",
      image: require("@/assets/images/dhanushkodi_beach.jpg"),
    },
    {
      name: "Elephant Beach",
      location: "Havelock Island, India",
      rating: "3.7",
      image: require("@/assets/images/elephant_beach.jpg"),
    },
    {
      name: "Colva Beach",
      location: "Goa, India",
      rating: "4.2",
      image: require("@/assets/images/colva_beach1.jpg"),
    },
    {
      name: "Kapu Beach",
      location: "Udupi, India",
      rating: "4.4",
      image: require("@/assets/images/kapu_beach.jpg"),
    },
    {
      name: "Minicoy Beach",
      location: "Lakshadweep, India",
      rating: "4.8",
      image: require("@/assets/images/minicoy_beach.jpg"),
    },
    {
      name: "Mandarmani Beach",
      location: "West Bengal, India",
      rating: "4.1",
      image: require("@/assets/images/mandarmani_beach.jpg"),
    },
    {
      name: "Puri Beach",
      location: "Odisha, India",
      rating: "4.5",
      image: require("@/assets/images/puri_beach.jpg"),
    },
    {
      name: "Murudeshwar Beach",
      location: "Karnataka, India",
      rating: "4.2",
      image: require("@/assets/images/murudeshwar_beach.jpg"),
    },
  ];

  const filteredBeaches = beaches.filter(
    (beach) =>
      beach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beach.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const clearSearch = () => {
    setSearchQuery("");
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleBooking = (beach) => {
    setSelectedBeach(beach);
    navigation.navigate("Book", {
      beachName: beach.name,
      beachImage: beach.image,
      beachRating: beach.rating,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={searchQuery}
            onSearch={handleSearch}
            onClear={clearSearch}
          />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {searchQuery.length > 0 && (
          <Text style={styles.resultCount}>
            {filteredBeaches.length}{" "}
            {filteredBeaches.length === 1 ? "result" : "results"} found
          </Text>
        )}

        {filteredBeaches.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Icon name="search" size={50} color="#999" />
            <Text style={styles.noResultsText}>No beaches found</Text>
            <Text style={styles.noResultsSubText}>
              Try a different search term
            </Text>
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={clearSearch}
            >
              <Text style={styles.clearSearchButtonText}>Clear Search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredBeaches.map((beach, index) => (
            <View style={styles.imageContainer} key={index}>
              <Image source={beach.image} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.beachName}>{beach.name}</Text>
                <Text style={styles.location}>{beach.location}</Text>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={20} color="#FFD700" />
                  <Text style={styles.ratingText}> {beach.rating}/5</Text>
                </View>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBooking(beach)} // Navigate to booking directly
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d3d3d3",
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#ADD8E0",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBarWrapper: {
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 8,
  },
  resultCount: {
    padding: 15,
    color: "#666",
    fontSize: 16,
    fontStyle: "italic",
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
  },
  noResultsSubText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
  clearSearchButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#A9A9A9",
    borderRadius: 20,
  },
  clearSearchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    marginTop: 15,
    backgroundColor: "#fff",
    width: "100%",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 40,
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: "cover",
    borderRadius: 20,
  },
  textContainer: {
    marginLeft: 20,
    flex: 1,
  },
  beachName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: "#777",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 18,
    marginLeft: 5,
  },
  bookButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#007BFF", // Updated color to a vibrant blue
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
