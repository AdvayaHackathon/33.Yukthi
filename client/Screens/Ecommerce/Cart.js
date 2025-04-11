import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "./CartContext";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import { SharedElement } from "react-navigation-shared-element";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.2;

const Cart = ({ navigation }) => {
  const { 
    rentCartItems, 
    paidRentItems, 
    theme, 
    removeFromRentCart, 
    updateRentQuantity, 
    getTotalRentCartAmount, 
    clearRentCart 
  } = useCart();
  
  const [activeTab, setActiveTab] = useState("cart");
  const [isLoading, setIsLoading] = useState(true);
  const [showReturnInfo, setShowReturnInfo] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const deleteModalAnim = useRef(new Animated.Value(0)).current;
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Filter items based on active tab
  const getFilteredItems = () => {
    const now = new Date();
    
    if (activeTab === "cart") {
      return rentCartItems;
    } else if (activeTab === "active") {
      return paidRentItems.filter(item => {
        const returnDate = new Date(item.returnDate);
        return returnDate > now;
      });
    } else if (activeTab === "completed") {
      return paidRentItems.filter(item => {
        const returnDate = new Date(item.returnDate);
        return returnDate <= now;
      });
    } else if (activeTab === "favorites") {
      // Only show items that are actually favorited
      return products.filter(product => isFavorite(product.id));
    }
    
    return [];
  };
  
  const filteredItems = getFilteredItems();
  const totalAmount = getTotalRentCartAmount();
  const depositAmount = rentCartItems.length > 0 ? 500 : 0;
  const finalAmount = totalAmount + depositAmount;

  // Handle delete item
  const handleDeleteItem = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setItemToDelete(item);
    setShowDeleteConfirm(true);
    
    Animated.timing(deleteModalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const confirmDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (itemToDelete) {
      removeFromRentCart(itemToDelete.id);
    }
    
    Animated.timing(deleteModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    });
  };
  
  const cancelDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.timing(deleteModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    });
  };
  
  // Handle quantity change
  const handleQuantityChange = (item, change) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newQuantity = Math.max(1, (item.quantity || 1) + change);
    updateRentQuantity(item.id, newQuantity);
  };
  
  // Handle checkout
  const handleCheckout = () => {
    if (rentCartItems.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before checkout.");
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    navigation.navigate("PaymentMethodSelection", {
      cartItems: rentCartItems,
      totalAmount: finalAmount,
      isRent: true,
    });
  };

  // Render cart item
  const renderCartItem = ({ item, index }) => {
    // Animation for card entry
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);
    
    return (
      <Animated.View
        style={[
          styles.cartItemContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("ProductDetails", { id: item.id });
          }}
          style={styles.cartItemTouchable}
        >
          <SharedElement id={`item.${item.id}.image`}>
            <Image
              source={item.images ? item.images[0] : require("@/assets/images/beach1.jpg")}
              style={styles.itemImage}
              defaultSource={require("@/assets/images/beach1.jpg")}
            />
          </SharedElement>
          
          <View style={styles.itemContent}>
            <SharedElement id={`item.${item.id}.title`}>
              <Text
                style={[
                  styles.itemTitle,
                  { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </SharedElement>
            
            <Text
              style={[
                styles.shopName,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
              numberOfLines={1}
            >
              {item.shopName}
            </Text>
            
            <Text
              style={[
                styles.rentalPrice,
                { color: theme === "dark" ? "#00E5FF" : "#0066CC" },
              ]}
            >
              ₹{item.rentPrice}/day
            </Text>
            
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  { backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5" },
                ]}
                onPress={() => handleQuantityChange(item, -1)}
                disabled={(item.quantity || 1) <= 1}
              >
                <Ionicons
                  name="remove"
                  size={16}
                  color={theme === "dark" ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
              
              <Text
                style={[
                  styles.quantityText,
                  { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                ]}
              >
                {item.quantity || 1}
              </Text>
              
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  { backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5" },
                ]}
                onPress={() => handleQuantityChange(item, 1)}
              >
                <Ionicons
                  name="add"
                  size={16}
                  color={theme === "dark" ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteItem(item)}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#FF3B30"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  // Render rental item card
  const renderRentalItem = ({ item, index }) => {
    // Calculate time remaining
    const now = new Date();
    const returnDate = new Date(item.returnDate || now);
    const timeRemaining = returnDate - now;
    const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));
    const minutesRemaining = Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)));
    
    // Determine status color
    let statusColor = "#4CAF50"; // Green for plenty of time
    let statusText = "Active";
    
    if (timeRemaining <= 0) {
      statusColor = "#9E9E9E"; // Gray for completed
      statusText = "Completed";
    } else if (hoursRemaining < 2) {
      statusColor = "#FF9500"; // Orange for < 2 hours
      statusText = "Ending Soon";
    } else if (hoursRemaining < 1) {
      statusColor = "#FF3B30"; // Red for < 1 hour
      statusText = "Return Now";
    }
    
    // Animation for card entry
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);
    
    return (
      <Animated.View
        style={[
          styles.rentalItemContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("ProductDetails", { id: item.id });
          }}
          style={styles.rentalItemTouchable}
        >
          <SharedElement id={`rental.${item.id}.image`}>
            <Image
              source={item.images ? item.images[0] : require("@/assets/images/beach1.jpg")}
              style={styles.itemImage}
              defaultSource={require("@/assets/images/beach1.jpg")}
            />
          </SharedElement>
          
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <SharedElement id={`rental.${item.id}.title`}>
                <Text
                  style={[
                    styles.itemTitle,
                    { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
              </SharedElement>
              
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColor },
                ]}
              >
                <Text style={styles.statusText}>{statusText}</Text>
              </View>
            </View>
            
            <Text
              style={[
                styles.shopName,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
              numberOfLines={1}
            >
              {item.shopName}
            </Text>
            
            <Text
              style={[
                styles.rentalPrice,
                { color: theme === "dark" ? "#00E5FF" : "#0066CC" },
              ]}
            >
              ₹{item.rentPrice}/day
            </Text>
            
            <View style={styles.timeContainer}>
              {timeRemaining > 0 ? (
                <>
                  <Ionicons
                    name="time"
                    size={14}
                    color={statusColor}
                    style={styles.timeIcon}
                  />
                  <Text
                    style={[
                      styles.timeText,
                      { color: statusColor },
                    ]}
                  >
                    {hoursRemaining > 0
                      ? `${hoursRemaining}h ${minutesRemaining}m remaining`
                      : minutesRemaining > 0
                      ? `${minutesRemaining}m remaining`
                      : "Return now!"}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={statusColor}
                    style={styles.timeIcon}
                  />
                  <Text
                    style={[
                      styles.timeText,
                      { color: statusColor },
                    ]}
                  >
                    Returned
                  </Text>
                </>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (timeRemaining > 0) {
                navigation.navigate("QRCodeScanner");
              } else {
                Alert.alert(
                  "Rental Completed",
                  "This rental has already been completed. Would you like to rent this item again?",
                  [
                    {
                      text: "No",
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => navigation.navigate("ProductDetails", { id: item.id }),
                    },
                  ]
                );
              }
            }}
          >
            <Ionicons
              name={timeRemaining > 0 ? "qr-code" : "refresh"}
              size={20}
              color={theme === "dark" ? "#FFFFFF" : "#FFFFFF"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Header animation based on scroll position
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  
  const headerElevation = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 10],
    extrapolate: 'clamp',
  });

  // Render loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF" }]}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
        
        <View style={styles.loadingContainer}>
          <Ionicons 
            name="cart" 
            size={64} 
            color={theme === "dark" ? "#00E5FF" : "#0066CC"} 
            style={styles.loadingIcon}
          />
          <Text style={[styles.loadingText, { color: theme === "dark" ? "#FFFFFF" : "#000000" }]}>
            Loading your cart...
          </Text>
        </View>
      </View>
    );
  }
  

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#121212" : "#F8F9FA" }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            elevation: headerElevation,
            backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
            borderBottomColor: theme === "dark" ? "#333333" : "#F0F0F0",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
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
          {activeTab === "cart" ? "My Cart" : "My Rentals"}
        </Text>
        
        {activeTab === "cart" && rentCartItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert(
                "Clear Cart",
                "Are you sure you want to clear your cart?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Clear",
                    onPress: () => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      clearRentCart();
                    },
                    style: "destructive",
                  },
                ]
              );
            }}
          >
            <Text
              style={[
                styles.clearButtonText,
                { color: theme === "dark" ? "#FF3B30" : "#FF3B30" },
              ]}
            >
              Clear
            </Text>
          </TouchableOpacity>
        )}
        
        {(activeTab === "active" || activeTab === "completed") && (
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowReturnInfo(!showReturnInfo);
            }}
          >
            <Ionicons
              name="information-circle"
              size={24}
              color={theme === "dark" ? "#FFFFFF" : "#000000"}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {/* Tabs */}
      <View
        style={[
          styles.tabsContainer,
          { backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF" },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "cart" && styles.activeTab,
            activeTab === "cart" && {
              backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
            },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            setActiveTab("cart");
          }}
        >
          <Ionicons
            name="cart"
            size={18}
            color={
              activeTab === "cart"
                ? "#FFFFFF"
                : theme === "dark"
                ? "#FFFFFF"
                : "#333333"
            }
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "cart" && styles.activeTabText,
              {
                color:
                  activeTab === "cart"
                    ? "#FFFFFF"
                    : theme === "dark"
                    ? "#FFFFFF"
                    : "#333333",
              },
            ]}
          >
            Cart
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "active" && styles.activeTab,
            activeTab === "active" && {
              backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
            },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            setActiveTab("active");
          }}
        >
          <Ionicons
            name="time"
            size={18}
            color={
              activeTab === "active"
                ? "#FFFFFF"
                : theme === "dark"
                ? "#FFFFFF"
                : "#333333"
            }
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
              {
                color:
                  activeTab === "active"
                    ? "#FFFFFF"
                    : theme === "dark"
                    ? "#FFFFFF"
                    : "#333333",
              },
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "completed" && styles.activeTab,
            activeTab === "completed" && {
              backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
            },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            setActiveTab("completed");
          }}
        >
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={
              activeTab === "completed"
                ? "#FFFFFF"
                : theme === "dark"
                ? "#FFFFFF"
                : "#333333"
            }
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
              {
                color:
                  activeTab === "completed"
                    ? "#FFFFFF"
                    : theme === "dark"
                    ? "#FFFFFF"
                    : "#333333",
              },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Return Info Card (Collapsible) */}
      {showReturnInfo && (activeTab === "active" || activeTab === "completed") && (
        <Animated.View
          style={[
            styles.infoCard,
            { backgroundColor: theme === "dark" ? "#1E1E1E" : "#E3F2FD" },
          ]}
          entering={Animated.FadeInDown.duration(300)}
          exiting={Animated.FadeOutUp.duration(300)}
        >
          <View style={styles.infoCardHeader}>
            <MaterialCommunityIcons
              name="information"
              size={24}
              color={theme === "dark" ? "#00E5FF" : "#0066CC"}
              style={styles.infoIcon}
            />
            <Text
              style={[
                styles.infoTitle,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
            >
              Return Policy
            </Text>
            <TouchableOpacity
              style={styles.closeInfoButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowReturnInfo(false);
              }}
            >
              <Ionicons
                name="close"
                size={20}
                color={theme === "dark" ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
          </View>
          
          <Text
            style={[
              styles.infoText,
              { color: theme === "dark" ? "#BBBBBB" : "#333333" },
            ]}
          >
            • Please return all items to the same location where you picked them up.
          </Text>
          <Text
            style={[
              styles.infoText,
              { color: theme === "dark" ? "#BBBBBB" : "#333333" },
            ]}
          >
            • Late returns will incur additional charges at the daily rate.
          </Text>
          <Text
            style={[
              styles.infoText,
              { color: theme === "dark" ? "#BBBBBB" : "#333333" },
            ]}
          >
            • Scan the QR code at the return counter to complete your return.
          </Text>
          <Text
            style={[
              styles.infoText,
              { color: theme === "dark" ? "#BBBBBB" : "#333333" },
            ]}
          >
            • Your security deposit will be refunded after inspection.
          </Text>
        </Animated.View>
      )}
      
      {/* Main Content */}
      <Animated.FlatList
        data={filteredItems}
        renderItem={activeTab === "cart" ? renderCartItem : renderRentalItem}
        keyExtractor={(item) => 
          activeTab === "cart" 
            ? `cart-${item.id}` 
            : `rental-${item.id}-${item.rentalDate}`
        }
        contentContainerStyle={[
          styles.listContent,
          activeTab === "cart" && rentCartItems.length > 0 && { paddingBottom: 200 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            {activeTab === "cart" ? (
              <Ionicons 
                name="cart-outline" 
                size={100} 
                color={theme === "dark" ? "#555555" : "#CCCCCC"} 
                style={styles.emptyIcon}
              />
            ) : activeTab === "active" ? (
              <Ionicons 
                name="time-outline" 
                size={100} 
                color={theme === "dark" ? "#555555" : "#CCCCCC"} 
                style={styles.emptyIcon}
              />
            ) : (
              <Ionicons 
                name="checkmark-done-outline" 
                size={100} 
                color={theme === "dark" ? "#555555" : "#CCCCCC"} 
                style={styles.emptyIcon}
              />
            )}
            <Text
              style={[
                styles.emptyTitle,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
            >
              {activeTab === "cart"
                ? "Your cart is empty"
                : activeTab === "active"
                ? "No active rentals"
                : "No completed rentals"}
            </Text>
            <Text
              style={[
                styles.emptyText,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
            >
              {activeTab === "cart"
                ? "Add some beach gear to get started"
                : activeTab === "active"
                ? "Your rented beach gear will appear here"
                : "Your rental history will appear here"}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.browseButton,
                { backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate("Gears");
              }}
            >
              <Text style={styles.browseButtonText}>Browse Beach Gear</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{ opacity: fadeAnim }}
      />
      
      {/* Checkout Section */}
      {activeTab === "cart" && rentCartItems.length > 0 && (
        <View
          style={[
            styles.checkoutContainer,
            { backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF" },
          ]}
        >
          <View style={styles.summaryContainer}>
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
                ₹{totalAmount}
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
                ₹{depositAmount}
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
                ₹{finalAmount}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              { backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
            ]}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Floating Action Button */}
      {(activeTab === "active" || activeTab === "completed") && (
        <TouchableOpacity
          style={[
            styles.fab,
            { backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate("QRCodeScanner");
          }}
        >
          <Ionicons name="qr-code" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: deleteModalAnim },
          ]}
        >
          <Animated.View
            style={[
              styles.deleteModal,
              {
                backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                transform: [
                  {
                    scale: deleteModalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons
              name="trash-bin"
              size={40}
              color="#FF3B30"
              style={styles.deleteIcon}
            />
            
            <Text
              style={[
                styles.deleteTitle,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
            >
              Remove Item
            </Text>
            
            <Text
              style={[
                styles.deleteText,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
            >
              Are you sure you want to remove "{itemToDelete?.title}" from your cart?
            </Text>
            
            <View style={styles.deleteButtons}>
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  styles.cancelButton,
                  {
                    backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5",
                  },
                ]}
                onPress={cancelDelete}
              >
                <Text
                  style={[
                    styles.deleteButtonText,
                    { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  styles.confirmButton,
                  { backgroundColor: "#FF3B30" },
                ]}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
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
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  activeTab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontWeight: "600",
  },
  activeTabText: {
    fontWeight: "700",
  },
  tabIcon: {
    marginRight: 6,
  },
  infoCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  closeInfoButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  cartItemContainer: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 120,
  },
  cartItemTouchable: {
    flexDirection: "row",
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  rentalItemContainer: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: CARD_HEIGHT,
  },
  rentalItemTouchable: {
    flexDirection: "row",
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  itemImage: {
    width: 120,
    height: "100%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  itemContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  shopName: {
    fontSize: 14,
    marginBottom: 8,
  },
  rentalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeIcon: {
    marginRight: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  actionButton: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  deleteButton: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 32,
  },
  emptyAnimation: {
    width: 200,
    height: 200,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  summaryContainer: {
    marginBottom: 16,
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
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  checkoutButton: {
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIcon: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  deleteModal: {
    width: width * 0.8,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  deleteIcon: {
    marginBottom: 16,
  },
  deleteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  deleteText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  deleteButtons: {
    flexDirection: "row",
    width: "100%",
  },
  deleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    marginRight: 8,
  },
  confirmButton: {
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Cart;