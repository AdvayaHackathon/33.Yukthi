import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  Home,
  Heart,
  User,
  MapPin,
  Bell,
  ChevronLeft,
} from "react-native-feather";

const beachEvents = [
  {
    id: 1,
    title: "Beach Volleyball Tournament",
    date: "Dec 15 - Dec 16",
    time: "10:00 am",
    seats: 8,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp8TY5hLQ8jGCBzigICF2Se23yweWHfbw8Bw&s",
  },
  {
    id: 2,
    title: "Sunset Yoga Session",
    date: "Dec 17",
    time: "6:30 pm",
    seats: 15,
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a3/50/a2/caption.jpg?w=1200&h=-1&s=1",
  },
  {
    id: 3,
    title: "Sandcastle Building Contest",
    date: "Dec 18",
    time: "2:00 pm",
    seats: 20,
    image:
      "https://img.freepik.com/free-vector/sandy-castle-competition-realistic-poster_1284-29589.jpg",
  },
  {
    id: 4,
    title: "Beach Clean-up Drive",
    date: "Dec 19",
    time: "9:00 am",
    seats: 50,
    image: "https://i.ytimg.com/vi/1d-IQGcD6yg/maxresdefault.jpg",
  },
  {
    id: 5,
    title: "Surfing Lessons for Beginners",
    date: "Dec 20",
    time: "11:00 am",
    seats: 10,
    image:
      "https://content.jdmagicbox.com/comp/def_content_category/surfing-classes/d78b15e35a-surfing-classes-4-z7zra.jpg",
  },
  {
    id: 6,
    title: "Beachside Movie Night",
    date: "Dec 21",
    time: "8:00 pm",
    seats: 100,
    image:
      "https://triangleonthecheap.com/wordpress/wp-content/uploads/2022/06/outdoor-movie-cartoon-Depositphotos_420330610_S.jpg",
  },
];

export default function BeachEvents() {
  const [selectedDate, setSelectedDate] = useState(17);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const dates = Array.from({ length: 7 }, (_, i) => i + 15);

  const DateSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.dateSelector}
    >
      {dates.map((date) => (
        <Pressable
          key={date}
          style={[
            styles.dateItem,
            selectedDate === date && styles.selectedDate,
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text
            style={[
              styles.dateText,
              selectedDate === date && styles.selectedDateText,
            ]}
          >
            {date}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  const EventCard = ({ event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => {
        setSelectedEvent(event);
        setShowEventDetail(true);
      }}
    >
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>{event.date}</Text>
        <View style={styles.eventTimeContainer}>
          <Text style={styles.eventTime}>{event.time}</Text>
          <Text style={styles.eventSeats}>{event.seats} seats left</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.heartButton}>
        <Heart width={20} height={20} color="#FF4081" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const EventDetail = () => (
    <View style={styles.eventDetailContainer}>
      <View style={styles.eventDetailHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowEventDetail(false)}
        >
          <ChevronLeft width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Image
          source={{ uri: selectedEvent.image }}
          style={styles.eventDetailImage}
        />
      </View>
      <View style={styles.eventDetailContent}>
        <View style={styles.eventDetailTitleRow}>
          <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
          <View style={styles.hotTag}>
            <Text style={styles.hotTagText}>HOT</Text>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <MapPin width={16} height={16} color="#666" />
          <Text style={styles.locationText}>Beach Street, Location</Text>
          <Text style={styles.seatsLeft}>{selectedEvent.seats} seats left</Text>
        </View>
        <View style={styles.timeContainer}>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Start Time</Text>
            <Text style={styles.timeValue}>{selectedEvent.time}</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeLabel}>Date</Text>
            <Text style={styles.timeValue}>{selectedEvent.date}</Text>
          </View>
        </View>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>
          Join us for an exciting {selectedEvent.title}! Perfect for all
          participants.
        </Text>
        <TouchableOpacity style={styles.remindButton}>
          <Bell width={20} height={20} color="#FFF" />
          <Text style={styles.remindButtonText}>Remind Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!showEventDetail ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              So what plans{"\n"}do you have?
            </Text>
          </View>
          <DateSelector />
          <Text style={styles.sectionTitle}>Upcoming events</Text>
          <ScrollView style={styles.eventsContainer}>
            {beachEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ScrollView>
        </>
      ) : (
        <EventDetail />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#ADD8E0",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  dateSelector: {
    padding: 15,
    marginBottom: -500,
  },
  dateItem: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#FFF",
  },
  selectedDate: {
    backgroundColor: "#1A1A1A",
  },
  dateText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  selectedDateText: {
    color: "#FFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginBottom: 10,
    color: "#FF4081",
  },
  eventsContainer: {
    flex: 1,
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
  },
  eventImage: {
    width: "100%",
    height: 150,
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  eventDate: {
    color: "#666",
    marginBottom: 10,
  },
  eventTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventTime: {
    color: "#666",
  },
  eventSeats: {
    color: "#FF4081",
  },
  heartButton: {
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 20,
  },
  eventDetailContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  eventDetailHeader: {
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 1,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 8,
  },
  eventDetailImage: {
    width: "100%",
    height: 300,
  },
  eventDetailContent: {
    padding: 20,
  },
  eventDetailTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  eventDetailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  hotTag: {
    backgroundColor: "#FF4081",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  hotTagText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  locationText: {
    marginLeft: 5,
    color: "#666",
    flex: 1,
  },
  seatsLeft: {
    color: "#FF4081",
  },
  timeContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timeBox: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    flex: 1,
  },
  timeLabel: {
    color: "#666",
    marginBottom: 5,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  descriptionText: {
    color: "#666",
    lineHeight: 24,
  },
  remindButton: {
    backgroundColor: "#1A1A1A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  remindButtonText: {
    color: "#FFF",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
