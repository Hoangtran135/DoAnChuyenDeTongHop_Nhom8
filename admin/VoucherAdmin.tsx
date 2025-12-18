import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BASE_URL } from "../ipconfig";
import Navbar from "./Navbar"; // đường dẫn component Navbar của bạn
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { useNavigation } from "@react-navigation/native";

type VoucherAdminNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Quản Lý Khuyến Mãi"
>;

type Voucher = {
  id: number;
  discountcode: string;
  discount: number;
  quantity: number;
  start: string;
  end: string;
  created_at: string;
};

export default function VoucherAdmin() {
  const navigation = useNavigation<VoucherAdminNavigationProp>();

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("active");

  // Quản lý trạng thái navbar
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const toggleNavbar = () => {
    console.log("Navbar toggle:", !isNavbarVisible);
    setIsNavbarVisible((prev) => !prev);
  };

  const handleOutsidePress = () => {
    if (isNavbarVisible) {
      console.log("Outside pressed, closing navbar");
      setIsNavbarVisible(false);
    }
  };

  const API_URL = `${BASE_URL}/listvouchers`;

  const fetchVouchers = async (status = "") => {
    console.log("Fetching vouchers with status:", status);
    setLoading(true);
    try {
      let url = API_URL;
      if (status && status !== "all") {
        url += `?status=${status}`;
      }
      console.log("Fetch URL:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("Fetched vouchers count:", data.length);
      setVouchers(data);
    } catch (error) {
      console.error("Fetch vouchers error:", error);
      Alert.alert("Lỗi", "Không thể lấy dữ liệu voucher");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Filter changed:", filter);
    fetchVouchers(filter);
  }, [filter]);

  const renderVoucher = ({ item }: { item: Voucher }) => {
    const now = new Date();
    const startDate = new Date(item.start);
    const endDate = new Date(item.end);
    const isActive = now > startDate && now <= endDate && item.quantity > 0;
    const isExpired = now > endDate || item.quantity === 0;

    console.log(
      `Rendering voucher id=${item.id}, active=${isActive}, expired=${isExpired}`
    );

    return (
      <View
        style={[
          styles.voucherItem,
          isExpired ? styles.expiredVoucher : styles.activeVoucher,
        ]}
      >
        <Text style={styles.voucherCode}>{item.discountcode}</Text>
        <Text>Giảm giá: {item.discount}%</Text>
        <Text>Số lượng còn lại: {item.quantity}</Text>
        <Text>
          Hiệu lực: {item.start} đến {item.end}
        </Text>
        <Text>Ngày tạo: {item.created_at}</Text>
        <Text style={{ color: isActive ? "green" : "red", fontWeight: "bold" }}>
          {isActive ? "Còn hiệu lực" : "Đã hết hạn hoặc hết số lượng"}
        </Text>
      </View>
    );
  };

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
            size={30}
            color="#fff"
          />
        </TouchableOpacity>

        {isNavbarVisible && <Navbar toggleNavbar={toggleNavbar} />}

        <Text style={styles.title}>Quản Lý Khuyến Mãi</Text>

        <View style={styles.filterContainer}>
          {["all", "active", "expired"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filter === status && styles.filterButtonActive,
              ]}
              onPress={() => {
                console.log("Filter button pressed:", status);
                setFilter(status as "all" | "active" | "expired");
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === status && styles.filterTextActive,
                ]}
              >
                {status === "all"
                  ? "Tất cả"
                  : status === "active"
                  ? "Còn hạn"
                  : "Hết hạn"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Đang tải...
          </Text>
        ) : (
          <FlatList
            data={vouchers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderVoucher}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            console.log("Navigate to AddVoucher screen");
            navigation.navigate("Thêm Khuyến Mãi");
          }}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
const colors = {
  primary: "#2c3e50", // Xanh đậm chủ đạo
  accent: "#ff6f61", // Màu nổi bật (đỏ cam)
  secondary: "#27ae60", // Màu xanh lá (thành công)
  background: "#f9f9f9", // Màu nền sáng
  text: "#333333", // Màu chữ chính
  muted: "#777777", // Màu chữ mờ
  lightBorder: "#D1D1D1", // Màu viền sáng
  white: "#FFFFFF", // Trắng
  expiredBackground: "#E5E5E5", // Màu nền voucher hết hạn
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Nền sáng
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.primary, // Nền nút menu màu xanh đậm
    borderRadius: 50,
    padding: 8,
    zIndex: 1000,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text, // Màu chữ chính
    textAlign: "center",
    marginVertical: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: colors.accent, // Nền màu nổi bật khi chọn
    borderColor: colors.accent,
  },
  filterText: {
    color: colors.muted,
    fontWeight: "bold",
  },
  filterTextActive: {
    color: colors.white,
  },
  voucherItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.white,
  },
  activeVoucher: {
    backgroundColor: colors.white,
    borderColor: colors.lightBorder,
  },
  expiredVoucher: {
    backgroundColor: colors.expiredBackground,
    borderColor: colors.lightBorder,
  },
  voucherCode: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 6,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "bold",
  },
});
