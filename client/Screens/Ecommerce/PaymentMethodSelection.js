import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "./CartContext";
import * as Haptics from "expo-haptics";


const { width, height } = Dimensions.get("window");

const PAYMENT_METHODS = [
  {
    id: "GooglePay",
    name: "Google Pay",
    icon: require("@/assets/Ecom/gpay.jpg"),
    subtitle: "Fast & secure payment",
  },
  {
    id: "PhonePe",
    name: "PhonePe",
    icon: require("@/assets/Ecom/phonepe.png"),
    subtitle: "UPI payment",
  },
  {
    id: "PayPal",
    name: "PayPal",
    icon: require("@/assets/Ecom/paypal.png"),
    subtitle: "International payments",
  },
  {
    id: "CreditDebitCard",
    name: "Credit/Debit Card",
    icon: require("@/assets/Ecom/card.jpg"),
    subtitle: "Visa, Mastercard, RuPay",
  },
  {
    id: "CashOnDelivery",
    name: "Cash",
    icon: require("@/assets/Ecom/cash.png"),
    subtitle: "Pay when you pick up",
  },
];

const PaymentMethodSelection = ({ navigation, route }) => {
  const { cartItems, cartItem, totalAmount, isRent } = route.params || {};
  const { theme, addToPaidRentItems } = useCart();
  
  // State
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSuccess, setProcessingSuccess] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const cardFormAnim = useRef(new Animated.Value(0)).current;
  const processAnim = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  
  
  // Calculate total amount if not provided
  const calculatedTotal = totalAmount || (cartItem ? cartItem.rentPrice + 500 : 0);
  
  // Animate in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Handle payment method selection
  const handlePaymentMethodPress = (method) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMethod(method);
    
    if (method === "CreditDebitCard") {
      Animated.timing(cardFormAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setShowCardForm(true);
    } else {
      Animated.timing(cardFormAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowCardForm(false));
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };
  
  // Format expiry date (MM/YY)
  const formatExpiry = (text) => {
    const cleaned = text.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };
  
  // Handle payment process
  const handlePayment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!selectedMethod) {
      Alert.alert("Payment Method Required", "Please select a payment method to continue.");
      return;
    }
    
    if (selectedMethod === "CreditDebitCard") {
      // Validate card details
      if (!cardNumber || cardNumber.replace(/\s+/g, "").length < 16) {
        Alert.alert("Invalid Card Number", "Please enter a valid 16-digit card number.");
        return;
      }
      
      if (!cardName) {
        Alert.alert("Card Name Required", "Please enter the name on your card.");
        return;
      }
      
      if (!cardExpiry || cardExpiry.length < 5) {
        Alert.alert("Invalid Expiry Date", "Please enter a valid expiry date (MM/YY).");
        return;
      }
      
      if (!cardCvv || cardCvv.length < 3) {
        Alert.alert("Invalid CVV", "Please enter a valid CVV code.");
        return;
      }
    }
    
    // Start processing animation
    setIsProcessing(true);
    Animated.timing(processAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Simulate payment processing
    setTimeout(() => {
      
      
      setProcessingSuccess(true);
      
      // Add items to paid rentals if renting
      if (isRent) {
        if (cartItems) {
          addToPaidRentItems(cartItems);
        } else if (cartItem) {
          addToPaidRentItems([{ ...cartItem, quantity: 1 }]);
        }
      }
      
      // Navigate to success screen after animation completes
      setTimeout(() => {
        navigation.navigate("PaymentSuccess", {
          amount: calculatedTotal,
          paymentMethod: selectedMethod,
          isRent,
        });
      }, 2000);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#121212" : "#F8F9FA" }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF" },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (isProcessing) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          disabled={isProcessing}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme === "dark" ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
        
        <Text
          style={[
            styles.headerTitle,
            { color: theme === "dark" ? "#FFFFFF" : "#000000" },
          ]}
        >
          Payment
        </Text>
        
        <View style={styles.headerRight} />
      </View>
      
      {/* Main Content */}
      {!isProcessing ? (
        <Animated.ScrollView
          style={[
            styles.scrollView,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Order Summary */}
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF" },
            ]}
          >
            <Text
              style={[
                styles.summaryTitle,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
            >
              Order Summary
            </Text>
            
            <View style={styles.summaryItems}>
              {cartItems ? (
                cartItems.map((item) => (
                  <View key={item.id} style={styles.summaryItem}>
                    <View style={styles.summaryItemLeft}>
                      <Image
                        source={item.images[0]}
                        style={styles.summaryItemImage}
                        resizeMode="cover"
                      />
                      <View style={styles.summaryItemDetails}>
                        <Text
                          style={[
                            styles.summaryItemTitle,
                            { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                          ]}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={[
                            styles.summaryItemQuantity,
                            { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                          ]}
                        >
                          Qty: {item.quantity || 1}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.summaryItemPrice,
                        { color: theme === "dark" ? "#00E5FF" : "#0066CC" },
                      ]}
                    >
                      ₹{item.rentPrice * (item.quantity || 1)}
                    </Text>
                  </View>
                ))
              ) : cartItem ? (
                <View style={styles.summaryItem}>
                  <View style={styles.summaryItemLeft}>
                    <Image
                      source={cartItem.images[0]}
                      style={styles.summaryItemImage}
                      resizeMode="cover"
                    />
                    <View style={styles.summaryItemDetails}>
                      <Text
                        style={[
                          styles.summaryItemTitle,
                          { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                        ]}
                        numberOfLines={1}
                      >
                        {cartItem.title}
                      </Text>
                      <Text
                        style={[
                          styles.summaryItemQuantity,
                          { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                        ]}
                      >
                        Qty: 1
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.summaryItemPrice,
                      { color: theme === "dark" ? "#00E5FF" : "#0066CC" },
                    ]}
                  >
                    ₹{cartItem.rentPrice}
                  </Text>
                </View>
              ) : null}
            </View>
            
            <View
              style={[
                styles.divider,
                { backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0" },
              ]}
            />
            
            <View style={styles.summaryRow}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                ]}
              >
                Subtotal
              </Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                ]}
              >
                ₹{calculatedTotal - 500}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                ]}
              >
                Security Deposit
              </Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                ]}
              >
                ₹500
              </Text>
            </View>
            
            <View
              style={[
                styles.divider,
                { backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0" },
              ]}
            />
            
            <View style={styles.summaryRow}>
              <Text
                style={[
                  styles.totalLabel,
                  { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.totalValue,
                  { color: theme === "dark" ? "#00E5FF" : "#0066CC" },
                ]}
              >
                ₹{calculatedTotal}
              </Text>
            </View>
          </View>
          
          {/* Payment Methods */}
          <View
            style={[
              styles.paymentMethodsCard,
              { backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF" },
            ]}
          >
            <Text
              style={[
                styles.paymentMethodsTitle,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
            >
              Payment Methods
            </Text>
            
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodItem,
                  selectedMethod === method.id && styles.selectedPaymentMethod,
                  {
                    backgroundColor:
                      selectedMethod === method.id
                        ? theme === "dark"
                          ? "rgba(0, 229, 255, 0.1)"
                          : "rgba(0, 102, 204, 0.05)"
                        : "transparent",
                    borderColor:
                      selectedMethod === method.id
                        ? theme === "dark"
                          ? "#00E5FF"
                          : "#0066CC"
                        : theme === "dark"
                        ? "#333333"
                        : "#F0F0F0",
                  },
                ]}
                onPress={() => handlePaymentMethodPress(method.id)}
              >
                <Image
                  source={method.icon}
                  style={styles.paymentMethodIcon}
                  resizeMode="contain"
                />
                <View style={styles.paymentMethodDetails}>
                  <Text
                    style={[
                      styles.paymentMethodName,
                      { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {method.name}
                  </Text>
                  <Text
                    style={[
                      styles.paymentMethodSubtitle,
                      { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                    ]}
                  >
                    {method.subtitle}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    {
                      borderColor:
                        selectedMethod === method.id
                          ? theme === "dark"
                            ? "#00E5FF"
                            : "#0066CC"
                          : theme === "dark"
                          ? "#333333"
                          : "#CCCCCC",
                    },
                  ]}
                >
                  {selectedMethod === method.id && (
                    <View
                      style={[
                        styles.radioButtonInner,
                        {
                          backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
                        },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Credit Card Form */}
          {showCardForm && (
            <Animated.View
              style={[
                styles.cardFormContainer,
                {
                  opacity: cardFormAnim,
                  transform: [
                    {
                      translateY: cardFormAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                  backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                },
              ]}
            >
              <View style={styles.cardFormHeader}>
                <Text
                  style={[
                    styles.cardFormTitle,
                    { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  Card Details
                </Text>
                <View style={styles.cardIcons}>
                  <FontAwesome name="cc-visa" size={24} color="#1A1F71" style={styles.cardIcon} />
                  <FontAwesome name="cc-mastercard" size={24} color="#EB001B" style={styles.cardIcon} />
                  <FontAwesome name="cc-amex" size={24} color="#006FCF" style={styles.cardIcon} />
                </View>
              </View>
              
              <View style={styles.cardFormField}>
                <Text
                  style={[
                    styles.cardFormLabel,
                    { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                  ]}
                >
                  Card Number
                </Text>
                <View
                  style={[
                    styles.cardFormInput,
                    { backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5" },
                  ]}
                >
                  <TextInput
                    style={[
                      styles.cardFormInputText,
                      { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                    ]}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={theme === "dark" ? "#666666" : "#AAAAAA"}
                    keyboardType="number-pad"
                    maxLength={19}
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  />
                  <MaterialCommunityIcons
                    name="credit-card-outline"
                    size={20}
                    color={theme === "dark" ? "#BBBBBB" : "#666666"}
                  />
                </View>
              </View>
              
              <View style={styles.cardFormField}>
                <Text
                  style={[
                    styles.cardFormLabel,
                    { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                  ]}
                >
                  Cardholder Name
                </Text>
                <View
                  style={[
                    styles.cardFormInput,
                    { backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5" },
                  ]}
                >
                  <TextInput
                    style={[
                      styles.cardFormInputText,
                      { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                    ]}
                    placeholder="John Doe"
                    placeholderTextColor={theme === "dark" ? "#666666" : "#AAAAAA"}
                    value={cardName}
                    onChangeText={setCardName}
                  />
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={theme === "dark" ? "#BBBBBB" : "#666666"}
                  />
                </View>
              </View>
              
              <View style={styles.cardFormRow}>
                <View style={[styles.cardFormField, { flex: 1, marginRight: 8 }]}>
                  <Text
                    style={[
                      styles.cardFormLabel,
                      { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                    ]}
                  >
                    Expiry Date
                  </Text>
                  <View
                    style={[
                      styles.cardFormInput,
                      { backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5" },
                    ]}
                  >
                    <TextInput
                      style={[
                        styles.cardFormInputText,
                        { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                      ]}
                      placeholder="MM/YY"
                      placeholderTextColor={theme === "dark" ? "#666666" : "#AAAAAA"}
                      keyboardType="number-pad"
                      maxLength={5}
                      value={cardExpiry}
                      onChangeText={(text) => setCardExpiry(formatExpiry(text))}
                    />
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={theme === "dark" ? "#BBBBBB" : "#666666"}
                    />
                  </View>
                </View>
                
                <View style={[styles.cardFormField, { flex: 1, marginLeft: 8 }]}>
                  <Text
                    style={[
                      styles.cardFormLabel,
                      { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                    ]}
                  >
                    CVV
                  </Text>
                  <View
                    style={[
                      styles.cardFormInput,
                      { backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5" },
                    ]}
                  >
                    <TextInput
                      style={[
                        styles.cardFormInputText,
                        { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                      ]}
                      placeholder="123"
                      placeholderTextColor={theme === "dark" ? "#666666" : "#AAAAAA"}
                      keyboardType="number-pad"
                      maxLength={4}
                      secureTextEntry
                      value={cardCvv}
                      onChangeText={setCardCvv}
                    />
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={theme === "dark" ? "#BBBBBB" : "#666666"}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          )}
          
          {/* Payment Button */}
          <TouchableOpacity
            style={[
              styles.payButton,
              { backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
            ]}
            onPress={handlePayment}
          >
            <Text style={styles.payButtonText}>Pay ₹{calculatedTotal}</Text>
          </TouchableOpacity>
          
          {/* Security Note */}
          <View style={styles.securityNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={theme === "dark" ? "#BBBBBB" : "#666666"}
              style={styles.securityIcon}
            />
            <Text
              style={[
                styles.securityText,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
            >
              Your payment information is secure and encrypted
            </Text>
          </View>
        </Animated.ScrollView>
      ) : (
        <Animated.View
    style={[
      styles.processingContainer,
      {
        opacity: processAnim,
      },
    ]}
  >
    {processingSuccess ? (
      <View style={styles.successIconContainer}>
        <Ionicons 
          name="checkmark-circle" 
          size={100} 
          color={theme === "dark" ? "#00E5FF" : "#0066CC"} 
        />
      </View>
    ) : (
      <View style={styles.processingIconContainer}>
        <Ionicons 
          name="refresh-circle" 
          size={100} 
          color={theme === "dark" ? "#00E5FF" : "#0066CC"} 
          style={styles.spinningIcon}
        />
      </View>
    )}
    
    <Text
      style={[
        styles.processingText,
        { color: theme === "dark" ? "#FFFFFF" : "#000000" },
      ]}
    >
      {processingSuccess ? "Payment Successful!" : "Processing Payment..."}
    </Text>
    
    {!processingSuccess && (
      <Text
        style={[
          styles.processingSubtext,
          { color: theme === "dark" ? "#BBBBBB" : "#666666" },
        ]}
      >
        Please do not close this screen
      </Text>
    )}
  </Animated.View>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryItems: {
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  summaryItemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  summaryItemDetails: {
    flex: 1,
  },
  summaryItemTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  summaryItemQuantity: {
    fontSize: 12,
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paymentMethodsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  paymentMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  selectedPaymentMethod: {
    borderWidth: 2,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  paymentMethodSubtitle: {
    fontSize: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardFormContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardFormHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardFormTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardIcons: {
    flexDirection: "row",
  },
  cardIcon: {
    marginLeft: 8,
  },
  cardFormField: {
    marginBottom: 16,
  },
  cardFormLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardFormInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  cardFormInputText: {
    flex: 1,
    fontSize: 16,
  },
  cardFormRow: {
    flexDirection: "row",
  },
  payButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  securityIcon: {
    marginRight: 8,
  },
  securityText: {
    fontSize: 12,
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  processingText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  processingSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  successIconContainer: {
    marginBottom: 20,
  },
  processingIconContainer: {
    marginBottom: 20,
  },
  spinningIcon: {
    animationKeyframes: [
      { '0%': { transform: [{ rotate: '0deg' }] }},
      { '100%': { transform: [{ rotate: '360deg' }] }}
    ],
    animationDuration: '2000ms',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
});

export default PaymentMethodSelection;