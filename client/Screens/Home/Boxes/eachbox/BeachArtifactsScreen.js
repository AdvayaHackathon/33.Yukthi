import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BeachArtifactsScreen = ({ navigation }) => {
  const beachArtifacts = [
    {
      id: "1",
      name: "Conch",
      location: "Pondicherry",
      images: [
        require("@/assets/images/art (2).png"),
        require("@/assets/images/art (3).png"),
        require("@/assets/images/art (4).png"),
      ],
      description:
        "A beautiful conch shell collected from the pristine beaches of Pondicherry.",
      details:
        "Handpicked conch shell, perfect for decorative purposes. Unique natural patterns.",
    },
    {
      id: "2",
      name: "Shell Mirrors",
      location: "Udupi",
      images: [
        require("@/assets/images/art (5).png"),
        require("@/assets/images/art (6).png"),
        require("@/assets/images/art (6).png"),
      ],
      description:
        "Handcrafted mirror decorated with intricate seashell designs.",
      details:
        "Elegant wall mirror adorned with carefully arranged seashells. Brings coastal charm to any room.",
    },
    {
      id: "3",
      name: "Shell Necklace",
      location: "Mumbai",
      images: [
        require("@/assets/images/art (7).png"),
        require("@/assets/images/art (9).png"),
        require("@/assets/images/art (9).png"),
      ],
      description: "Elegant necklace made from natural seashells.",
      details:
        "Handmade necklace featuring unique, polished seashells. Perfect beach accessory.",
    },
    {
      id: "4",
      name: "Pearl Necklace",
      location: "Kanyakumari",
      images: [
        require("@/assets/images/art (12).png"),
        require("@/assets/images/art (10).png"),
        require("@/assets/images/art (11).png"),
      ],
      description: "Exquisite pearl necklace from the southern tip of India.",
      details:
        "Genuine pearl necklace, carefully selected and strung. Elegant and timeless design.",
    },
    {
      id: "5",
      name: "Loose Shells",
      location: "Malpe beach",
      images: [
        require("@/assets/images/art (15).png"),
        require("@/assets/images/art (13).png"),
        require("@/assets/images/art (14).png"),
      ],
      description: "Assorted collection of beautiful loose seashells.",
      details:
        "Diverse collection of shells, perfect for crafts, decoration, or collectors.",
    },
    {
      id: "6",
      name: "Rudraksha",
      location: "Rameswaram",
      images: [
        require("@/assets/images/art (1).png"),
        require("@/assets/images/art (16).png"),
        require("@/assets/images/art (16).png"),
      ],
      description: "Sacred Rudraksha beads from Rameswaram.",
      details:
        "Authentic Rudraksha beads with spiritual significance. Carefully sourced and processed.",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArtifacts, setFilteredArtifacts] = useState(beachArtifacts);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = beachArtifacts.filter(
      (artifact) =>
        artifact.name.toLowerCase().includes(text.toLowerCase()) ||
        artifact.location.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredArtifacts(filtered);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search artifacts by name or location"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.resultText}>
        {filteredArtifacts.length} Artifacts Found
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beach Artifacts</Text>
      </View>

      <FlatList
        data={filteredArtifacts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Artifactdetails", { artifact: item })
            }
          >
            <Image source={item.images[0]} style={styles.image} />
            <Text style={styles.artifactName}>{item.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.artifactLocation}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default BeachArtifactsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    padding: 24,
    paddingTop: 36,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  backButton: {
    padding: 5,
  },
  headerContainer: {
    padding: 15,
    backgroundColor: "#F5F5F5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  resultText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 0,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 14,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  artifactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  artifactLocation: {
    fontSize: 12,
    color: "#666",
    marginLeft: 3,
  },
});
