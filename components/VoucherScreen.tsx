import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { BASE_URL } from "../ipconfig";
import { useNavigation } from "@react-navigation/native";

interface Voucher {
  id: number;
  start: string;
  end: string;
  discountcode: string;
  quantity: number;
  created_at: string;
  discount: number;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function VoucherScreen() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/vouchers`)
      .then((res) => {
        if (res.data.success) {
          setVouchers(res.data.vouchers);
        }
      })
      .catch((err) => {
        console.error("Error fetching vouchers:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderVoucher = ({ item }: { item: Voucher }) => (
    <View style={styles.card}>
      <Text style={styles.code}>🎁 {item.discountcode}</Text>
      <Text style={styles.date}>Giảm: {item.discount}%</Text>
      <Text style={styles.date}>Bắt đầu: {formatDate(item.start)}</Text>
      <Text style={styles.date}>Kết thúc: {formatDate(item.end)}</Text>
      <Text style={styles.quantity}>Số lượng còn lại: {item.quantity}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6A0DAD" />
        <Text>Đang tải voucher...</Text>
      </View>
    );
  }

  const today = new Date();
  const availableVouchers = vouchers.filter(
    (v) => v.quantity > 0 && new Date(v.end) >= today
  );

  if (availableVouchers.length === 0) {
    return (
      <View style={[styles.center, { flex: 1 }]}>
        <Icon name="sad-outline" size={64} color="#aaa" />
        <Text>Không có mã khuyến mãi nào</Text>
        <View style={styles.navbarContainer}>
          <Navbar navigation={navigation} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={availableVouchers}
        renderItem={renderVoucher}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }} // padding để không bị che bởi navbar
      />
      <View style={styles.navbarContainer}>
        <Navbar navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#6A0DAD",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  code: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6A0DAD",
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  quantity: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    // Nếu Navbar có chiều cao 60, bạn có thể thêm paddingVertical nếu cần
    height: 60,
  },
});
