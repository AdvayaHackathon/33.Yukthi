import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Platform,
  Easing,
  ImageBackground,
  RefreshControl,
  Modal,
  BlurView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BarCodeScanner } from "expo-barcode-scanner";
import { categories, products } from "./constants";
import { useCart } from "./CartContext";
import { Video } from "expo-av";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import { SharedElement } from "react-navigation-shared-element";
import { BlurView as ExpoBlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.20; // Slightly larger than before
const CARD_HEIGHT = CARD_WIDTH * 1.5; // Less tall aspect ratio
const SPACING = width * 0.03;
const BANNER_HEIGHT = height * 0.25;
const CATEGORY_HEIGHT = 44;

// Shimmer effect for loading state
const Shimmer = ({ width, height, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: "#E0E0E0",
          overflow: "hidden",
          borderRadius: 8,
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          transform: [{ translateX }],
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      />
    </View>
  );
};

// Product Card Component with animations
const ProductCard = ({
  id,
  title,
  rentPrice,
  shopName,
  images,
  available,
  onPress,
  isFavorite,
  onFavoriteToggle,
  index,
  theme,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.bezier(0.2, 0.65, 0.4, 0.9),
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleFavoriteToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onFavoriteToggle(id);
  };

  return (
    <Animated.View
      style={[
        styles.productCardContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.productCardTouchable}
      >
        <SharedElement id={`item.${id}.image`}>
          <View style={styles.productImageContainer}>
            <Image
              source={images[0]}
              style={styles.productImage}
              resizeMode="cover"
            />
            {available <= 0 && (
              <LinearGradient
                colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.5)"]}
                style={styles.outOfStockOverlay}
              >
                <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
              </LinearGradient>
            )}
            {available <= 2 && available > 0 && (
              <View style={styles.lowStockBadge}>
                <Text style={styles.lowStockText}>{available} LEFT</Text>
              </View>
            )}
          </View>
        </SharedElement>

        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
          ]}
          onPress={handleFavoriteToggle}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? "#FFFFFF" : "#FFFFFF"}
          />
        </TouchableOpacity>

        <View style={styles.productCardContent}>
          <SharedElement id={`item.${id}.title`}>
            <Text
              style={[
                styles.productTitle,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </SharedElement>
          <Text
            style={[
              styles.shopName,
              { color: theme === "dark" ? "#BBBBBB" : "#666666" },
            ]}
            numberOfLines={1}
          >
            {shopName}
          </Text>
          <View style={styles.productFooter}>
            <Text
              style={[
                styles.price,
                { color: theme === "dark" ? "#00E5FF" : "#0066CC" },
              ]}
            >
              ₹{rentPrice}
              <Text
                style={[
                  styles.perDay,
                  { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                ]}
              >
                /day
              </Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Category Button with animations
const CategoryButton = ({ name, isActive, onPress, theme }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.categoryButton,
          isActive && styles.activeCategoryButton,
          {
            backgroundColor: isActive
              ? theme === "dark"
                ? "#00E5FF"
                : "#0066CC"
              : theme === "dark"
              ? "#333333"
              : "#F5F5F5",
          },
        ]}
      >
        <Text
          style={[
            styles.categoryText,
            isActive && styles.activeCategoryText,
            {
              color: isActive
                ? "#FFFFFF"
                : theme === "dark"
                ? "#FFFFFF"
                : "#333333",
            },
          ]}
        >
          {name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Featured Item Component
const FeaturedItem = ({ item, onPress, theme }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.featuredItemContainer,
        { backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF" },
      ]}
    >
      <ImageBackground
        source={item.images[0]}
        style={styles.featuredItemImage}
        imageStyle={styles.featuredItemImageStyle}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.featuredItemGradient}
        >
          <View style={styles.featuredItemContent}>
            <Text style={styles.featuredItemTitle}>{item.title}</Text>
            <Text style={styles.featuredItemShop}>{item.shopName}</Text>
            <View style={styles.featuredItemPriceContainer}>
              <Text style={styles.featuredItemPrice}>₹{item.rentPrice}/day</Text>
              <TouchableOpacity style={styles.featuredItemButton}>
                <Text style={styles.featuredItemButtonText}>Rent Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// Main Component
export default function Gears({ navigation }) {
  // Context and state
  const {
    getRentCartCount,
    isFavorite,
    toggleFavorite,
    addToRecentlyViewed,
    getRecentlyViewedProducts,
    getRecommendedProducts,
    theme,
    toggleTheme,
  } = useCart();
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const cartBounceAnim = useRef(new Animated.Value(1)).current;
  const lottieRef = useRef(null);
  
  // Get cart count
  const cartCount = getRentCartCount();
  
  // Get recently viewed and recommended products
  const recentlyViewedProducts = getRecentlyViewedProducts();
  const recommendedProducts = getRecommendedProducts();
  
  // Featured items (top 3 items with highest rent price)
  const featuredItems = [...products]
    .sort((a, b) => b.rentPrice - a.rentPrice)
    .slice(0, 3);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Animate cart badge when count changes
  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.timing(cartBounceAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(cartBounceAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartCount]);

  // Handle QR code scan
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Animate success
    if (lottieRef.current) {
      lottieRef.current.play();
    }
    
    setTimeout(() => {
      setShowScanner(false);
      navigation.navigate("ProductDetails", {
        id: parseInt(data) || 1, // Fallback to first product if invalid
      });
    }, 1500);
  };

  // Handle category selection
  const handleCategoryPress = (category) => {
    Haptics.selectionAsync();
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      setSelectedCategories([category]);
    }
  };

  // Filter products based on selected categories, search, and active tab
  const getFilteredProducts = () => {
    let filtered = [...products];
    
    // Filter by tab
    if (activeTab === "favorites") {
      filtered = filtered.filter(product => isFavorite(product.id));
    }
    
    // Filter by category
    if (!selectedCategories.includes("All")) {
      filtered = filtered.filter(product =>
        product.category && product.category.includes(selectedCategories[0])
      );
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.shopName.toLowerCase().includes(query) ||
        (product.category && product.category.some(cat => 
          cat.toLowerCase().includes(query))
        )
      );
    }
    
    return filtered;
  };

  // Generate search suggestions
  const generateSearchSuggestions = (text) => {
    if (!text.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const suggestions = products
      .filter(
        (product) =>
          product.title.toLowerCase().includes(text.toLowerCase()) ||
          product.shopName.toLowerCase().includes(text.toLowerCase()) ||
          (Array.isArray(product.category) && 
            product.category.some(cat => 
              cat.toLowerCase().includes(text.toLowerCase())
            ))
      )
      .map((product) => ({ 
        id: product.id,
        title: product.title, 
        shopName: product.shopName,
        image: product.images[0]
      }))
      .slice(0, 5);
      
    setSearchSuggestions(suggestions);
    setShowSuggestions(true);
  };

  // Handle search input change
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    generateSearchSuggestions(text);
  };

  // Handle search suggestion selection
  const handleSuggestionPress = (suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    setShowSearchModal(false);
    
    // Navigate to product details
    const product = products.find(p => p.id === suggestion.id);
    if (product) {
      handleProductPress(product);
    }
  };

  // Handle product selection
  const handleProductPress = (product) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToRecentlyViewed(product.id);
    
    navigation.navigate("ProductDetails", {
      id: product.id,
      title: product.title,
      price: product.price,
      rentPrice: product.rentPrice,
      shopName: product.shopName,
      images: product.images,
      available: product.available,
      description: product.description,
      category: product.category,
      location: product.location,
    });
  };

  // Handle pull-to-refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Get filtered products
  const filteredProducts = getFilteredProducts();

  // Header animation based on scroll position
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });
  
  const headerOpacityValue = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  // Render QR code scanner
  if (showScanner) {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* Scan overlay */}
        <View style={styles.scannerOverlay}>
          <View style={styles.scanFrame}>
            <View style={styles.scanCorner} />
            <View style={styles.scanCorner} />
            <View style={styles.scanCorner} />
            <View style={styles.scanCorner} />
          </View>
          
          <Text style={styles.scannerTitle}>Scan QR Code</Text>
          <Text style={styles.scannerText}>
            Position the QR code within the frame to scan
          </Text>
          
          {scanned && (
            <View style={styles.scanSuccessContainer}>
              <View style={styles.scanSuccessContainer}>
  <Ionicons 
    name="checkmark-circle" 
    size={100} 
    color="#00E5FF" 
  />
  <Text style={styles.scanSuccessText}>Scan Successful!</Text>
</View>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.closeScannerButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setShowScanner(false);
          }}
        >
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF" }]}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
        
        {/* Header shimmer */}
        <View style={styles.loadingHeader}>
          <Shimmer width={120} height={40} style={styles.logoShimmer} />
          <View style={styles.headerRightShimmer}>
            <Shimmer width={40} height={40} style={styles.iconShimmer} />
            <Shimmer width={40} height={40} style={styles.iconShimmer} />
          </View>
        </View>
        
        {/* Search bar shimmer */}
        <View style={styles.searchContainerShimmer}>
          <Shimmer width={width - 32} height={50} style={styles.searchBarShimmer} />
        </View>
        
        {/* Categories shimmer */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesShimmerContainer}
        >
          {[...Array(8)].map((_, i) => (
            <Shimmer
              key={i}
              width={80}
              height={CATEGORY_HEIGHT}
              style={styles.categoryShimmer}
            />
          ))}
        </ScrollView>
        
        {/* Banner shimmer */}
        <Shimmer
          width={width - 32}
          height={BANNER_HEIGHT}
          style={styles.bannerShimmer}
        />
        
        {/* Products grid shimmer */}
        <View style={styles.productsGridShimmer}>
          {[...Array(4)].map((_, i) => (
            <Shimmer
              key={i}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              style={styles.productCardShimmer}
            />
          ))}
        </View>
        
        <Ionicons 
  name="refresh" 
  size={64} 
  color={theme === "dark" ? "#00E5FF" : "#0066CC"} 
  style={styles.loadingIcon}
