import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import * as Location from 'expo-location'; // Make sure to install: expo install expo-location

// *** PUT YOUR API KEY HERE ***
const API_KEY = 'de1798e412d166dda86a9646dec30e9cee557c9ed7c0e60159a26e9f3c458d52'; // Replace with your actual Ambee API key
const BASE_URL = 'https://api.ambeedata.com';

// Event type mapping
const EVENT_TYPES = {
  TN: 'Tsunami',
  EQ: 'Earthquake',
  TC: 'Tropical Cyclone',
  WF: 'Wildfire',
  FL: 'Flood',
  ET: 'Extreme Temperature',
  DR: 'Drought',
  SW: 'Severe Storm',
  SI: 'Sea Ice',
  VO: 'Volcano',
  LS: 'Landslide',
  Misc: 'Miscellaneous',
};

// Severity color mapping
const SEVERITY_COLORS = {
  High: '#FF6B6B',
  Medium: '#FFD93D',
  Low: '#4ECDC4',
  Unknown: '#7E57C2',
};

const NaturalDisasterTracker = () => {
  const [location, setLocation] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      
      // Fetch disasters once we have location
      await fetchDisasters(location.coords.latitude, location.coords.longitude);
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Could not retrieve your location');
      setLoading(false);
    }
  };

  // Fetch disaster data from Ambee API
  const fetchDisasters = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `${BASE_URL}/disasters/latest/by-lat-lng?lat=${latitude}&lng=${longitude}&limit=10`,
        {
          headers: {
            'x-api-key': API_KEY,
            'Content-type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        // Process and format the disaster data
        const formattedDisasters = data.data.map(disaster => ({
          id: disaster.event_id || String(Math.random()),
          eventType: disaster.event_type || 'Unknown',
          eventName: disaster.event_name || 'Unnamed Event',
          severity: disaster.severity || 'Unknown',
          description: disaster.event_description || 'No description available',
          country: disaster.country || 'Unknown location',
          date: disaster.event_date || new Date().toISOString(),
          details: disaster.details || {},
        }));
        
        setDisasters(formattedDisasters);
      } else {
        setDisasters([]);
      }
      
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Error fetching disaster data:', err);
      setError('Failed to fetch disaster information');
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Get disaster details
  const getDisasterDetails = async (eventId) => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `${BASE_URL}/disasters/by-eventId?eventId=${eventId}`,
        {
          headers: {
            'x-api-key': API_KEY,
            'Content-type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.data) {
        Alert.alert(
          data.data.event_name || 'Disaster Details',
          `Type: ${EVENT_TYPES[data.data.event_type] || data.data.event_type}\n` +
          `Severity: ${data.data.severity || 'Unknown'}\n` +
          `Description: ${data.data.event_description || 'No description available'}\n` +
          `Location: ${data.data.country || 'Unknown location'}\n` +
          `Date: ${new Date(data.data.event_date).toLocaleString() || 'Unknown'}`
        );
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching disaster details:', err);
      Alert.alert('Error', 'Failed to fetch disaster details');
      setLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    if (location) {
      await fetchDisasters(location.latitude, location.longitude);
    } else {
      await getCurrentLocation();
    }
  };

  // Initialize on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Render disaster item
  const renderDisasterItem = ({ item }) => {
    const severityColor = SEVERITY_COLORS[item.severity] || SEVERITY_COLORS.Unknown;
    
    return (
      <TouchableOpacity 
        style={[styles.disasterCard, { borderLeftColor: severityColor, borderLeftWidth: 5 }]}
        onPress={() => getDisasterDetails(item.id)}
      >
        <View style={styles.disasterHeader}>
          <Text style={styles.disasterName}>{item.eventName}</Text>
          <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
            <Text style={styles.severityText}>{item.severity}</Text>
          </View>
        </View>
        
        <Text style={styles.disasterType}>
          {EVENT_TYPES[item.eventType] || item.eventType}
        </Text>
        
        <Text style={styles.disasterDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.disasterFooter}>
          <Text style={styles.disasterLocation}>{item.country}</Text>
          <Text style={styles.disasterDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Natural Disaster Tracker</Text>
        {location && (
          <Text style={styles.subtitle}>
            Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>
            {location ? 'Checking for natural disasters...' : 'Getting your location...'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={disasters}
          renderItem={renderDisasterItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No natural disasters found in your area</Text>
              <Text style={styles.emptySubtext}>That's good news! Stay safe.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} disabled={loading}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#3498db',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContainer: {
    padding: 16,
  },
  disasterCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  disasterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  disasterName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  disasterType: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  disasterDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  disasterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disasterLocation: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  disasterDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  refreshButton: {
    backgroundColor: '#3498db',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NaturalDisasterTracker;