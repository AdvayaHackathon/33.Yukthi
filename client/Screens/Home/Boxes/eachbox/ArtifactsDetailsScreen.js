import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ArtifactsDetailsScreen = ({ route, navigation }) => {
  const { artifact } = route.params;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      {/* Image Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageCarousel}
      >
        {artifact.images.map((img, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image
              source={img}
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.detailsContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.productName}>{artifact.name}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={18} color="#4A4A4A" />
            <Text style={styles.locationText}>{artifact.location}</Text>
          </View>
        </View>

        <View style={styles.sectionSpacing}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{artifact.description}</Text>
        </View>

        <View style={styles.sectionSpacing}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.details}>{artifact.details}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  imageCarousel: {
    width: width,
    height: width, // Square aspect ratio
  },
  imageWrapper: {
    width: width,
    height: width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  productImage: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 20,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    color: "#666666",
    marginLeft: 8,
  },
  sectionSpacing: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#4A4A4A",
    lineHeight: 24,
  },
  details: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
  },
});

export default ArtifactsDetailsScreen;
