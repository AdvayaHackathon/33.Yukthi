import React, { useState, useRef, useEffect } from "react";
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
    name: "Marina Beach, Chennai",
    source:
      "https://marinabeachclub.com/wp-content/uploads/2018/05/bg_atardecer_01.jpg",
  },
  {
    id: "2",
    name: "Baga Beach, Goa",
    source:
      "https://www.adotrip.com/public/images/areas/master_images/60d0813807aff-Baga_Beach_In_Goa.jpg",
  },
  {
    id: "3",
    name: "Juhu Beach, Mumbai",
    source:
      "https://apnayatra.com/wp-content/uploads/2023/08/Juhu-Beach-Mumbai.jpg",
  },
  {
    id: "4",
    name: "Kovalam Beach, Kerala",
    source:
      "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/101000/101801-Lighthouse-Beach.jpg",
  },
  {
    id: "5",
    name: "Puri Beach, Odisha",
    source:
      "https://travelmagicmoments.com/wp-content/uploads/2023/09/puri-beach.gif",
  },
  {
    id: "6",
    name: "Radhanagar Beach, Andaman",
    source:
      "https://th.bing.com/th/id/OIP.RuxRXrsCmHDdKwuvlWTiqgHaE8?rs=1&pid=ImgDetMain",
  },
  {
    id: "7",
    name: "Varkala Beach, Kerala",
    source:
      "https://th.bing.com/th/id/R.599ad5495742f802ece6253a93c548f2?rik=HMsYdQcYI%2fLtUg&riu=http%3a%2f%2fjfwonline.com%2fwp-content%2fuploads%2f2016%2f06%2fvarkala-JFW.jpg&ehk=28Ju32QC%2beo1VlOTb1eCjpRMk4XQbA00HwoRPKR5Szs%3d&risl=&pid=ImgRaw&r=0",
  },
  {
    id: "8",
    name: "Tarkarli Beach, Maharashtra",
    source:
      "https://img.onmanorama.com/content/dam/mm/en/travel/outside-kerala/images/2021/4/1/tarkarli-beach-1.jpg",
  },
  {
    id: "9",
    name: "Ramakrishna Beach, Visakhapatnam",
    source:
      "https://i.pinimg.com/originals/97/01/fe/9701fec13a8481e18839e094f17e2efb.jpg",
  },
  {
    id: "10",
    name: "Palolem Beach, Goa",
    source: "https://trot.world/wp-content/uploads/2020/07/DSC_0665-scaled.jpg",
  },
  {
    id: "11",
    name: "Colva Beach, Goa",
    source:
      "https://www.adotrip.com/public/images/areas/master_images/5c3db2c3db943-Colva_beach_goa_Boat_Point.jpg",
  },
  {
    id: "12",
    name: "Mandarmani Beach, West Bengal",
    source:
      "https://assets.zeezest.com/blogs/PROD_217_1673943390864_thumb_1000.png",
  },
  {
    id: "13",
    name: "Elliot's Beach, Chennai",
    source:
      "https://indiano.travel/wp-content/uploads/2022/04/Selective-focus-of-Edward-Elliots-Beach-simply-called-as-Elliots-Beach-and-popularly-known-as-Besant-Nagar-Beach-Chennai-TamilNadu.jpg",
  },
  {
    id: "14",
    name: "Paradise Beach, Pondicherry",
    source:
      "https://th.bing.com/th/id/OIP.vVGAO1PZ2Nih1Cg1WgNa2gAAAA?rs=1&pid=ImgDetMain",
  },
  {
    id: "15",
    name: "Auroville Beach, Pondicherry",
    source:
      "https://pondicherrytourism.co.in/images/places-to-visit/header/auroville-beach-puducherry-tourism-entry-fee-timings-holidays-reviews-header.jpg",
  },
];

const recentVisitOptions = [
  "Ottinene Beach",
  "Padubidri Beach",
  "Rushikonda Beach",
  "Kizhunna Beach",
];

const badgeOptions = [
  "popular beach",
  "most visited beach",
  "most searched beach",
  "trending beach",
];

const getRandomValue = (array) =>
  array[Math.floor(Math.random() * array.length)];
const getRandomBeaches = (data) => {
  const shuffled = data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};

const Reccomend = () => {
  const [beachList] = useState(getRandomBeaches(beachData));
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const randomRecentVisit = getRandomValue(recentVisitOptions);
  const randomBadge = getRandomValue(badgeOptions);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % beachList.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [beachList]);

  const renderItem = ({ item, index }) => (
    <View style={styles.adCard}>
      <Image
        source={{ uri: item.source }}
        style={styles.adImage}
        resizeMode="cover"
      />
      <Text style={styles.topLeftText}>
        (based on recent visit to {randomRecentVisit})
      </Text>
      <Text style={styles.beachName}>{item.name}</Text>
      <Text style={styles.badge}>{randomBadge}</Text>
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
      <Text style={styles.sectionTitle}>Recommended beaches</Text>
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
    marginBottom: 40,
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
    bottom: 10, // Distance from the bottom of the image
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

  badge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
  adPaginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },
  adPaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 4,
  },
  adPaginationDotActive: {
    backgroundColor: "white",
    width: 10,
    height: 10,
  },
  topLeftText: {
    position: "absolute",
    top: 10, // Position the text slightly below the top edge
    left: 10, // Position the text slightly away from the left edge
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)", // Add a shadow for better readability
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
    color: "white",
  },
});

export default Reccomend;
