// FilmSearchBar.js
import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

export default function SearchBar({ value, onSearch, onClear }) {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search beaches by name or location"
          placeholderTextColor="#999"
          value={value}
          onChangeText={onSearch} // Call onSearch when text changes
        />
        {value ? (
          <TouchableOpacity onPress={onClear}>
            <Image
              source={require("../assets/images/clear.png")} // Replace with clear icon path
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={require("../assets/images/search.png")} // Replace with search icon path
            style={styles.searchIcon}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: 0,
    paddingBottom: -10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 35,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 10,
    width: 24,
    height: 24,
  },
});