/>
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
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacityValue,
            backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF",
          },
        ]}
      >
        <Image
          source={theme === "dark" ? require("@/assets/Ecom/EcomLogo.png") : require("@/assets/Ecom/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleTheme();
            }}
          >
            <Ionicons
              name={theme === "dark" ? "sunny" : "moon"}
              size={24}
              color={theme === "dark" ? "#FFFFFF" : "#333333"}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowScanner(true);
            }}
          >
            <Ionicons
              name="qr-code"
              size={24}
              color={theme === "dark" ? "#FFFFFF" : "#333333"}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("Cart");
            }}
          >
            <Ionicons
              name="cart"
              size={24}
              color={theme === "dark" ? "#FFFFFF" : "#333333"}
            />
            {cartCount > 0 && (
              <Animated.View
                style={[
                  styles.cartBadge,
                  { transform: [{ scale: cartBounceAnim }] },
                ]}
              >
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </Animated.View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Search Bar (Floating) */}
      <Animated.View
        style={[
          styles.floatingSearchContainer,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [-100, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
            opacity: scrollY.interpolate({
              inputRange: [0, 50, 100],
              outputRange: [0, 0.5, 1],
              extrapolate: 'clamp',
            }),
            backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.floatingSearchBar}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowSearchModal(true);
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme === "dark" ? "#BBBBBB" : "#666666"}
          />
          <Text
            style={[
              styles.floatingSearchText,
              { color: theme === "dark" ? "#BBBBBB" : "#666666" },
            ]}
          >
            Search beach gear...
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowFilterModal(true);
          }}
        >
          <Ionicons
            name="options"
            size={20}
            color={theme === "dark" ? "#FFFFFF" : "#333333"}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Platform.OS === 'ios' ? 100 : 120 },
        ]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme === "dark" ? "#00E5FF" : "#0066CC"}
            colors={[theme === "dark" ? "#00E5FF" : "#0066CC"]}
          />
        }
      >
        {/* Search Bar (Static) */}
        <TouchableOpacity
          style={[
            styles.searchContainer,
            { backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF" },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowSearchModal(true);
          }}
        >
          <View
            style={[
              styles.searchBar,
              { backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5" },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={theme === "dark" ? "#BBBBBB" : "#666666"}
            />
            <Text
              style={[
                styles.searchPlaceholder,
                { color: theme === "dark" ? "#BBBBBB" : "#666666" },
              ]}
            >
              Search beach gear...
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowFilterModal(true);
            }}
          >
            <Ionicons
              name="options"
              size={20}
              color={theme === "dark" ? "#FFFFFF" : "#333333"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        
        {/* Featured Banner */}
        <View style={styles.bannerContainer}>
          <FlatList
            data={featuredItems}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `featured-${item.id}`}
            renderItem={({ item }) => (
              <FeaturedItem
                item={item}
                onPress={() => handleProductPress(item)}
                theme={theme}
              />
            )}
            snapToInterval={width - 32}
            decelerationRate="fast"
            contentContainerStyle={styles.featuredListContent}
          />
        </View>
        
        {/* Categories */}
        <View style={styles.categoriesWrapper}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme === "dark" ? "#FFFFFF" : "#000000" },
              ]}
            >
              Categories
            </Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <CategoryButton
                key={index}
                name={category}
                isActive={selectedCategories.includes(category)}
                onPress={() => handleCategoryPress(category)}
                theme={theme}
              />
            ))}
          </ScrollView>
        </View>
        
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
              activeTab === "all" && styles.activeTab,
              activeTab === "all" && {
                backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
              },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab("all");
            }}
          >
            <Ionicons
              name="grid"
              size={18}
              color={
                activeTab === "all"
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
                activeTab === "all" && styles.activeTabText,
                {
                  color:
                    activeTab === "all"
                      ? "#FFFFFF"
                      : theme === "dark"
                      ? "#FFFFFF"
                      : "#333333",
                },
              ]}
            >
              All Items
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "favorites" && styles.activeTab,
              activeTab === "favorites" && {
                backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
              },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab("favorites");
            }}
          >
            <Ionicons
              name="heart"
              size={18}
              color={
                activeTab === "favorites"
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
                activeTab === "favorites" && styles.activeTabText,
                {
                  color:
                    activeTab === "favorites"
                      ? "#FFFFFF"
                      : theme === "dark"
                      ? "#FFFFFF"
                      : "#333333",
                },
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
          
        {/* Main Products Grid */}
        <View style={styles.productsSection}>
  <View style={styles.sectionHeader}>
    <Text style={[styles.sectionTitle, { color: theme === "dark" ? "#FFFFFF" : "#000000" }]}>
      {activeTab === "favorites" ? "Your Favorites" : "All Beach Gear"}
    </Text>
    <Text style={[styles.itemCount, { color: theme === "dark" ? "#BBBBBB" : "#666666" }]}>
      {filteredProducts.length} items
    </Text>
  </View>

  {filteredProducts.length === 0 ? (
    <View style={styles.emptyState}>
      {activeTab === "favorites" ? (
        <Ionicons 
          name="heart-dislike-outline" 
          size={100} 
          color={theme === "dark" ? "#555555" : "#CCCCCC"} 
          style={styles.emptyIcon}
        />
      ) : (
        <Ionicons 
          name="search-outline" 
          size={100} 
          color={theme === "dark" ? "#555555" : "#CCCCCC"} 
          style={styles.emptyIcon}
        />
      )}
      <Text style={[styles.emptyTitle, { color: theme === "dark" ? "#FFFFFF" : "#000000" }]}>
        {activeTab === "favorites"
          ? "No favorites yet"
          : "No items found"}
      </Text>
      <Text style={[styles.emptyText, { color: theme === "dark" ? "#BBBBBB" : "#666666" }]}>
        {activeTab === "favorites"
          ? "Items you like will appear here"
          : "Try adjusting your filters or search"}
      </Text>
      
      {activeTab === "favorites" && (
        <TouchableOpacity
          style={[
            styles.emptyButton,
            { backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
          ]}
          onPress={() => setActiveTab("all")}
        >
          <Text style={styles.emptyButtonText}>Explore Items</Text>
        </TouchableOpacity>
      )}
    </View>
  ) : (
    <View style={styles.productsGridContainer}>
      {filteredProducts.map((product, index) => (
        <View key={`grid-${product.id}`} style={styles.productCardWrapper}>
          <ProductCard
            id={product.id}
            title={product.title}
            rentPrice={product.rentPrice}
            shopName={product.shopName}
            images={product.images}
            available={product.available}
            onPress={() => handleProductPress(product)}
            isFavorite={isFavorite(product.id)}
            onFavoriteToggle={toggleFavorite}
            index={index}
            theme={theme}
          />
        </View>
      ))}
    </View>
  )}
</View>
      </Animated.ScrollView>
      
      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme === "dark" ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.5)" },
          ]}
        >
          <View
            style={[
              styles.searchModalContent,
              { backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF" },
            ]}
          >
            <View style={styles.searchModalHeader}>
              <TouchableOpacity
                style={styles.searchModalBackButton}
                onPress={() => setShowSearchModal(false)}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={theme === "dark" ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
              
              <View
                style={[
                  styles.searchModalInputContainer,
                  { backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5" },
                ]}
              >
                <Ionicons
                  name="search"
                  size={20}
                  color={theme === "dark" ? "#BBBBBB" : "#666666"}
                />
                <TextInput
                  style={[
                    styles.searchModalInput,
                    { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                  ]}
                  placeholder="Search beach gear..."
                  placeholderTextColor={theme === "dark" ? "#BBBBBB" : "#666666"}
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  autoFocus={true}
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={theme === "dark" ? "#BBBBBB" : "#666666"}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 ? (
              <FlatList
                data={searchSuggestions}
                keyExtractor={(item, index) => `suggestion-${item.id}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(item)}
                  >
                    <Image
                      source={item.image}
                      style={styles.suggestionImage}
                      resizeMode="cover"
                    />
                    <View style={styles.suggestionContent}>
                      <Text
                        style={[
                          styles.suggestionTitle,
                          { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                        ]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={[
                          styles.suggestionShop,
                          { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                        ]}
                        numberOfLines={1}
                      >
                        {item.shopName}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme === "dark" ? "#BBBBBB" : "#666666"}
                    />
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.suggestionsContainer}
              />
            ) : searchQuery ? (
              <View style={styles.noSuggestionsContainer}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={theme === "dark" ? "#BBBBBB" : "#CCCCCC"}
                />
                <Text
                  style={[
                    styles.noSuggestionsText,
                    { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  No results found for "{searchQuery}"
                </Text>
                <Text
                  style={[
                    styles.noSuggestionsSubtext,
                    { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                  ]}
                >
                  Try different keywords or browse categories
                </Text>
              </View>
            ) : (
              <View style={styles.recentSearchesContainer}>
                <Text
                  style={[
                    styles.recentSearchesTitle,
                    { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  Popular Categories
                </Text>
                <View style={styles.popularCategoriesContainer}>
                  {categories.slice(1, 7).map((category, index) => (
                    <TouchableOpacity
                      key={`popular-${index}`}
                      style={[
                        styles.popularCategoryButton,
                        {
                          backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5",
                        },
                      ]}
                      onPress={() => {
                        setSearchQuery(category);
                        setShowSearchModal(false);
                        handleCategoryPress(category);
                      }}
                    >
                      <Text
                        style={[
                          styles.popularCategoryText,
                          { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme === "dark" ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.5)" },
          ]}
        >
          <View
            style={[
              styles.filterModalContent,
              { backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF" },
            ]}
          >
            <View style={styles.filterModalHeader}>
              <Text
                style={[
                  styles.filterModalTitle,
                  { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                ]}
              >
                Filter & Sort
              </Text>
              <TouchableOpacity
                style={styles.filterModalCloseButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme === "dark" ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filterModalBody}>
              {/* Sort Options */}
              <View style={styles.filterSection}>
                <Text
                  style={[
                    styles.filterSectionTitle,
                    { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  Sort By
                </Text>
                
                <View style={styles.sortOptionsContainer}>
                  {[
                    { id: "recommended", label: "Recommended" },
                    { id: "priceLowToHigh", label: "Price: Low to High" },
                    { id: "priceHighToLow", label: "Price: High to Low" },
                    { id: "newest", label: "Newest First" },
                    { id: "availability", label: "Availability" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.sortOption,
                        sortBy === option.id && styles.sortOptionActive,
                        sortBy === option.id && {
                          backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
                        },
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSortBy(option.id);
                      }}
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
                          sortBy === option.id && styles.sortOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Categories */}
              <View style={styles.filterSection}>
                <Text
                  style={[
                    styles.filterSectionTitle,
                    { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  Categories
                </Text>
                
                <View style={styles.filterCategoriesContainer}>
                  {categories.map((category, index) => (
                    <TouchableOpacity
                      key={`filter-${index}`}
                      style={[
                        styles.filterCategoryButton,
                        selectedCategories.includes(category) &&
                          styles.filterCategoryButtonActive,
                        selectedCategories.includes(category) && {
                          backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
                        },
                      ]}
                      onPress={() => handleCategoryPress(category)}
                    >
                      <Text
                        style={[
                          styles.filterCategoryText,
                          selectedCategories.includes(category) &&
                            styles.filterCategoryTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text
                  style={[
                    styles.filterSectionTitle,
                    { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  Price Range (₹/day)
                </Text>
                
                <View style={styles.priceRangeContainer}>
                  <Text
                    style={[
                      styles.priceRangeValue,
                      { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </Text>
                  
                  {/* Custom price range slider would go here */}
                  <View
                    style={[
                      styles.priceRangeSlider,
                      { backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5" },
                    ]}
                  >
                    <View
                      style={[
                        styles.priceRangeProgress,
                        {
                          backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
                        },
                      ]}
                    />
                  </View>
                  
                  <View style={styles.priceRangeLabels}>
                    <Text
                      style={[
                        styles.priceRangeLabel,
                        { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                      ]}
                    >
                      ₹0
                    </Text>
                    <Text
                      style={[
                        styles.priceRangeLabel,
                        { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                      ]}
                    >
                      ₹500
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.filterModalFooter}>
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  {
                    backgroundColor: theme === "dark" ? "#333333" : "#F5F5F5",
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSelectedCategories(["All"]);
                  setSortBy("recommended");
                  setPriceRange([0, 500]);
                }}
              >
                <Text
                  style={[
                    styles.resetButtonText,
                    { color: theme === "dark" ? "#FFFFFF" : "#333333" },
                  ]}
                >
                  Reset All
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.applyButton,
                  {
                    backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setShowFilterModal(false);
                }}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 40,
    width: 150,
    resizeMode: "contain",
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  cartButton: {
    padding: 8,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  floatingSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9,
    elevation: 9,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  floatingSearchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  floatingSearchText: {
    flex: 1,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  bannerContainer: {
    marginBottom: 16,
  },
  featuredListContent: {
    paddingHorizontal: 16,
  },
  featuredItemContainer: {
    width: width - 32,
    height: BANNER_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16,
  },
  featuredItemImage: {
    width: "100%",
    height: "100%",
  },
  featuredItemImageStyle: {
    borderRadius: 16,
  },
  featuredItemGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 16,
  },
  featuredItemContent: {
    width: "100%",
  },
  featuredItemTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  featuredItemShop: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 12,
  },
  featuredItemPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredItemPrice: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  featuredItemButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featuredItemButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  itemCount: {
    fontSize: 14,
  },
  categoriesWrapper: {
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryButton: {
    height: CATEGORY_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  activeCategoryButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeCategoryText: {
    fontWeight: "700",
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
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
  recentlyViewedSection: {
    marginBottom: 16,
  },
  recentlyViewedContainer: {
    paddingHorizontal: 16,
  },
  productsSection: {
    flex: 1,
  },
  productsGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%', // This ensures 2 columns with a small gap
    marginBottom: 16,
  },
  productCardContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productCardTouchable: {
    width: "100%",
    height: "100%",
  },
  productImageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    position: 'relative',
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
  lowStockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF9500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lowStockText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButtonActive: {
    backgroundColor: "#FF3B30",
  },
  productCardContent: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  shopName: {
    fontSize: 12,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
  },
  perDay: {
    fontSize: 12,
    fontWeight: "normal",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyAnimation: {
    width: 200,
    height: 200,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  searchModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    height: height * 0.9,
  },
  searchModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  searchModalBackButton: {
    padding: 8,
    marginRight: 8,
  },
  searchModalInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  searchModalInput: {
    flex: 1,
    fontSize: 16,
  },
  suggestionsContainer: {
    paddingTop: 8,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  suggestionImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  suggestionShop: {
    fontSize: 14,
  },
  noSuggestionsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 32,
  },
  noSuggestionsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  noSuggestionsSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  recentSearchesContainer: {
    padding: 16,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  popularCategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  popularCategoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  popularCategoryText: {
    fontWeight: "500",
  },
  filterModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    height: height * 0.8,
  },
  filterModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterModalCloseButton: {
    padding: 8,
  },
  filterModalBody: {
    flex: 1,
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sortOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  sortOptionActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sortOptionText: {
    fontWeight: "500",
    color: "#333333",
  },
  sortOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  filterCategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterCategoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  filterCategoryButtonActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterCategoryText: {
    fontWeight: "500",
    color: "#333333",
  },
  filterCategoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  priceRangeContainer: {
    marginTop: 8,
  },
  priceRangeValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  priceRangeSlider: {
    height: 6,
    borderRadius: 3,
    position: "relative",
  },
  priceRangeProgress: {
    position: "absolute",
    left: "20%",
    right: "20%",
    height: "100%",
    borderRadius: 3,
  },
  priceRangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  priceRangeLabel: {
    fontSize: 14,
  },
  filterModalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },
  resetButtonText: {
    fontWeight: "bold",
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 16,
    position: "relative",
    marginBottom: 32,
  },
  scanCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#00E5FF",
    borderWidth: 4,
  },
  scannerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  scannerText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  scanSuccessContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanSuccessAnimation: {
    width: 200,
    height: 200,
  },
  closeScannerButton: {
    position: "absolute",
    top: 48,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
  },
  logoShimmer: {
    borderRadius: 8,
  },
  headerRightShimmer: {
    flexDirection: "row",
  },
  iconShimmer: {
    borderRadius: 20,
    marginLeft: 8,
  },
  searchContainerShimmer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBarShimmer: {
    borderRadius: 12,
  },
  categoriesShimmerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryShimmer: {
    borderRadius: 22,
    marginRight: 12,
  },
  bannerShimmer: {
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  productsGridShimmer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  productCardShimmer: {
    borderRadius: 16,
    marginBottom: 16,
  },
  loadingAnimation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  loadingIcon: {
    marginBottom: 16,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  scanSuccessText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});