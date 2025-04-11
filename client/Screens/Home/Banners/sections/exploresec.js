import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, FlatList } from 'react-native';
import { getLocationAndFetchBeaches } from './exploreapi';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.87;
const CARD_HEIGHT = height * 0.28;
const SPACING = 5;

const ExploreSec = () => {
  const [exploreData, setExploreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchBeaches = async () => {
      try {
        const beaches = await getLocationAndFetchBeaches();
        setExploreData(beaches);
      } catch (error) {
        console.error('Error fetching beaches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBeaches();
  }, []);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        if (activeIndex === exploreData.length - 1) {
          flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        } else {
          flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [activeIndex, exploreData.length, loading]);

  const renderExploreItem = ({ item, index }) => (
    <ImageBackground
      source={{ uri: item.photoUrl }}
      style={styles.card}
      imageStyle={styles.cardImage}
    >
      <Text style={styles.beachName}>{item.title}</Text>
      <Text style={styles.beachDistance}>{item.description}</Text>
      <View style={styles.paginationContainer}>
        {exploreData.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.paginationDot,
              idx === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </ImageBackground>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  if (loading) {
    return (
      <View>
        <Text style={styles.sectionTitle}>Explore</Text>
        <View style={styles.skeletonContainer}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.sectionTitle}>Explore</Text>
      <FlatList
        ref={flatListRef}
        data={exploreData}
        renderItem={renderExploreItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
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

const SkeletonCard = () => (
  <View style={[styles.card, styles.skeletonCard]}>
    <View style={styles.skeletonTitle} />
    <View style={styles.skeletonDescription} />
    <View style={styles.skeletonDistance} />
  </View>
);

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  flatListContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2 - SPACING / 0.8,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'space-between',
    marginHorizontal: SPACING / 2,
  },
  cardImage: {
    resizeMode: 'cover',
  },
  beachName: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  beachDistance: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
  },
  skeletonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonCard: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'flex-end',
    padding: 10,
  },
  skeletonTitle: {
    width: '70%',
    height: 20,
    backgroundColor: '#C0C0C0',
    marginBottom: 10,
  },
  skeletonDescription: {
    width: '100%',
    height: 15,
    backgroundColor: '#C0C0C0',
    marginBottom: 5,
  },
  skeletonDistance: {
    width: '40%',
    height: 15,
    backgroundColor: '#C0C0C0',
  },
});

export default ExploreSec;