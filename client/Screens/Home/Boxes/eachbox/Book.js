import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

export default function Book() {
  const route = useRoute();
  const { beachName, beachImage, beachRating } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const filmMedia = [
    { id: 1, type: "image", source: require("@/assets/images/shoot1.jpg") },
    { id: 2, type: "image", source: require("@/assets/images/shoot2.jpg") },
    { id: 3, type: "image", source: require("@/assets/images/shoot4.jpg") },
    { id: 4, type: "image", source: require("@/assets/images/shoot3.jpg") },
    { id: 5, type: "image", source: require("@/assets/images/shoot5.jpg") },
    { id: 6, type: "image", source: require("@/assets/images/shoot6.jpg") },
    { id: 7, type: "image", source: require("@/assets/images/shoot7.jpg") },
  ];

  const renderMediaItem = (item) => (
    <View key={item.id} style={styles.mediaItem}>
      <Image source={item.source} style={styles.mediaContent} />
    </View>
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setSelectedDate(moment(date).format("Do MMM YYYY"));
    hideDatePicker();
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const handleConfirmStartTime = (time) => {
    setStartTime(moment(time).format("h:mm A"));
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleConfirmEndTime = (time) => {
    setEndTime(moment(time).format("h:mm A"));
    hideEndTimePicker();
  };

  // Handle the Book Now button click
  const handleBookNow = () => {
    if (!selectedDate || !startTime || !endTime) {
      Alert.alert(
        "Error",
        "Please select both date and time to proceed with the booking.",
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Booking Confirmed",
        `Your booking for ${beachName} on ${selectedDate} from ${startTime} to ${endTime} is confirmed.`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Beach Name and Rating */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.beachName}>{beachName}</Text>
          <Text style={styles.rating}>{beachRating}/5 ★</Text>
        </View>
      </View>
      {/* Beach Image */}
      <Image source={beachImage} style={styles.beachImage} />

      {/* Combined Details Container */}
      <View style={styles.detailsContainer}>
        {/* Date and Time Selection - Horizontal Layout */}
        <View style={styles.dateTimeSection}>
          <TouchableOpacity
            style={styles.selectDateButton}
            onPress={showDatePicker}
          >
            <Text style={styles.selectDateText}>
              {selectedDate ? selectedDate : "Select Date"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectTimeButton}
            onPress={showStartTimePicker}
          >
            <Text style={styles.selectTimeText}>
              {startTime ? `Start Time: ${startTime}` : "Select Start Time"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectTimeButton}
            onPress={showEndTimePicker}
          >
            <Text style={styles.selectTimeText}>
              {endTime ? `End Time: ${endTime}` : "Select End Time"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Activities Section */}
        <View style={styles.activitiesSection}>
          <Text style={styles.activitiesTitle}>Overview</Text>
          <Text style={styles.activitiesText}>
            Experience the unparalleled beauty of this beach as a film-worthy
            backdrop, where serene stretches of soft sands meet the calming
            waves under vibrant, picturesque sunsets. With its lush tropical
            surroundings and breathtaking views.
          </Text>
        </View>

        {/* Film Shooting Section */}
        <View style={styles.gallerySection}>
          <Text style={styles.galleryTitle}>Gallery</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaScrollContainer}
          >
            {filmMedia.map((item) => renderMediaItem(item))}
          </ScrollView>
        </View>

        {/* Book Now Button */}
        <TouchableOpacity style={styles.bookNowButton} onPress={handleBookNow}>
          <Text style={styles.bookNowText}>Book Now</Text>
          <Text style={styles.bookNowArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        date={new Date()}
      />

      {/* Start Time Picker Modal */}
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmStartTime}
        onCancel={hideStartTimePicker}
        date={new Date()}
      />

      {/* End Time Picker Modal */}
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmEndTime}
        onCancel={hideEndTimePicker}
        date={new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6EBF5",
    justifyContent: "flex-start",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  beachImage: {
    width: "100%",
    height: "47%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  detailsContainer: {
    marginTop: -20,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  beachName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rating: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dateTimeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  selectDateButton: {
    backgroundColor: "#3498db", // Blue background
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  selectDateText: {
    fontSize: 16,
    color: "#fff", // White text
  },
  selectTimeButton: {
    backgroundColor: "#3498db", // Blue background
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 10,
    flex: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  selectTimeText: {
    fontSize: 16,
    color: "#fff", // White text
  },
  activitiesSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  activitiesText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  gallerySection: {
    marginBottom: 25,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  mediaScrollContainer: {
    paddingRight: 20,
  },
  mediaItem: {
    marginRight: 17,
    marginBottom: 7,
  },
  mediaContent: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  bookNowButton: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -3,
  },
  bookNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bookNowArrow: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
