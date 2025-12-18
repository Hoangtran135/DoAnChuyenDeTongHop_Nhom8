import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { BASE_URL } from "../ipconfig";

export default function VoucherSelectionScreen({ route, navigation }: any) {
  const { userId, onSelect } = route.params;
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/available-vouchers?userId=${userId}`
      );
      const data = await res.json();
      if (res.ok) {
        setVouchers(data);
      } else {
        Alert.alert("Lỗi", "Không thể tải danh sách mã giảm giá");
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (voucher: { code: string; discountAmount: number }) => {
    if (onSelect && typeof onSelect === "function") {
      onSelect(voucher); // Gửi nguyên object voucher
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 20 }}>
        {" "}
        Danh Sách Mã Giảm Giá:
      </Text>
      <FlatList
        data={vouchers}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              handleSelect({
                code: item.code,
                discountAmount: item.discountAmount,
              })
            }
          >
            <Text style={styles.code}>{item.code}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.discount}>
              Giảm {(item.discountAmount ?? 0).toLocaleString()}%
            </Text>
          </TouchableOpacity>
        )}
        refreshing={loading}
        onRefresh={fetchVouchers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  code: {
    fontWeight: "700",
    fontSize: 18,
    color: "#333",
  },
  desc: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  discount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#27ae60",
  },
});
