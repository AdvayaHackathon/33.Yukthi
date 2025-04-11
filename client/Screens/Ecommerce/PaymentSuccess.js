import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "./CartContext";
import * as Haptics from "expo-haptics";
import { SharedElement } from "react-navigation-shared-element";

const { width, height } = Dimensions.get("window");

const PaymentSuccess = ({ navigation, route }) => {
  const { amount, paymentMethod, isRent } = route.params || {};
  const { theme } = useCart();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  // Generate random order ID
  const orderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  // Format date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Format time
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  // Calculate return date (24 hours later)
  const returnDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  const formattedReturnDate = returnDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Format return time
  const formattedReturnTime = returnDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  // Get payment method name
  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case "GooglePay":
        return "Google Pay";
      case "PhonePe":
        return "PhonePe";
      case "PayPal":
        return "PayPal";
      case "CreditDebitCard":
        return "Credit/Debit Card";
      case "CashOnDelivery":
        return "Cash";
      default:
        return "Online Payment";
    }
  };
  
  // Get payment method icon
  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case "GooglePay":
        return require("@/assets/Ecom/gpay.jpg");
      case "PhonePe":
        return require("@/assets/Ecom/phonepe.png");
      case "PayPal":
        return require("@/assets/Ecom/paypal.png");
      case "CreditDebitCard":
        return require("@/assets/Ecom/card.jpg");
      case "CashOnDelivery":
        return require("@/assets/Ecom/cash.png");
      default:
        return require("@/assets/Ecom/card.jpg");
    }
  };
  
  // Animate in on mount
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Handle continue shopping
  const handleContinueShopping = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Gears");
  };
  
  // Handle view rentals
  const handleViewRentals = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Cart", { activeTab: "active" });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#121212" : "#F8F9FA" }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      {/* Success Animation */}
<Animated.View
  style={[
    styles.animationContainer,
    {
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }],
    },
  ]}
>
  <View style={styles.successIconContainer}>
    <Ionicons 
      name="checkmark-circle" 
      size={100} 
      color={theme === "dark" ? "#00E5FF" : "#0066CC"} 
    />
    <View style={styles.checkmarkBackground} />
  </View>
</Animated.View>
      
      {/* Success Message */}
      <Animated.View
        style={[
          styles.messageContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text
          style={[
            styles.successTitle,
            { color: theme === "dark" ? "#FFFFFF" : "#000000" },
          ]}
        >
          Payment Successful!
        </Text>
        <Text
          style={[
            styles.successMessage,
            { color: theme === "dark" ? "#BBBBBB" : "#666666" },
          ]}
        >
          {isRent
            ? "Your beach gear rental has been confirmed."
            : "Your payment has been processed successfully."}
        </Text>
      </Animated.View>
      
      {/* Order Details Card */}
      <Animated.View
        style={[
          styles.orderCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
          },
        ]}
      >
        <View style={styles.orderHeader}>
          <Text
            style={[
              styles.orderTitle,
              { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            ]}
          >
            Order Details
          </Text>
          <View
            style={[
              styles.orderIdBadge,
              { backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5" },
            ]}
          >
            <Text
              style={[
                styles.orderIdText,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
            >
              {orderId}
            </Text>
          </View>
        </View>
        
        <View
          style={[
            styles.divider,
            { backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0" },
          ]}
        />
        
        <View style={styles.orderDetail}>
          <Text
            style={[
              styles.orderDetailLabel,
              { color: theme === "dark" ? "#BBBBBB" : "#666666" },
            ]}
          >
            Amount Paid
          </Text>
          <Text
            style={[
              styles.orderDetailValue,
              { color: theme === "dark" ? "#00E5FF" : "#0066CC" },
            ]}
          >
            ₹{amount}
          </Text>
        </View>
        
        <View style={styles.orderDetail}>
          <Text
            style={[
              styles.orderDetailLabel,
              { color: theme === "dark" ? "#BBBBBB" : "#666666" },
            ]}
          >
            Payment Method
          </Text>
          <View style={styles.paymentMethodContainer}>
            <Image
              source={getPaymentMethodIcon()}
              style={styles.paymentMethodIcon}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.orderDetailValue,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
            >
              {getPaymentMethodName()}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderDetail}>
          <Text
            style={[
              styles.orderDetailLabel,
              { color: theme === "dark" ? "#BBBBBB" : "#666666" },
            ]}
          >
            Date & Time
          </Text>
          <Text
            style={[
              styles.orderDetailValue,
              { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            ]}
          >
            {formattedDate}, {formattedTime}
          </Text>
        </View>
        
        {isRent && (
          <View style={styles.orderDetail}>
            <Text
              style={[
                styles.orderDetailLabel,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
            >
              Return By
            </Text>
            <Text
              style={[
                styles.orderDetailValue,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
            >
              {formattedReturnDate}, {formattedReturnTime}
            </Text>
          </View>
        )}
        
        {isRent && (
          <View style={styles.orderDetail}>
            <Text
              style={[
                styles.orderDetailLabel,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
            >
              Security Deposit
            </Text>
            <Text
              style={[
                styles.orderDetailValue,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
            >
              ₹500 (Refundable)
            </Text>
          </View>
        )}
        
        <View
          style={[
            styles.divider,
            { backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0" },
          ]}
        />
        
        {isRent && (
          <View style={styles.pickupInstructions}>
            <View style={styles.pickupHeader}>
              <Ionicons
                name="information-circle"
                size={20}
                color={theme === "dark" ? "#00E5FF" : "#0066CC"}
                style={styles.pickupIcon}
              />
              <Text
                style={[
                  styles.pickupTitle,
                  { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                ]}
              >
                Pickup Instructions
              </Text>
            </View>
            <Text
              style={[
                styles.pickupText,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
            >
              • Show your order ID at the rental counter
            </Text>
            <Text
              style={[
                styles.pickupText,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
            >
              • Security deposit will be collected at pickup
            </Text>
            <Text
              style={[
                styles.pickupText,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
            >
              • Return items to the same location within 24 hours
            </Text>
          </View>
        )}
      </Animated.View>
      
      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.actionButtons,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.secondaryButton,
            {
              backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5",
            },
          ]}
          onPress={handleContinueShopping}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              { color: theme === "dark" ? "#FFFFFF" : "#000000" },
            ]}
          >
            Continue Shopping
          </Text>
        </TouchableOpacity>
        
        {isRent && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.primaryButton,
              { backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
            ]}
            onPress={handleViewRentals}
          >
            <Text style={styles.primaryButtonText}>View My Rentals</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  animationContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  animation: {
    width: 150,
    height: 150,
  },
  messageContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
    paddingHorizontal: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  orderCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  orderIdBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  orderIdText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  orderDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderDetailLabel: {
    fontSize: 14,
  },
  orderDetailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  paymentMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethodIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 4,
  },
  pickupInstructions: {
    marginTop: 8,
  },
  pickupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pickupIcon: {
    marginRight: 8,
  },
  pickupTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  pickupText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  actionButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  successIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkBackground: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
});

export default PaymentSuccess;