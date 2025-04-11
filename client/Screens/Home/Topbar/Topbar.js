import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../../components/SearchBar";
import Boxes from "../Boxes/Boxes";
import { DynamicBackground } from "./Dynback";

export default function TopBar({
  logoAndMenuOpacity,
  isMenuOpen,
  onMenuPress,
}) {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const menuHeight = isMenuOpen ? 100 : 0;

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const filteredBeaches = beachData.features.filter((beach) =>
        beach.properties.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredBeaches);
    } else {
      setSuggestions([]);
    }
  };

  const selectBeach = (beach) => {
    setSearchQuery(beach.properties.name);
    setSuggestions([]);
    navigation.navigate("Maps", { selectedBeach: beach });
  };

  const handleSubmit = () => {
    if (suggestions.length > 0) {
      selectBeach(suggestions[0]);
    }
  };

  return (
    <View style={styles.container}>
      <DynamicBackground>
        <Animated.View
          style={[styles.topSection, { opacity: logoAndMenuOpacity }]}
        >
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={onMenuPress}>
            <Image
              source={require("@/assets/images/menu.png")}
              style={styles.menuIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            styles.menuContainer,
            { height: menuHeight, opacity: isMenuOpen ? 1 : 0 },
          ]}
        >
          <Boxes />
        </Animated.View>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search beaches"
            onSubmit={handleSubmit}
          />
        </View>
        {suggestions.length > 0 && (
          <FlatList
            style={styles.suggestionsList}
            data={suggestions}
            keyExtractor={(item) => item.properties.name}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectBeach(item)}>
                <View style={styles.suggestionItem}>
                  <Image
                    source={{
                      uri:
                        item.properties.icon ||
                        "https://via.placeholder.com/50",
                    }}
                    style={styles.beachImage}
                  />
                  <Text style={styles.suggestionText}>
                    {item.properties.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </DynamicBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ADD8E0",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 100,
  },
  logo: {
    width: 90,
    height: 95,
  },
  menuIcon: {
    width: 50,
    height: 60,
  },
  menuContainer: {
    overflow: "hidden",
    justifyContent: "center",
  },
  searchBarWrapper: {
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 5,
  },
  suggestionsList: {
    backgroundColor: "#FFFFFF",
    maxHeight: 200,
    borderRadius: 10,
    borderColor: "#4EACEA",
    borderWidth: 1,
    marginHorizontal: 25,
    marginBottom: 15,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  beachImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: "#666666",
  },
});
