import React, { createContext, useState, useContext, useEffect } from "react";
import { Animated } from "react-native";
import { products as initialProducts } from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Core state
  const [rentCartItems, setRentCartItems] = useState([]);
  const [paidRentItems, setPaidRentItems] = useState([]);
  const [products, setProducts] = useState(initialProducts);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [theme, setTheme] = useState("light");
  
  // Animation values
  const [cartAnimation] = useState(new Animated.Value(0));
  const [favoriteAnimation] = useState(new Animated.Value(0));
  
  // Load persisted data on startup
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
        
        const storedRecentlyViewed = await AsyncStorage.getItem('recentlyViewed');
        if (storedRecentlyViewed) setRecentlyViewed(JSON.parse(storedRecentlyViewed));
        
        const storedPaidItems = await AsyncStorage.getItem('paidRentItems');
        if (storedPaidItems) setPaidRentItems(JSON.parse(storedPaidItems));
        
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) setTheme(storedTheme);
      } catch (error) {
        console.log('Error loading persisted data:', error);
      }
    };
    
    loadPersistedData();
  }, []);
  
  // Persist data when it changes
  useEffect(() => {
    const persistData = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        await AsyncStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        await AsyncStorage.setItem('paidRentItems', JSON.stringify(paidRentItems));
        await AsyncStorage.setItem('theme', theme);
      } catch (error) {
        console.log('Error persisting data:', error);
      }
    };
    
    persistData();
  }, [favorites, recentlyViewed, paidRentItems, theme]);

  const addToRentCart = (productId, quantity = 1) => {
    // Animate cart icon
    Animated.sequence([
      Animated.timing(cartAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cartAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              available:
                product.available - quantity >= 0
                  ? product.available - quantity
                  : 0,
            }
          : product
      )
    );
    
    setRentCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: (item.quantity || 0) + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        { ...products.find((p) => p.id === productId), quantity },
      ];
    });
  };

  const removeFromRentCart = (productId, quantity = null) => {
    const itemToRemove = rentCartItems.find((item) => item.id === productId);
    if (itemToRemove) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                available:
                  product.available + (quantity || itemToRemove.quantity),
              }
            : product
        )
      );
      
      setRentCartItems((prevItems) =>
        quantity
          ? prevItems
              .map((item) =>
                item.id === productId
                  ? {
                      ...item,
                      quantity:
                        item.quantity - quantity > 0
                          ? item.quantity - quantity
                          : 0,
                    }
                  : item
              )
              .filter((item) => item.quantity > 0)
          : prevItems.filter((item) => item.id !== productId)
      );
    }
  };

  const updateRentQuantity = (productId, newQuantity) => {
    const itemToUpdate = rentCartItems.find((item) => item.id === productId);
    if (!itemToUpdate) return;
    
    const quantityDifference = newQuantity - (itemToUpdate.quantity || 0);
    if (quantityDifference > 0) {
      addToRentCart(productId, quantityDifference);
    } else if (quantityDifference < 0) {
      removeFromRentCart(productId, Math.abs(quantityDifference));
    }
  };

  const clearRentCart = () => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const cartItem = rentCartItems.find((item) => item.id === product.id);
        return cartItem
          ? { ...product, available: product.available + cartItem.quantity }
          : product;
      })
    );
    setRentCartItems([]);
  };

  const addToPaidRentItems = (items) => {
    // Add items to paid rent items with rental date and calculate return date
    const itemsWithRentalDetails = items.map((item) => ({
      ...item,
      rentalDate: new Date(),
      returnDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      rentalId: `RNT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: 'active'
    }));

    setPaidRentItems((prevItems) => [...prevItems, ...itemsWithRentalDetails]);
    clearRentCart();
  };

  const getTotalRentCartAmount = () => {
    return rentCartItems.reduce(
      (total, item) => total + item.rentPrice * (item.quantity || 1),
      0
    );
  };

  const getRentCartCount = () => {
    return rentCartItems.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(productId) 
        ? prevFavorites.filter(id => id !== productId)
        : [...prevFavorites, productId];
      return newFavorites;
    });
  };
  
  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };
  
  const addToRecentlyViewed = (productId) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(id => id !== productId);
      // Add to beginning of array and limit to 10 items
      return [productId, ...filtered].slice(0, 10);
    });
  };
  
  const getRecentlyViewedProducts = () => {
    return recentlyViewed
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);
  };
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const getRecommendedProducts = () => {
    // Get categories from favorites and recently viewed
    const userInterests = new Set();
    
    // Add categories from favorites
    favorites.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product && product.category) {
        product.category.forEach(cat => userInterests.add(cat));
      }
    });
    
    // Add categories from recently viewed
    recentlyViewed.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product && product.category) {
        product.category.forEach(cat => userInterests.add(cat));
      }
    });
    
    // If no interests, return new arrivals
    if (userInterests.size === 0) {
      return products
        .filter(p => p.category.includes('New Arrivals'))
        .slice(0, 5);
    }
    
    // Score products based on matching categories
    const scoredProducts = products
      .filter(p => !favorites.includes(p.id) && !recentlyViewed.includes(p.id))
      .map(p => {
        const score = p.category.reduce((total, cat) => 
          userInterests.has(cat) ? total + 1 : total, 0);
        return { ...p, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score);
    
    return scoredProducts.slice(0, 5);
  };

  return (
    <CartContext.Provider
      value={{
        products,
        rentCartItems,
        paidRentItems,
        favorites,
        recentlyViewed,
        theme,
        cartAnimation,
        favoriteAnimation,
        userLocation,
        addToRentCart,
        removeFromRentCart,
        updateRentQuantity,
        clearRentCart,
        getTotalRentCartAmount,
        getRentCartCount,
        addToPaidRentItems,
        toggleFavorite,
        isFavorite,
        addToRecentlyViewed,
        getRecentlyViewedProducts,
        getRecommendedProducts,
        toggleTheme,
        setUserLocation
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;