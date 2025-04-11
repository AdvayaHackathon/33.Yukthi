import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export const RevenueCalculator = ({ power }) => {
  const [area, setArea] = useState("");
  const PRICE_PER_KWH = 8.5; // Average electricity price in INR per kWh

  const calculateRevenue = () => {
    if (!area) return 0;
    const plantArea = parseFloat(area);
    const powerInKW = (power * plantArea) / 1000; // Convert W to kW
    const dailyRevenue = powerInKW * 24 * PRICE_PER_KWH; // Daily revenue in INR
    return dailyRevenue.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Revenue Calculator</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={area}
          onChangeText={setArea}
          placeholder="Enter plant area (m²)"
          keyboardType="numeric"
          placeholderTextColor="#666"
        />
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Estimated Daily Revenue:</Text>
        <Text style={styles.resultValue}>₹ {calculateRevenue()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    color: "#333",
  },
  resultContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 16,
    color: "#666",
  },
  resultValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ecc71",
  },
});
