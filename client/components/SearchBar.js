import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

export default function SearchBar({
  value,
  onChangeText,
  placeholder,
  onSubmit,
}) {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
        />
        <TouchableOpacity onPress={onSubmit}>
          <Image
            source={require("@/assets/images/search.jpeg")}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
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
