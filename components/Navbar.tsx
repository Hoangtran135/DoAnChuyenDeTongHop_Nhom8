import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Navbar({ navigation }: any) {
  return (
    <View style={styles.navbar}>
      <NavItem
        icon="home"
        label="Trang chủ"
        onPress={() => navigation.replace("Trang Chủ")}
      />
      <NavItem
        icon="cart"
        label="Giỏ hàng"
        onPress={() => navigation.replace("Giỏ Hàng")}
      />
      <NavItem
        icon="analytics"
        label="Đơn hàng"
        onPress={() => navigation.replace("Quản Lý Đơn Hàng")}
      />
      <NavItem
        icon="person"
        label="Tài khoản"
        onPress={() => navigation.replace("Tài Khoản")}
      />
    </View>
  );
}

function NavItem({ icon, label, onPress }: any) {
  const [scale] = useState(new Animated.Value(1)); // Khởi tạo animation scale

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 1.1, // Tăng nhẹ kích thước icon khi nhấn
      duration: 200, // Thời gian hiệu ứng
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1, // Quay lại kích thước ban đầu
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={icon} size={22} color="#333" />
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  item: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#333",
  },
});
