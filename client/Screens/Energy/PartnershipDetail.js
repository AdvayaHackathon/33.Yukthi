import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";

const PartnershipDetail = ({ route }) => {
  const { organization, name, message } = route.params;

  // List of Indian coastal cities
  const coastalCities = [
    "Mumbai",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Puri",
    "Goa",
    "Vishakhapatnam",
    "Mangalore",
    "Kochi",
    "Pondicherry",
    "Alleppey",
    "Daman",
    "Porbandar",
    "Kanyakumari",
    "Rameshwaram",
  ];

  // Function to generate a random coastal city
  const getRandomCoastalCity = () => {
    const randomIndex = Math.floor(Math.random() * coastalCities.length);
    return coastalCities[randomIndex];
  };

  const getRandomValue = (max) => {
    return Math.floor(Math.random() * (max - 100 + 1)) + 100; // Generates a value between 100 and max
  };

  // State variables for random values
  const [randomLocation, setRandomLocation] = useState(getRandomCoastalCity());
  const [requiredFunds, setRequiredFunds] = useState("");
  const [investorContribution, setInvestorContribution] = useState("");
  const [investorShare, setInvestorShare] = useState("");

  const [requesterName, setRequesterName] = useState("");
  const [requesterOrganization, setRequesterOrganization] = useState("");
  const [collaborationMessage, setCollaborationMessage] = useState("");
  const [partnershipPercentage, setPartnershipPercentage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Generate required funds
    const required = getRandomValue(150); // Generate random total fund
    const maxInvestment = Math.floor(required / 2) - 1; // Maximum investment (just below 50% of required funds)

    const investment = getRandomValue(maxInvestment > 0 ? maxInvestment : 1); // Ensure valid max range

    setRequiredFunds(`${required} Crore`);
    setInvestorContribution(`${investment} Crore`);

    // Calculate investor share as a percentage
    const share = (investment / required) * 100;
    setInvestorShare(`${share.toFixed(2)}%`);
  }, []);

  const handleCollaborationRequest = () => {
    if (
      requesterName &&
      requesterOrganization &&
      collaborationMessage &&
      partnershipPercentage &&
      email
    ) {
      Alert.alert(
        "Collaboration Request Sent",
        "You will be notified about your collaboration soon.",
        [{ text: "OK" }]
      );
      setRequesterName("");
      setRequesterOrganization("");
      setCollaborationMessage("");
      setPartnershipPercentage("");
      setEmail("");
    } else {
      Alert.alert("Missing Information", "Please fill out all fields.", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.detailCard}>
        <Text style={styles.title}>Collaboration Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Project Name:</Text>
          <Text style={styles.value}>{name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Organization:</Text>
          <Text style={styles.value}>{organization}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{randomLocation}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Project Message:</Text>
          <Text style={styles.value}>{message}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Total Funds Required for Setup:</Text>
          <Text style={styles.value}>{requiredFunds}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Investment Sought from Partnership:</Text>
          <Text style={styles.value}>{investorContribution}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Investor’s Share in Partnership:</Text>
          <Text style={styles.value}>{investorShare}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Request Collaboration</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={requesterName}
          onChangeText={setRequesterName}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Organization"
          value={requesterOrganization}
          onChangeText={setRequesterOrganization}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Message (Budget or Proposal Details)"
          value={collaborationMessage}
          onChangeText={setCollaborationMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleCollaborationRequest}
        >
          <Text style={styles.buttonText}>Request for Collaboration</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EAF7FB",
    padding: 20,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#123456",
    marginBottom: 15,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#205375",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#444",
    flex: 2,
  },
  form: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#123456",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 10,
    borderColor: "#B0C4DE",
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PartnershipDetail;
