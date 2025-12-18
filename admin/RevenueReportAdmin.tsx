import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { BarChart } from "react-native-chart-kit";
import { BASE_URL } from "../ipconfig";
import { MaterialIcons } from "@expo/vector-icons";
import Navbar from "./Navbar";

const screenWidth = Dimensions.get("window").width;

const colors = {
  primary: "#000000",
  accent: "#1976d2",
  secondary: "#388e3c",
  background: "#ffffff",
  text: "#333333",
  muted: "#666666",
  card: "#f5f5f5",
};

interface RevenueItem {
  month: string;
  total_revenue: string;
  total_sold_products: number | string;
}

const RevenueReportAdmin = () => {
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarVisible((prev) => !prev);
  };

  const handleOutsidePress = () => {
    setIsNavbarVisible(false);
  };

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/revenue-report`);
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setRevenueData(data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu doanh thu.");
        setRevenueData([
          { month: "01", total_revenue: "0", total_sold_products: 0 },
          { month: "02", total_revenue: "0", total_sold_products: 0 },
          { month: "03", total_revenue: "0", total_sold_products: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueData();
  }, []);

  const latestMonth = new Date().getMonth() + 1;
  const monthsToShow = [latestMonth - 2, latestMonth - 1, latestMonth].map(
    (m) => (m <= 0 ? 12 + m : m)
  );

  const revenueMap = revenueData.reduce((acc, item) => {
    const monthStr = item.month.toString().padStart(2, "0");
    acc[monthStr] = item;
    return acc;
  }, {} as Record<string, RevenueItem>);

  const completeRevenueData = monthsToShow.map((month) => {
    const monthStr = month.toString().padStart(2, "0");
    const existing = revenueMap[monthStr];
    return existing
      ? {
          ...existing,
          total_sold_products: Number(existing.total_sold_products),
        }
      : { month: monthStr, total_revenue: "0", total_sold_products: 0 };
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const totalRevenue = completeRevenueData.reduce(
    (sum, item) => sum + parseFloat(item.total_revenue),
    0
  );
  const totalSoldProducts = completeRevenueData.reduce(
    (sum, item) => sum + Number(item.total_sold_products || 0),
    0
  );

  const chartData = {
    labels: completeRevenueData.map((i) => `Tháng ${i.month}`),
    datasets: [
      {
        data: completeRevenueData.map((i) =>
          parseFloat(i.total_revenue) > 0
            ? parseFloat(i.total_revenue) / 1_000_000
            : 0.1
        ),
      },
    ],
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Đang tải dữ liệu doanh thu...</Text>
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
          <MaterialIcons
            name={isNavbarVisible ? "close" : "menu"}
            size={30}
            color="#ffffff"
          />
        </TouchableOpacity>

        {isNavbarVisible && <Navbar toggleNavbar={toggleNavbar} />}

        <View style={styles.content}>
          <Text style={styles.title}>Doanh Thu</Text>

          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Tổng doanh thu</Text>
            <Text style={styles.revenueAmount}>
              {formatCurrency(totalRevenue)}
            </Text>
          </View>

          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Tổng sản phẩm đã bán</Text>
            <Text style={styles.revenueAmount}>
              {totalSoldProducts > 0
                ? `${totalSoldProducts} sản phẩm`
                : "0 sản phẩm"}
            </Text>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Doanh thu 3 tháng gần nhất</Text>
            <BarChart
              data={chartData}
              width={(screenWidth - 40) * 1}
              height={238}
              fromZero
              chartConfig={{
                backgroundColor: colors.background,
                backgroundGradientFrom: colors.background,
                backgroundGradientTo: colors.background,
                decimalPlaces: 1,
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
                  stroke: colors.muted,
                  strokeDasharray: "",
                },
                propsForLabels: {
                  fontSize: 12,
                  fontWeight: "500",
                },
              }}
              style={styles.chartStyle}
              yAxisLabel=""
              yAxisSuffix="M VNĐ"
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 10,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginVertical: 20,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.muted,
    fontWeight: "400",
  },
  revenueItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  revenueLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 5,
  },
  revenueAmount: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.secondary,
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 10,
  },
  chartStyle: {
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: 8,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default RevenueReportAdmin;
