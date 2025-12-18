import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../ipconfig";
import Navbar from "./Navbar";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/native";

const colors = {
  primary: "#2c3e50",
  accent: "#ff6f61",
  secondary: "#27ae60",
  background: "#f9f9f9",
  text: "#333",
  muted: "#777",
  warning: "#f39c12",
  danger: "#c0392b",
  lightGray: "#e0e0e0",
  selected: "#b0b0b0",
};

type Order = {
  id: number;
  userName: string;
  orderDate: string;
  status: "Ordered" | "Delivered" | "Canceled";
  total_quantity: string;
  total_price: string;
};

const OrderManagementAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [filter, setFilter] = useState<
    "Ordered" | "Delivered" | "Canceled" | "All"
  >("All");
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) => filter === "All" || order.status === filter
  );

  const toggleNavbar = () => {
    setIsNavbarVisible((prevState) => !prevState);
  };

  const handleOutsidePress = () => {
    setIsNavbarVisible(false);
  };

  const handleConfirm = async (orderId: number) => {
    try {
      await axios.put(`${BASE_URL}/orders/${orderId}/status`, {
        status: "Delivered",
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Delivered" } : order
        )
      );
      Alert.alert("Thành công", `Đơn hàng ${orderId} đã được giao.`);
    } catch (error) {
      console.error("Lỗi xác nhận đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể xác nhận đơn hàng.");
    }
  };

  const handleCancel = async (orderId: number) => {
    try {
      await axios.put(`${BASE_URL}/orders/${orderId}/status`, {
        status: "Canceled",
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Canceled" } : order
        )
      );
      Alert.alert("Thành công", `Đơn hàng ${orderId} đã bị hủy.`);
    } catch (error) {
      console.error("Lỗi hủy đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể hủy đơn hàng.");
    }
  };

  const handleDetail = (orderId: number) => {
    navigation.navigate("Chi Tiết Đơn Hàng Admin", { orderId });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ordered":
        return colors.warning;
      case "Delivered":
        return colors.secondary;
      case "Canceled":
        return colors.danger;
      default:
        return colors.muted;
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.item}>
      <Text style={styles.userName}>Người dùng: {item.userName}</Text>
      <Text style={styles.orderDate}>
        Ngày đặt: {new Date(item.orderDate).toLocaleDateString("vi-VN")}
      </Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        Trạng thái: {item.status}
      </Text>
      <Text style={styles.totalQuantity}>Số lượng: {item.total_quantity}</Text>
      <Text style={styles.totalPrice}>Tổng giá: {item.total_price} VNĐ</Text>
      <View style={styles.actions}>
        {item.status === "Ordered" ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => handleConfirm(item.id)}
            >
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => handleCancel(item.id)}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.detailButton]}
              onPress={() => handleDetail(item.id)}
            >
              <Text style={styles.buttonText}>Chi tiết</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.detailButton]}
            onPress={() => handleDetail(item.id)}
          >
            <Text style={styles.buttonText}>Chi tiết</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Đang tải danh sách đơn hàng...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleNavbar}>
          <Icon
            name={isNavbarVisible ? "close" : "menu"}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>

        {isNavbarVisible && <Navbar toggleNavbar={toggleNavbar} />}

        <Text style={styles.title}>Quản Lý Đơn Hàng</Text>

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
          <View style={styles.noOrders}>
            <Text style={styles.noOrdersText}>Chưa có đơn hàng nào.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={50}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 8,
    zIndex: 1000,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginVertical: 15,
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
  },
  noOrders: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersText: {
    fontSize: 18,
    color: colors.muted,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    alignItems: "center",
  },
  selectedFilterButton: {
    backgroundColor: colors.selected,
  },
  filterText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  selectedFilterText: {
    fontWeight: "700",
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  orderDate: {
    fontSize: 14,
    color: colors.muted,
    marginVertical: 5,
  },
  status: {
    fontSize: 14,
    marginVertical: 5,
    fontWeight: "bold",
  },
  totalQuantity: {
    fontSize: 14,
    color: colors.text,
    marginVertical: 3,
  },
  totalPrice: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: colors.secondary,
  },
  cancelButton: {
    backgroundColor: colors.danger,
  },
  detailButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default OrderManagementAdmin;
