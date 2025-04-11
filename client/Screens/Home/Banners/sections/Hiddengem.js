import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from "react-native";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.87;
const CARD_HEIGHT = height * 0.28;
const SPACING = 5;

const beachData = [
  {
    id: "1",
    name: "Kapu Beach, Karnataka",
    source:
      "https://img.veenaworld.com/wp-content/uploads/2021/05/Kaup-Beach-1152x768.jpg?imwidth=1080",
    description: "A serene beach with golden sands and peaceful waters.",
  },
  {
    id: "2",
    name: "Bangaram Beach, Lakshadweep",
    source:
      "https://assets.traveltriangle.com/blog/wp-content/uploads/2017/07/Best-time-to-visit-Bangram-Island-in-Lakshadweep-KB6592.jpg",
    description: "Known for its crystal-clear water and pristine beauty.",
  },
  {
    id: "3",
    name: "Sandy Beach, Andaman and Nicobar Islands",
    source:
      "https://static.wanderon.in/wp-content/uploads/2023/08/untitled-design-2023-08-05t101132.569-min.png",
    description: "A secluded beach, perfect for a peaceful retreat.",
  },
  {
    id: "4",
    name: "Butterfly Beach, Goa",
    source:
      "https://th.bing.com/th/id/OIP.4RKgpEFUzg9dE9tujFLk_AAAAA?rs=1&pid=ImgDetMain",
    description:
      "Famous for its butterfly-shaped coastline and vibrant sunsets.",
  },
  {
    id: "5",
    name: "Puri Beach, Odisha",
    source:
      "https://travelmagicmoments.com/wp-content/uploads/2023/09/puri-beach.gif",
    description:
      "A spiritual destination with a beautiful view of the Bay of Bengal.",
  },
  {
    id: "6",
    name: "Guhagar Beach, Maharashtra",
    source:
      "https://th.bing.com/th/id/OIP.96XZUR-b8OPqdFXu_lPpIAAAAA?rs=1&pid=ImgDetMain",
    description: "A peaceful and less crowded beach, ideal for relaxation.",
  },
  {
    id: "7",
    name: "Vypin Island Beach, Kerala",
    source:
      "https://th.bing.com/th/id/OIP.cq4z1e8J179HS2F0rkBfbAHaEK?rs=1&pid=ImgDetMain",
    description:
      "A tranquil beach surrounded by lush greenery and calm waters.",
  },
  {
    id: "8",
    name: "Chandipur Beach, Odisha",
    source:
      "https://th.bing.com/th/id/OIP.l_OCl8xLaNLbVKLks4JtFQHaEL?rs=1&pid=ImgDetMain",
    description: "Known for its unique disappearing sea phenomenon.",
  },
  {
    id: "9",
    name: "Ramakrishna Beach, Visakhapatnam",
    source:
      "https://i.pinimg.com/originals/97/01/fe/9701fec13a8481e18839e094f17e2efb.jpg",
    description: "A popular beach with calm waters and beautiful sunsets.",
  },
  {
    id: "10",
    name: "Maravanthe Beach, Karnataka",
    source: "https://i.ytimg.com/vi/WASRaClIbjs/maxresdefault.jpg",
    description:
      "A unique beach where the Arabian Sea and the Souparnika river meet.",
  },
];

const getRandomBeaches = (data) => {
  const shuffled = data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};

const UnexploredBeaches = () => {
  const [beachList] = useState(getRandomBeaches(beachData)); // Use state to store random beaches
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % beachList.length);
      flatListRef.current.scrollToIndex({
        index: (activeIndex + 1) % beachList.length,
        animated: true,
      });
    }, 2000);

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [activeIndex, beachList.length]);

  const renderItem = ({ item, index }) => (
    <View style={styles.adCard}>
      <Image
        source={{ uri: item.source }}
        style={styles.adImage}
        resizeMode="cover"
      />
      <Text style={styles.beachName}>{item.name}</Text>
      <Text style={styles.beachDescription}>{item.description}</Text>
      <View style={styles.adPaginationContainer}>
        {beachList.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.adPaginationDot,
              idx === index && styles.adPaginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.sectionTitle}>Hidden Gem Beaches</Text>
      <FlatList
        ref={flatListRef}
        data={beachList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        contentContainerStyle={styles.flatListContent}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + SPACING,
          offset: (CARD_WIDTH + SPACING) * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "black",
  },
  flatListContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2 - SPACING / 0.8,
  },
  adCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: SPACING / 2,
  },
  adImage: {
    width: "100%",
    height: "100%",
  },
  beachName: {
    position: "absolute",
    top: 10, // Distance from the top of the image
    left: 10, // Distance from the left of the image
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Shadow for better visibility
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Background for better contrast
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  beachDescription: {
    position: "absolute",
    bottom: 30, // Increased distance from the bottom to prevent overlap with pagination dots
    left: 10, // Distance from the left of the image
    fontSize: 14,
    fontWeight: "normal",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  adPaginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    left: 10,
  },
  adPaginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    margin: 3,
  },
  adPaginationDotActive: {
    backgroundColor: "#fff",
  },
});

export default UnexploredBeaches;
