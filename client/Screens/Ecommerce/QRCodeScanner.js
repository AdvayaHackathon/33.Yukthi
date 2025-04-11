import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  StatusBar,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "./CartContext";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");
const SCAN_AREA_SIZE = width * 0.7;

export default function QRCodeScanner({ navigation }) {
  const { theme } = useCart();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraType, setCameraType] = useState(BarCodeScanner.Constants.Type.back);
  const [showTips, setShowTips] = useState(false);
  
  // Animation refs
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  
  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  
  // Animate scan line
  useEffect(() => {
    if (!scanned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: SCAN_AREA_SIZE,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Pulse animation for scan area
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop animations when scanned
      scanLineAnim.stopAnimation();
      pulseAnim.stopAnimation();
    }
  }, [scanned]);
  
  // Handle QR code scan
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScanSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Animate success
    Animated.timing(successAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    
    
    // Simulate successful unlock
    setTimeout(() => {
      Alert.alert(
        "Rental Unlocked",
        "Your rental item has been successfully unlocked. Enjoy your beach day!",
        [
          {
            text: "View My Rentals",
            onPress: () => navigation.navigate("Cart", { activeTab: "active" }),
          },
          {
            text: "Continue Shopping",
            onPress: () => navigation.navigate("Gears"),
          },
        ]
      );
    }, 2000);
  };
  
  // Toggle flashlight
  const toggleTorch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTorchOn(!torchOn);
  };
  
  // Toggle camera type (front/back)
  const toggleCameraType = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCameraType(
      cameraType === BarCodeScanner.Constants.Type.back
        ? BarCodeScanner.Constants.Type.front
        : BarCodeScanner.Constants.Type.back
    );
  };
  
  // Toggle scanning tips
  const toggleTips = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTips(!showTips);
  };
  
  // Scan again
  const handleScanAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScanned(false);
    setScanSuccess(false);
    successAnim.setValue(0);
  };

  // Handle permission states
  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF" }]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        <View style={styles.permissionContainer}>
        <Ionicons 
  name="camera-outline" 
  size={64} 
  color={theme === "dark" ? "#00E5FF" : "#0066CC"} 
  style={styles.permissionIcon}
