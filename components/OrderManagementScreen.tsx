import React, { useState, useEffect } from "react";
import { BASE_URL } from "../ipconfig";
import NotLoggedIn from "../settings/NotLoggedIn";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "./Navbar";
import { Ionicons as Icon } from "@expo/vector-icons";

const colors = {
  primary: "#6A0DAD",
  accent: "#ff6f61",
  secondary: "#27ae60",
  background: "#f9f9f9",
  text: "#333",
  muted: "#777",
};

interface Order {
  id: number;
  status: string;
  total_amount: number | null;
  payment_type: string | null;
  created_at: string | null;
}

export default function OrderManagementScreen({ navigation }: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"All" | "Ordered" | "Delivered" | "Canceled">("All");

  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => {
      if (id) {
        const parsedId = parseInt(id, 10);
        if (!isNaN(parsedId)) {
          setUserId(parsedId);
          console.log("User ID:", parsedId);
        } else {
          Alert.alert("Lỗi", "ID người dùng không hợp lệ.");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/user/${userId}`);
      setOrders(response.data);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      Alert.alert("Lỗi", "Không thể tải đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn hủy đơn hàng này?", [
      { text: "Không" },
      {
        text: "Hủy đơn",
        onPress: async () => {
          try {
            await axios.put(`${BASE_URL}/orders/${orderId}/cancel`);
            Alert.alert("Thành công", "Đơn hàng đã được hủy.");
            fetchOrders();
          } catch (error) {
            console.error("Lỗi khi hủy đơn:", error);
            Alert.alert("Lỗi", "Không thể hủy đơn hàng. Vui lòng thử lại sau.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ordered":
        return "#f39c12";
      case "Delivered":
        return "#27ae60";
      case "Canceled":
        return "#e74c3c";
      default:
        return "#777";
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A";
    return value.toLocaleString();
  };

  const formatDate = (dateString: string | null) => {
    if (dateString === null) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
      <Text
        style={[styles.orderStatus, { color: getStatusColor(item.status) }]}
      >
        {`Trạng thái: ${item.status}`}
      </Text>
      <Text style={styles.orderAmount}>
        {`Tổng tiền: ${formatCurrency(item.total_amount)} VND`}
      </Text>
      <Text style={styles.orderPayment}>
        {`Phương thức thanh toán: ${item.payment_type || "N/A"}`}
      </Text>
      <Text style={styles.orderDate}>
        {`Ngày tạo: ${formatDate(item.created_at)}`}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          style={[styles.detailButton, { flex: 1, marginRight: 8 }]}
          onPress={() => {
            const statusValue = item.status === "Ordered" ? 0 : 1;
            navigation.navigate("Chi Tiết Đơn Hàng", {
              orderId: item.id,
              statusValue,
            });
          }}
        >
          <Text style={styles.detailButtonText}>View</Text>
        </TouchableOpacity>

        {item.status !== "Canceled" && item.status !== "Delivered" && (
          <TouchableOpacity
            style={[styles.cancelButton, { flex: 1, marginLeft: 8 }]}
            onPress={() => cancelOrder(item.id)}
          >
            <Text style={styles.detailButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}

        {item.status === "Delivered" && userId && (
          <TouchableOpacity
            style={[styles.feedbackButton, { flex: 1, marginLeft: 8 }]}
            onPress={() =>
              navigation.navigate("Phản Hồi", { orderId: item.id, userId })
            }
          >
            <Text style={styles.detailButtonText}>Feedback</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const filteredOrders = orders.filter((order) =>
    filter === "All" ? true : order.status === filter
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (!userId) {
  return <NotLoggedIn navigation={navigation} />;
}

  return (
    <View style={styles.container}>
      {/* Phần filter */}
      <View style={styles.filterContainer}>
        {["All", "Ordered", "Delivered", "Canceled"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              filter === item && styles.selectedFilterButton,
            ]}
            onPress={() => setFilter(item as typeof filter)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.selectedFilterText,
              ]}
            >
              {item === "All"
                ? "Tất cả"
                : item === "Ordered"
                ? "Đã đặt"
                : item === "Delivered"
                ? "Đã giao"
                : "Đã hủy"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredOrders.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.noOrdersText}>Chưa có đơn hàng nào.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.orderList}
        />
      )}

      <View style={styles.navbarWrapper}>
        <Navbar navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.muted,
    marginTop: 12,
    fontWeight: "500",
  },
  noOrdersText: {
    fontSize: 18,
    color: colors.muted,
    textAlign: "center",
    fontWeight: "500",
  },
  orderList: {
    paddingBottom: 60, // Đảm bảo không bị che khuất Navbar
  },
  orderItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.accent,
    marginBottom: 6,
  },
  orderPayment: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 6,
  },
  orderDate: {
    fontSize: 15,
    color: colors.muted,
  },
  detailButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackButton: {
    backgroundColor: "#27ae60",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  detailButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  promptText: {
    fontSize: 18,
    color: colors.text,
    marginVertical: 16,
    fontWeight: "500",
  },
  bigLoginButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 10,
  },
  bigLoginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  navbarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    justifyContent: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedFilterButton: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  selectedFilterText: {
    color: "#fff",
  },
});
