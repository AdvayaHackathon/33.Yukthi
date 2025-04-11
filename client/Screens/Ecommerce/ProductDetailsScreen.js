import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "./CartContext";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width;

const ProductDetailsScreen = ({ route, navigation }) => {
  const { id, title, price, rentPrice, shopName, images, description, available } = route.params;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const alertOpacity = useState(new Animated.Value(0))[0];
  const scrollViewRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useCart();
  
  const productIsFavorite = isFavorite(id);

  const handleRent = () => {
    if (!available || available <= 0) {
      setAlertMessage("Sorry, this item is currently out of stock.");
      setShowAlert(true);
      Animated.timing(alertOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      setTimeout(() => {
        Animated.timing(alertOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowAlert(false));
      }, 3000);
      
      return;
    }
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    setAlertMessage(
      `You are about to rent "${title}" for 24 hours. A security deposit of ₹500 will be required.`
    );
    setShowAlert(true);
    Animated.timing(alertOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleAccept = () => {
    Animated.timing(alertOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowAlert(false);
      navigation.navigate("PaymentMethodSelection", {
        cartItem: {
          id,
          title,
          price,
          rentPrice,
          shopName,
          images,
        },
        isRent: true,
      });
    });
  };

  const handleDecline = () => {
    Animated.timing(alertOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowAlert(false));
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / IMAGE_WIDTH);
    setCurrentImageIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() => toggleFavorite(id)}
          style={styles.favoriteButton}
        >
          <Ionicons 
            name={productIsFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color="#fff" 
          />
        </Pressable>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageSection}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
          >
            {images.map((image, index) => (
              <Image 
                key={index} 
                source={image} 
                style={styles.productImage} 
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Image Pagination */}
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
          
          {/* Availability Badge */}
          {available <= 0 ? (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          ) : available <= 2 ? (
            <View style={styles.lowStockBadge}>
              <Text style={styles.lowStockText}>Only {available} left</Text>
            </View>
          ) : null}
        </View>
        
        {/* Product Details */}
        <View style={styles.detailsSection}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.productTitle}>{title}</Text>
              <Text style={styles.shopName}>{shopName}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Rental Fee</Text>
              <Text style={styles.price}>₹{rentPrice}/day</Text>
            </View>
          </View>
          
          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="time-outline" size={20} color="#0066CC" />
              <Text style={styles.featureText}>24-hour rental</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0066CC" />
              <Text style={styles.featureText}>Quality assured</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cash-outline" size={20} color="#0066CC" />
              <Text style={styles.featureText}>₹500 deposit</Text>
            </View>
          </View>
          
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          
          {/* Rental Policy */}
          <View style={styles.policyContainer}>
            <Text style={styles.sectionTitle}>Rental Policy</Text>
            <View style={styles.policyItem}>
              <Ionicons name="calendar-outline" size={20} color="#666" style={styles.policyIcon} />
              <Text style={styles.policyText}>Rental period is 24 hours from pickup time</Text>
            </View>
            <View style={styles.policyItem}>
              <Ionicons name="wallet-outline" size={20} color="#666" style={styles.policyIcon} />
              <Text style={styles.policyText}>Security deposit will be refunded upon return</Text>
            </View>
            <View style={styles.policyItem}>
              <Ionicons name="alert-circle-outline" size={20} color="#666" style={styles.policyIcon} />
              <Text style={styles.policyText}>Late returns incur additional day charges</Text>
            </View>
            <View style={styles.policyItem}>
              <Ionicons name="shield-outline" size={20} color="#666" style={styles.policyIcon} />
              <Text style={styles.policyText}>Damage may result in partial/full deposit forfeiture</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Rent Button */}
      <View style={styles.footer}>
        <View style={styles.depositInfo}>
          <Text style={styles.depositText}>+ ₹500 refundable deposit</Text>
        </View>
        <Pressable 
          style={[
            styles.rentButton,
            available <= 0 && styles.disabledButton
          ]} 
          onPress={handleRent}
          disabled={available <= 0}
        >
          <Text style={styles.rentButtonText}>
            {available > 0 ? "Rent Now" : "Out of Stock"}
          </Text>
        </Pressable>
      </View>

      {/* Alert Modal */}
      {showAlert && (
        <Animated.View
          style={[styles.alertContainer, { opacity: alertOpacity }]}
        >
          <Text style={styles.alertText}>{alertMessage}</Text>
          <View style={styles.alertButtons}>
            <Pressable onPress={handleAccept} style={styles.alertButtonAccept}>
              <Text style={styles.alertButtonText}>Proceed</Text>
            </Pressable>
            <Pressable
              onPress={handleDecline}
              style={styles.alertButtonDecline}
            >
              <Text style={styles.alertButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageSection: {
    position: "relative",
  },
  productImage: {
    width: IMAGE_WIDTH,
    height: 400,
  },
  pagination: { 
    flexDirection: "row", 
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: { 
    backgroundColor: "#fff",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  outOfStockBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#F44336",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  outOfStockText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  lowStockBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FF9800",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  lowStockText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  detailsSection: {
    padding: 16,
    paddingTop: 24,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    flex: 1,
    paddingRight: 8,
  },
  shopName: { 
    fontSize: 16, 
    color: "#666",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  price: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#C41E3A" 
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  featureItem: {
    alignItems: "center",
  },
  featureText: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  policyContainer: {
    marginBottom: 100,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  policyIcon: {
    marginRight: 12,
  },
  policyText: {
    fontSize: 14,
    color: "#444",
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 16,
  },
  depositInfo: {
    alignItems: "center",
    marginBottom: 8,
  },
  depositText: {
    fontSize: 12,
    color: "#666",
  },
  rentButton: {
    backgroundColor: "#0066CC",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  rentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  alertContainer: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  alertText: { 
    color: "#333", 
    fontSize: 16, 
    textAlign: "center",
    marginBottom: 16,
  },
  alertButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  alertButtonAccept: {
    backgroundColor: "#0066CC",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  alertButtonDecline: {
    backgroundColor: "#F44336",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  alertButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});

export default ProductDetailsScreen;