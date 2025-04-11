import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Partnership = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [totalFund, setTotalFund] = useState("");
  const [partnershipFund, setPartnershipFund] = useState("");
  const [message, setMessage] = useState("");
  const [proposals, setProposals] = useState([
    {
      id: 1,
      name: "Deep Ocean Energy Research",
      organization: "GreenTech Innovations",
      message:
        "We aim to collaborate in advancing tidal energy technologies with a focus on sustainable energy solutions for coastal areas. Looking forward to discussing potential partnership opportunities.",
    },
    {
      id: 2,
      name: "TidePower Systems",
      organization: "Ocean Power Ltd.",
      message:
        "Our company specializes in the integration of tidal energy systems. We are seeking partnerships to expand our operations and implement projects that contribute to cleaner energy alternatives.",
    },
    {
      id: 3,
      name: "Ocean Tidal Projects",
      organization: "Blue Horizon Enterprises",
      message:
        "We are committed to developing tidal power projects along the coast to harness renewable energy, aiming to create sustainable, low-cost power solutions.",
    },
    {
      id: 4,
      name: "TidalFlow Energy Solutions",
      organization: "WaveTech Ltd.",
      message:
        "We are exploring ways to integrate tidal energy with offshore wind systems. Our focus is to create hybrid energy solutions that maximize energy efficiency and sustainability.",
    },
    {
      id: 5,
      name: "OceanSustain Power",
      organization: "EcoEnergy Corp.",
      message:
        "Our project aims to develop tidal power plants in eco-sensitive areas, ensuring minimal environmental impact while providing renewable energy to coastal communities.",
    },
    {
      id: 6,
      name: "Coastal Energy Initiative",
      organization: "Marine Innovations",
      message:
        "We are focused on using tidal and wave energy to create small-scale, decentralized power generation units for remote coastal communities, improving energy access and reliability.",
    },
    {
      id: 7,
      name: "TideCore Project",
      organization: "AquaPower Solutions",
      message:
        "Our goal is to build and operate a series of tidal turbines along the eastern seaboard, contributing to national energy grids with clean, renewable power.",
    },
    {
      id: 8,
      name: "Blue Ocean Power",
      organization: "Maritime Energy Corp.",
      message:
        "This project focuses on harnessing tidal currents for power generation, aiming to reduce carbon emissions and promote clean energy practices across global coastlines.",
    },
  ]);

  const [showForm, setShowForm] = useState(false); // State to control form visibility

  const submitProposal = () => {
    if (name && organization && message) {
      const newProposal = {
        id: proposals.length + 1,
        name,
        organization,
        message,
      };
      setProposals([...proposals, newProposal]);
      setName("");
      setOrganization("");
      setMessage("");
      setShowForm(false); // Hide form after submission
      console.log("Proposal submitted:", newProposal); // Debug log
    } else {
      alert("Please fill all fields to submit a proposal.");
    }
  };

  const handleShowCollaboration = (proposal) => {
    navigation.navigate("PartnershipDetail", proposal);
  };

  const renderProposal = ({ item }) => (
    <View style={styles.proposalCard}>
      <Text style={styles.proposalName}>
        {item.name} ({item.organization})
      </Text>
      <Text style={styles.proposalMessage}>{item.message}</Text>
      <TouchableOpacity
        style={styles.showButton}
        onPress={() => handleShowCollaboration(item)}
      >
        <Text style={styles.showButtonText}>Collab 🤝</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Button to trigger form visibility */}
      {!showForm && (
        <TouchableOpacity
          style={styles.collaborationButton}
          onPress={() => {
            console.log("Propose Collaboration clicked"); // Debug log
            setShowForm(true);
          }}
        >
          <Text style={styles.collaborationButtonText}>
            Propose Collaboration
          </Text>
        </TouchableOpacity>
      )}

      {/* Show form when "Propose Collaboration" is clicked */}
      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Organization"
            value={organization}
            onChangeText={(text) => setOrganization(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Total Fund Required (in Crores)"
            value={totalFund}
            onChangeText={(text) => setTotalFund(text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Partnership Fund Requested (in Crores)"
            value={partnershipFund}
            onChangeText={(text) => setPartnershipFund(text)}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Message or Proposal Details"
            value={message}
            onChangeText={(text) => setMessage(text)}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={submitProposal}>
            <Text style={styles.buttonText}>Submit Proposal</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Active Proposals Section */}
      <Text style={styles.sectionTitle}>Active Proposals</Text>
      {proposals.length === 0 ? (
        <Text style={styles.noProposalsText}>No proposals yet.</Text>
      ) : (
        <FlatList
          data={proposals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProposal}
          contentContainerStyle={styles.proposalsSection}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F5F8",
    padding: 20,
  },
  form: {
    marginBottom: 30,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
    fontSize: 16,
    color: "#495057",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#34A0A4",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  proposalsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1D3557",
  },
  noProposalsText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  proposalCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 10,
  },
  proposalName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 5,
  },
  proposalMessage: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
  showButton: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  showButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  collaborationButton: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  collaborationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Partnership;
