import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.87;
const CARD_HEIGHT = height * 0.28;
const SPACING = 5;

const adsData = [
  {
    id: "1",
    type: "image",
    source: require("@/assets/images/ads1.jpeg"),
    duration: 5000,
  },
  {
    id: "4",
    type: "image",
    source: require("@/assets/images/ads2.jpeg"),
    duration: 5000,
  },
  {
    id: "5",
    type: "image",
    source: require("@/assets/images/ads7.jpeg"),
    duration: 5000,
  },
];

const AdSec = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const flatListRef = useRef(null);
  const videoRef = useRef(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const currentAd = adsData[activeIndex];
    let timer;

    if (currentAd.type === "image") {
      timer = setTimeout(moveToNextSlide, currentAd.duration);
    } else if (currentAd.type === "video" && videoDuration > 0) {
      timer = setTimeout(moveToNextSlide, videoDuration * 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [activeIndex, videoDuration]);

  const moveToNextSlide = () => {
    const nextIndex = (activeIndex + 1) % adsData.length;
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setActiveIndex(nextIndex);

    if (adsData[nextIndex].type === "video") {
      setKey((prevKey) => prevKey + 1);
    }
  };

  const handleVideoLoad = (status) => {
    if (status.durationMillis) {
      setVideoDuration(status.durationMillis / 1000);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.adCard}>
      {item.type === "image" ? (
        <Image source={item.source} style={styles.adImage} resizeMode="cover" />
      ) : (
        <View style={styles.videoContainer}>
          <Video
            key={key}
            ref={videoRef}
            source={item.source}
            style={styles.adVideo}
            resizeMode="cover"
            shouldPlay={index === activeIndex}
            isLooping={false}
            isMuted={isMuted}
            onLoad={handleVideoLoad}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                moveToNextSlide();
              }
            }}
          />
          <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-medium"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.adPaginationContainer}>
        {adsData.map((_, idx) => (
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
      <Text style={styles.sectionTitle}>Ads</Text>
      <FlatList
        ref={flatListRef}
        data={adsData}
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
  videoContainer: {
    width: "100%",
    height: "100%",
  },
  adVideo: {
    width: "100%",
    height: "100%",
  },
  muteButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
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
});

export default AdSec;
