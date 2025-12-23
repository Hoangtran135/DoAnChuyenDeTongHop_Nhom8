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
  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={0.7}
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
