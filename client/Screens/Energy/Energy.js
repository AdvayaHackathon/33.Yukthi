import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const navigation = useNavigation();
  const cards = [
    {
      title: "Regions Ranking",
      subtitle: "Performance & Statistics",
      gradient: ["#E94E89", "#B6315D"],
      icon: <FontAwesome5 name="chart-line" size={50} color="#fff" />,
      route: "Ranking",
    },
    {
      title: "Partnerships",
      subtitle: "Strategic Alliances",
      gradient: ["#34D399", "#059669"],
      icon: <FontAwesome5 name="handshake" size={50} color="#fff" />,
      route: "Partnerships",
    },
    {
      title: "TIDE WIKI",
      subtitle: "Knowledge Base",
      gradient: ["#8B5CF6", "#6D28D9"],
      icon: <MaterialCommunityIcons name="wikipedia" size={50} color="#fff" />,
      route: "Wiki",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={60}
          color="#333"
          style={styles.logoIcon}
        />
        <Text style={styles.heading}>TidalPow</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(card.route)}
          >
            <View
              style={[
                styles.cardContent,
                { backgroundColor: card.gradient[0] },
              ]}
            >
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                <View style={styles.enterStore}>
                  <Text style={styles.enterStoreText}>Enter Store</Text>
                  <Text style={styles.arrowRight}>→</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>{card.icon}</View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoIcon: {
    marginRight: 10,
  },
  heading: {
    fontSize: 28,
    marginLeft: -9,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: "row",
    height: 140,
    padding: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  enterStore: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  enterStoreText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 8,
  },
  arrowRight: {
    color: "#fff",
    fontSize: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 50, // Adjusted positioning
    top: 40,
  },
});

export default Dashboard;
