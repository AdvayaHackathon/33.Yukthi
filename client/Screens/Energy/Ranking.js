import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function CustomScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    const loadJsonData = async () => {
      try {
        const jsonData = require("../../stations.json");
        setData(jsonData);
      } catch (error) {
        console.error("Failed to load stations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJsonData();
  }, []);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min((currentPage + 1) * ITEMS_PER_PAGE, data.length);

  const groupedData = data.reduce((acc, item, index) => {
    const groupIndex = Math.floor(index / ITEMS_PER_PAGE);
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(item);
    return acc;
  }, []);

  const renderStationItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.stationRow}
      onPress={() => navigation.navigate("Dashboard", { station: item })}
    >
      <LinearGradient
        colors={["#f0f8ff", "#e6f3ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.stationCard}
      >
        <Text style={styles.stationName}>{item.Station}</Text>
        <View style={styles.rankContainer}>
          <Text style={styles.powerRank}>Rank {item["Power Rank"]}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCard = ({ item, index }) => (
    <View style={styles.card}>
      <LinearGradient
        colors={["#4a90e2", "#3498db"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardHeader}
      >
        <Text style={styles.headerTitle}>Top Stations</Text>
        <AntDesign name="barchart" size={24} color="#ffffff" />
      </LinearGradient>
      <FlatList
        data={item}
        renderItem={renderStationItem}
        keyExtractor={(station, stationIndex) => `${index}-${stationIndex}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.stationList}
      />
      <View style={styles.cardFooter}>
        <Text style={styles.paginationText}>
          Page {currentPage + 1} of {totalPages}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={groupedData}
        renderItem={renderCard}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        decelerationRate="fast"
        snapToAlignment="start"
        contentContainerStyle={styles.cardList}
        onMomentumScrollEnd={(e) => {
          const newPage = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentPage(newPage);
        }}
        scrollEventThrottle={64}
        onScroll={(e) => {
          const newPage = Math.round(e.nativeEvent.contentOffset.x / width);
          if (newPage !== currentPage) {
            setCurrentPage(newPage);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardList: {},
  card: {
    width: width,
    height: height + 30,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  stationList: {
    padding: 10,
    flexGrow: 1,
  },
  stationRow: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  stationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    paddingHorizontal: 15,
    height: 53,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
  rankContainer: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  powerRank: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    marginBottom: -10,
  },
  paginationText: {
    fontSize: 14,
    color: "#4a90e2",
    fontWeight: "600",
  },
});
