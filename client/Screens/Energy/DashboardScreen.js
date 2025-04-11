import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { LineChart, YAxis, XAxis, AreaChart } from "react-native-svg-charts";
import { Line, G, Defs, LinearGradient, Stop } from "react-native-svg";
import * as shape from "d3-shape";
import { RevenueCalculator } from "./RevenueCalculator";
import { FormulaModal } from "./FormulaModal";

const DashboardScreen = ({ route }) => {
  const [formulaVisible, setFormulaVisible] = useState(false);
  const { station } = route.params;
  const todayData = station.DailyData[0];
  const currentHour = new Date().getHours();

  const hourlyData = Object.entries(todayData)
    .filter(([key]) => key.match(/^\d{1,2}:00$/))
    .map(([hour, height]) => ({
      hour: parseInt(hour),
      height,
      isPast: parseInt(hour) <= currentHour,
    }))
    .sort((a, b) => a.hour - b.hour);

  const chartData = hourlyData.map((item) => item.height);

  const Gradient = () => (
    <Defs>
      <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#4a90e2" stopOpacity={0.3} />
        <Stop offset="100%" stopColor="#4a90e2" stopOpacity={0.05} />
      </LinearGradient>
    </Defs>
  );

  const CustomLine = ({ line }) => {
    const currentX = (currentHour / 23) * Dimensions.get("window").width * 0.85;
    return (
      <G>
        <Line
          x1={0}
          y1={0}
          x2={currentX}
          y2={0}
          stroke={"#4a90e2"}
          strokeWidth={2}
          strokeDasharray={[4, 0]}
        />
        <Line
          x1={currentX}
          y1={0}
          x2={Dimensions.get("window").width}
          y2={0}
          stroke={"#666"}
          strokeWidth={2}
          strokeDasharray={[4, 4]}
        />
      </G>
    );
  };

  const MetricBox = ({ title, value, unit }) => (
    <View style={styles.metricBox}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
    </View>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const renderPredictionCard = ({ item }) => (
    <View style={styles.predictionCard}>
      <Text style={styles.predictionDate}>{formatDate(item.Date)}</Text>
      <View style={styles.tidesContainer}>
        <View style={styles.tideSection}>
          <Text style={styles.sectionTitle}>High Tides</Text>
          <Text style={styles.tideTime}>
            {item["First High Tide Time"]} ({item["First High Tide Height"]}m)
          </Text>
          {item["Second High Tide Time"] !== "N/A" && (
            <Text style={styles.tideTime}>
              {item["Second High Tide Time"]} ({item["Second High Tide Height"]}
              m)
            </Text>
          )}
        </View>
        <View style={styles.tideSection}>
          <Text style={styles.sectionTitle}>Low Tides</Text>
          <Text style={styles.tideTime}>
            {item["First Low Tide Time"]} ({item["First Low Tide Height"]}m)
          </Text>
          {item["Second Low Tide Time"] !== "N/A" && (
            <Text style={styles.tideTime}>
              {item["Second Low Tide Time"]} ({item["Second Low Tide Height"]}m)
            </Text>
          )}
        </View>
      </View>
      <View style={styles.powerSection}>
        <Text style={styles.powerText}>Power: {item["Power (W/m²)"]} W/m²</Text>
        <Text style={styles.energyText}>
          Daily Energy: {(item["Daily Energy (J/m²)"] / 1000).toFixed(2)} kJ/m²
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text numberOfLines={1} style={styles.title}>
            {station.Station}
          </Text>
          <Text style={styles.subtitle}>{station.Region}</Text>
        </View>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => setFormulaVisible(true)}
        >
          <Text style={styles.buttonText}>?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricsContainer}>
        <MetricBox
          title="Current Tide"
          value={todayData[`${currentHour}:00`].toFixed(2)}
          unit="m"
        />
        <MetricBox
          title="Next Hour"
          value={todayData[`${(currentHour + 1) % 24}:00`].toFixed(2)}
          unit="m"
        />
        <MetricBox
          title="Power"
          value={todayData["Power (W/m²)"].toFixed(2)}
          unit="W/m²"
        />
        <MetricBox
          title="Daily Energy"
          value={(todayData["Daily Energy (J/m²)"] / 1000).toFixed(2)}
          unit="kJ/m²"
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>24-Hour Tidal Variation</Text>
        <View style={styles.chart}>
          <YAxis
            data={chartData}
            contentInset={{ top: 20, bottom: 20 }}
            svg={{ fill: "grey", fontSize: 10 }}
            numberOfTicks={5}
            formatLabel={(value) => `${value.toFixed(1)}m`}
          />
          <View style={styles.chartRight}>
            <LineChart
              style={{ flex: 1 }}
              data={chartData}
              contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
              svg={{
                stroke: "#4a90e2",
                strokeWidth: 2,
              }}
              curve={shape.curveNatural}
            >
              <Gradient />
              <CustomLine />
            </LineChart>
            <AreaChart
              style={{ ...StyleSheet.absoluteFillObject }}
              data={chartData}
              contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
              curve={shape.curveNatural}
              svg={{ fill: "url(#gradient)" }}
            />
            <XAxis
              style={{ marginHorizontal: -10, height: 30 }}
              data={hourlyData}
              formatLabel={(value, index) =>
                index % 3 === 0 ? `${index}:00` : ""
              }
              contentInset={{ left: 10, right: 10 }}
              svg={{ fontSize: 10, fill: "grey" }}
            />
          </View>
        </View>
      </View>

      <RevenueCalculator power={todayData["Power (W/m²)"]} />

      <View style={styles.predictionsContainer}>
        <Text style={styles.predictionsTitle}>5-Day Predictions</Text>
        <FlatList
          data={station.DailyData}
          renderItem={renderPredictionCard}
          keyExtractor={(item) => item.Date}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.predictionsList}
        />
      </View>

      <FormulaModal
        visible={formulaVisible}
        onClose={() => setFormulaVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerContent: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  metricBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 5,
    width: "47%",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  metricUnit: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  chart: {
    height: 250,
    flexDirection: "row",
  },
  chartRight: {
    flex: 1,
    marginLeft: 10,
  },
  predictionsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  predictionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  predictionsList: {
    paddingRight: 20,
  },
  predictionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    marginBottom: 15,
    width: 280,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  predictionDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tidesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tideSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 5,
  },
  tideTime: {
    fontSize: 12,
    color: "#333",
    marginBottom: 2,
  },
  powerSection: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  powerText: {
    fontSize: 14,
    color: "#2ecc71",
    fontWeight: "bold",
  },
  energyText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});

export default DashboardScreen;
