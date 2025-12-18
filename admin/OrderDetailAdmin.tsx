import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../ipconfig";

type OrderDetail = {
  product_name: string;
  quantity: number;
  price: number;
};

type OrderInfo = {
  id: number;
  userName: string;
  orderDate: string;
  status: string;
  totalPrice: number;
  items: OrderDetail[];
};

const OrderDetailAdmin = () => {
  const route = useRoute();
  const { orderId } = route.params as { orderId: number };

  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        console.log("Fetching order details for orderId:", orderId);
        const response = await axios.get(
          `${BASE_URL}/orders/${orderId}/detail`
        );
        console.log("Dữ liệu nhận được từ API:", response.data);

        if (
          response.data &&
          response.data.order &&
          response.data.orderDetails
        ) {
          setOrder({
            ...response.data.order,
            items: response.data.orderDetails,
          });
        } else {
          console.log("Không có dữ liệu chi tiết đơn hàng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (!order) {
    console.log("Không tìm thấy đơn hàng");
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}> không tìm thấy đơn hàng.</Text>
      </View>
    );
  }

  const formattedOrderDate = new Date(order.orderDate).toLocaleDateString(
    "vi-VN"
  );
  const totalPriceFormatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(order.totalPrice));

  console.log("Thông tin đơn hàng:", order);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Mã đơn: {order.id}</Text>
        <Text style={styles.info}>Người dùng: {order.userName}</Text>
        <Text style={styles.info}>Ngày đặt: {formattedOrderDate}</Text>
        <Text style={styles.info}>Trạng thái: {order.status}</Text>
        <Text style={styles.info}>Tổng giá: {totalPriceFormatted}</Text>
      </View>

      <Text style={styles.subTitle}>Danh sách sản phẩm:</Text>
      <FlatList
        data={order.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          console.log("Sản phẩm trong đơn hàng:", item);
          return (
            <View style={styles.item}>
              <Text style={styles.itemText}>Sản phẩm: {item.product_name}</Text>
              <Text style={styles.itemText}>Số lượng: {item.quantity}</Text>
              <Text style={styles.itemText}>
                Giá:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(item.price))}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff", // White background
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000", // Black text
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0", // Light gray underline
    paddingBottom: 5,
  },
  infoContainer: {
    backgroundColor: "#f5f5f5", // Very light gray for contrast
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  info: {
    fontSize: 16,
    color: "#333333", // Dark gray for readability
    marginBottom: 8,
    fontWeight: "400",
    lineHeight: 22,
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  itemText: {
    fontSize: 15,
    color: "#333333",
    marginBottom: 5,
    fontWeight: "400",
  },
  errorText: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "500",
  },
});

export default OrderDetailAdmin;
