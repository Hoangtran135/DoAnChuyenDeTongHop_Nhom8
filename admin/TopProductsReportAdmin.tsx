import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { BarChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialIcons";
import Navbar from "./Navbar";
import { BASE_URL } from "../ipconfig";

const screenWidth = Dimensions.get("window").width;

// Color palette for consistency
const colors = {
  primary: "#000000", // Black for text, buttons
  accent: "#1976D2", // Blue for bars, loading
  secondary: "#388E3C", // Green for highlights
  background: "#FFFFFF", // White background
  text: "#333333", // Dark gray for body text
  muted: "#666666", // Gray for secondary text
  card: "#F5F5F5", // Light gray for cards
  border: "#E0E0E0", // Light gray for borders
  white: "#FFFFFF", // Explicit white for text/buttons
};

// Common shadow for reusability
const commonShadow = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
};

const styles = StyleSheet.create({
  // Root container
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Main content area
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  // Menu toggle button
  toggleButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 8,
    zIndex: 1000,
    ...commonShadow,
  },

  // Page title
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginVertical: 20,
    letterSpacing: 0.5,
  },

  // View mode switch buttons container
  switchButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 12,
  },

  // Individual switch button
  switchButton: {
    flex: 1,
    maxWidth: 160,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 10,
    alignItems: "center",
    ...commonShadow,
  },

  // Active switch button
  activeButton: {
    backgroundColor: colors.accent,
  },

  // Switch button text
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },

  // Active switch button text
  activeButtonText: {
    color: colors.white,
  },

  // Loading state container
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  // Loading text
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.muted,
    fontWeight: "400",
  },

  // No products message
  noProducts: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // No products text
  noProductsText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.muted,
  },

  // List container
  listContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...commonShadow,
    maxHeight: 320, // Constrain height for scrolling
  },

  // List content (FlatList)
  listContent: {
    paddingBottom: 8,
  },

  // Product item
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // Product name
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
    flex: 1,
  },

  // Product sold count
  productSold: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.muted,
  },

  // Chart container
  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...commonShadow,
    alignItems: "center",
  },

  // Section title (for list and chart)
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 12,
    textAlign: "center",
  },

  // Chart style
  chartStyle: {
    borderRadius: 10,
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    ...commonShadow,
  },
});

interface Product {
  id: number;
  name: string;
  total_sold: number;
}

const TopProductsReportAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavbarVisible, setNavbarVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");

  const toggleNavbar = () => {
    setNavbarVisible((prev) => !prev);
  };

  const handleOutsidePress = () => {
    setNavbarVisible(false);
  };

  const shortenName = (name: string, maxLength: number = 8) => {
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/top-products/5`);
        console.log("Top products data:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách sản phẩm.");
        setProducts([
          { id: 1, name: "Sản phẩm 1", total_sold: 0 },
          { id: 2, name: "Sản phẩm 2", total_sold: 0 },
          { id: 3, name: "Sản phẩm 3", total_sold: 0 },
          { id: 4, name: "Sản phẩm 4", total_sold: 0 },
          { id: 5, name: "Sản phẩm 5", total_sold: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, []);

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productSold}>{item.total_sold} đã bán</Text>
    </View>
  );

  const chartData = {
    labels: products.map((p) => shortenName(p.name, 8)),
    datasets: [
      {
        data: products.map((p) => (p.total_sold > 0 ? p.total_sold : 0.1)),
      },
    ],
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Đang tải danh sách sản phẩm...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleNavbar}
          accessible
          accessibilityLabel={isNavbarVisible ? "Đóng menu" : "Mở menu"}
        >
          <Icon
            name={isNavbarVisible ? "close" : "menu"}
            size={28}
            color={colors.white}
          />
        </TouchableOpacity>

        {isNavbarVisible && <Navbar toggleNavbar={toggleNavbar} />}

        <View style={styles.content}>
          <Text style={styles.title}>Sản Phẩm Bán Chạy</Text>

          <View style={styles.switchButtons}>
            <TouchableOpacity
              style={[
                styles.switchButton,
                viewMode === "list" && styles.activeButton,
              ]}
              onPress={() => setViewMode("list")}
              accessible
              accessibilityLabel="Hiển thị danh sách"
            >
              <Text
                style={[
                  styles.buttonText,
                  viewMode === "list" && styles.activeButtonText,
                ]}
              >
                Danh sách
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchButton,
                viewMode === "chart" && styles.activeButton,
              ]}
              onPress={() => setViewMode("chart")}
              accessible
              accessibilityLabel="Hiển thị biểu đồ"
            >
              <Text
                style={[
                  styles.buttonText,
                  viewMode === "chart" && styles.activeButtonText,
                ]}
              >
                Biểu đồ
              </Text>
            </TouchableOpacity>
          </View>

          {products.length === 0 ? (
            <View style={styles.noProducts}>
              <Text style={styles.noProductsText}>Chưa có sản phẩm nào.</Text>
            </View>
          ) : viewMode === "list" ? (
            <View style={styles.listContainer}>
              <Text style={styles.sectionTitle}>Danh Sách Sản Phẩm</Text>
              <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProductItem}
                contentContainerStyle={styles.listContent}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={50}
                showsVerticalScrollIndicator={true}
              />
            </View>
          ) : (
            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>Biểu Đồ Sản Phẩm Bán Chạy</Text>
              <BarChart
                data={chartData}
                width={screenWidth - 48}
                height={300}
                fromZero
                chartConfig={{
                  backgroundColor: colors.background,
                  backgroundGradientFrom: colors.background,
                  backgroundGradientTo: colors.background,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                  labelColor: () => colors.text,
                  propsForDots: {
                    r: "4",
                    strokeWidth: "1",
                    stroke: colors.primary,
                  },
                  barPercentage: 0.6,
                  fillShadowGradient: colors.accent,
                  fillShadowGradientOpacity: 1,
                  propsForBackgroundLines: {
                    stroke: colors.border,
                    strokeDasharray: "",
                  },
                  propsForLabels: {
                    fontSize: 10,
                    fontWeight: "500",
                    rotation: 45,
                    dx: 10,
                  },
                }}
                style={styles.chartStyle}
                yAxisLabel=""
                yAxisSuffix=""
              />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TopProductsReportAdmin;