/>
          <Text style={[styles.permissionTitle, { color: theme === "dark" ? "#FFFFFF" : "#000000" }]}>
            Requesting Camera Access
          </Text>
          <Text style={[styles.permissionText, { color: theme === "dark" ? "#BBBBBB" : "#666666" }]}>
            We need camera access to scan QR codes for unlocking your rental items.
          </Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme === "dark" ? "#121212" : "#FFFFFF" }]}>
        <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" translucent={true} />
        
        <View style={styles.permissionContainer}>
          <Ionicons 
            name="camera-off-outline" 
            size={64} 
            color={theme === "dark" ? "#666666" : "#CCCCCC"} 
            style={styles.permissionIcon}
          />
          <Text style={[styles.permissionTitle, { color: theme === "dark" ? "#FFFFFF" : "#000000" }]}>
            Camera Access Required
          </Text>
          <Text style={[styles.permissionText, { color: theme === "dark" ? "#BBBBBB" : "#666666" }]}>
            We need camera access to scan QR codes for unlocking your rental items. Please enable camera access in your device settings.
          </Text>
          
          <TouchableOpacity
            style={[
              styles.permissionButton,
              { backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
            ]}
            onPress={() => BarCodeScanner.requestPermissionsAsync()}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      {/* Camera */}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        type={cameraType}
        flashMode={
          torchOn
            ? BarCodeScanner.Constants.FlashMode.torch
            : BarCodeScanner.Constants.FlashMode.off
        }
      />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Scan Area */}
        <Animated.View
          style={[
            styles.scanArea,
            {
              transform: [{ scale: pulseAnim }],
              borderColor: theme === "dark" ? "#00E5FF" : "#0066CC",
            },
          ]}
        >
          {/* Scan Corners */}
          <View
            style={[
              styles.scanCorner,
              styles.topLeftCorner,
              { borderColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
            ]}
          />
          <View
            style={[
              styles.scanCorner,
              styles.topRightCorner,
              { borderColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
            ]}
          />
          <View
            style={[
              styles.scanCorner,
              styles.bottomLeftCorner,
              { borderColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
            ]}
          />
          <View
            style={[
              styles.scanCorner,
              styles.bottomRightCorner,
              { borderColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
            ]}
          />
          
          {/* Scan Line */}
          {!scanned && (
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanLineAnim }],
                  backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC",
                },
              ]}
            />
          )}
          
          {/* Success Overlay */}
          {scanSuccess && (
            <Animated.View
              style={[
                styles.successOverlay,
                {
                  opacity: successAnim,
                },
              ]}
            >
              <View style={styles.successIconContainer}>
  <Ionicons 
    name="checkmark-circle" 
    size={80} 
    color="#00FF00" 
  />
  <View style={styles.successIconBackground} />
</View>
              <Text style={styles.successText}>QR Code Scanned!</Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={toggleTips}
        >
          <Ionicons name="information-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Position the QR code within the square to unlock your rental
        </Text>
      </View>
      
      {/* Camera Controls */}
      <View style={styles.cameraControls}>
        <TouchableOpacity
          style={[
            styles.cameraControlButton,
            torchOn && styles.activeControlButton,
          ]}
          onPress={toggleTorch}
        >
          <Ionicons
            name={torchOn ? "flash" : "flash-outline"}
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.controlButtonText}>Flash</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.cameraControlButton}
          onPress={toggleCameraType}
        >
          <Ionicons name="camera-reverse-outline" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Flip</Text>
        </TouchableOpacity>
      </View>
      
      {/* Scan Again Button */}
      {scanned && (
        <TouchableOpacity 
          style={[
            styles.scanAgainButton,
            { backgroundColor: theme === "dark" ? "#00E5FF" : "#0066CC" },
          ]} 
          onPress={handleScanAgain}
        >
          <Text style={styles.scanAgainButtonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
      
      {/* Tips Modal */}
      {showTips && (
        <View style={styles.tipsContainer}>
          <View
            style={[
              styles.tipsCard,
              { backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF" },
            ]}
          >
            <View style={styles.tipsHeader}>
              <Text
                style={[
                  styles.tipsTitle,
                  { color: theme === "dark" ? "#FFFFFF" : "#000000" },
                ]}
              >
                Scanning Tips
              </Text>
              <TouchableOpacity
                style={styles.closeTipsButton}
                onPress={toggleTips}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme === "dark" ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
            </View>
            
            <View
              style={[
                styles.tipsDivider,
                { backgroundColor: theme === "dark" ? "#333333" : "#F0F0F0" },
              ]}
            />
            
            <View style={styles.tipItem}>
              <Ionicons
                name="scan-outline"
                size={24}
                color={theme === "dark" ? "#00E5FF" : "#0066CC"}
                style={styles.tipIcon}
              />
              <Text
                style={[
                  styles.tipText,
                  { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                ]}
              >
                Make sure the QR code is within the scanning frame
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons
                name="flashlight-outline"
                size={24}
                color={theme === "dark" ? "#00E5FF" : "#0066CC"}
                style={styles.tipIcon}
              />
              <Text
                style={[
                  styles.tipText,
                  { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                ]}
              >
                Use the flash in low-light conditions
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons
                name="hand-left-outline"
                size={24}
                color={theme === "dark" ? "#00E5FF" : "#0066CC"}
                style={styles.tipIcon}
              />
              <Text
                style={[
                  styles.tipText,
                  { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                ]}
              >
                Hold your device steady while scanning
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Ionicons
                name="resize-outline"
                size={24}
                color={theme === "dark" ? "#00E5FF" : "#0066CC"}
                style={styles.tipIcon}
              />
              <Text
                style={[
                  styles.tipText,
                  { color: theme === "dark" ? "#BBBBBB" : "#666666" },
                ]}
              >
                Maintain a distance of 15-20 cm from the QR code
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    borderWidth: 2,
    borderRadius: 16,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  scanCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderWidth: 4,
  },
  topLeftCorner: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRightCorner: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRightCorner: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    width: SCAN_AREA_SIZE,
    height: 2,
    opacity: 0.7,
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  successAnimation: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  successText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 160,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  instructionsText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  cameraControls: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  cameraControlButton: {
    alignItems: "center",
    marginHorizontal: 24,
    opacity: 0.8,
  },
  activeControlButton: {
    opacity: 1,
  },
  controlButtonText: {
    color: "#FFFFFF",
    marginTop: 8,
    fontSize: 12,
  },
  scanAgainButton: {
    position: "absolute",
    bottom: 48,
    left: 32,
    right: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  scanAgainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permissionAnimation: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  permissionIcon: {
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  tipsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  tipsCard: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
  },
  tipsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeTipsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tipsDivider: {
    height: 1,
    marginVertical: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tipIcon: {
    marginRight: 16,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  successIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconBackground: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
  },
  permissionIcon: {
    marginBottom: 24,
  },
});