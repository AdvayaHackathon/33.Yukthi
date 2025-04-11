import axios from "axios";
import * as Location from "expo-location";

const FOURSQUARE_API = "fsq39HZDcT4DVGuGBxAvqS5zCYdsKydd+UY7hT82+Zb0mkg=";
console.log(FOURSQUARE_API);

const defaultBeaches = [
  { name: "Lighthouse Beach", latitude: 8.3958, longitude: 76.9789 },
  { name: "Puri Beach", latitude: 19.7983, longitude: 85.8253 },
  { name: "Radhanagar Beach", latitude: 11.986, longitude: 92.9876 },
  { name: "Varkala Beach", latitude: 8.7379, longitude: 76.711 },
  { name: "Baga Beach", latitude: 15.5527, longitude: 73.7517 },
];

const fetchBeachPhotos = async (fsq_id) => {
  try {
    const response = await axios.get(
      `https://api.foursquare.com/v3/places/${fsq_id}/photos`,
      {
        headers: {
          Authorization: FOURSQUARE_API,
        },
      }
    );
    if (response.data && response.data.length > 0) {
      const photo = response.data[0];
      return `${photo.prefix}original${photo.suffix}`;
    }
    return null;
  } catch (err) {
    console.error(`Error fetching photo for fsq_id ${fsq_id}:`, err.message);
    return null;
  }
};

const fetchNearbyBeaches = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      "https://api.foursquare.com/v3/places/nearby",
      {
        params: {
          ll: `${latitude},${longitude}`,
          query: "beach",
          limit: 10,
          radius: 10000,
        },
        headers: {
          Authorization: FOURSQUARE_API,
        },
      }
    );

    const beachResults = response.data.results.filter((place) =>
      place.categories.some(
        (category) =>
          category.name.toLowerCase().includes("beach") ||
          category.name.toLowerCase().includes("shore")
      )
    );

    const validBeaches = [];
    for (const beach of beachResults) {
      const photoUrl = await fetchBeachPhotos(beach.fsq_id);
      if (photoUrl) {
        validBeaches.push({
          id: beach.fsq_id,
          title: beach.name,
          description: `${(beach.distance / 1000).toFixed(1)} km away`,
          photoUrl,
        });
      }
    }

    if (validBeaches.length < 3) {
      const randomBeach = getRandomDefaultBeach();
      return fetchNearbyBeaches(randomBeach.latitude, randomBeach.longitude);
    }
    return validBeaches;
  } catch (err) {
    console.error("Error fetching nearby beaches:", err.message);
    return [];
  }
};

const getRandomDefaultBeach = () => {
  const randomIndex = Math.floor(Math.random() * defaultBeaches.length);
  return defaultBeaches[randomIndex];
};

export const getLocationAndFetchBeaches = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      const randomBeach = getRandomDefaultBeach();
      return fetchNearbyBeaches(randomBeach.latitude, randomBeach.longitude);
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = location.coords;
    return fetchNearbyBeaches(latitude, longitude);
  } catch (err) {
    console.error("Location error:", err);
    const randomBeach = getRandomDefaultBeach();
    return fetchNearbyBeaches(randomBeach.latitude, randomBeach.longitude);
  }
};
