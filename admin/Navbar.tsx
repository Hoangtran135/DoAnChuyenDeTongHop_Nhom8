import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;

interface NavbarProps {
  toggleNavbar: () => void;
}

export default function Navbar({ toggleNavbar }: NavbarProps) {
  const navigation = useNavigation<NavigationProp>();

  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showReportManagement, setShowReportManagement] = useState(false);

  const handleUserManagementPress = () => {
    setShowUserManagement(!showUserManagement);
    setShowReportManagement(false);
  };

  const handleReportManagementPress = () => {
    setShowReportManagement(!showReportManagement);
    setShowUserManagement(false);
  };

  return (
    <View style={styles.navbar}>
      <NavItem
        label="Trang Chủ"
        onPress={() => navigation.replace("Trang Chủ Admin")}
      />

      <NavItem label="Người dùng" onPress={handleUserManagementPress} />
      {showUserManagement && (
        <>
          <NavItem
            label="Quản lý Admin"
            onPress={() => navigation.replace("Quản Lý Admin")}
            isSubmenu
          />
          <NavItem
            label="Quản lý Users"
            onPress={() => navigation.replace("Quản Lý User")}
            isSubmenu
          />
        </>
      )}

      <NavItem
        label="Sản phẩm"
        onPress={() => navigation.replace("Quản Lý Sản Phẩm")}
      />
      <NavItem
        label="Danh mục"
        onPress={() => navigation.replace("Quản Lý Danh Mục")}
      />
      <NavItem
        label="Đơn hàng"
        onPress={() => navigation.replace("Quản Lý Đơn Hàng Admin")}
      />

      <NavItem
        label="Voucher"
        onPress={() => navigation.replace("Quản Lý Khuyến Mãi")}
      />
      <NavItem
        label="Banner"
        onPress={() => navigation.replace("Quản Lý Banner")}
      />
      <NavItem label="Chat" onPress={() => navigation.navigate("Chat Admin")} />

      <NavItem label="Báo cáo" onPress={handleReportManagementPress} />
      {showReportManagement && (
        <>
          <NavItem
            label="Doanh thu"
            onPress={() => navigation.replace("Báo Cáo Doanh Thu")}
            isSubmenu
          />
          <NavItem
            label="Sản phẩm bán chạy"
            onPress={() => navigation.replace("Sản Phẩm Bán Chạy")}
            isSubmenu
          />
        </>
      )}

      <NavItem
        label="Đăng Xuất"
        onPress={async () => {
          try {
            await AsyncStorage.removeItem("userId"); // xóa userId trong AsyncStorage
            navigation.replace("Trang Chủ");
          } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
          }
        }}
      />
    </View>
  );
}

function NavItem({
  label,
  onPress,
  isSubmenu = false,
}: {
  label: string;
  onPress: () => void;
  isSubmenu?: boolean;
}) {
  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={[styles.item, isSubmenu && styles.submenuItem]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={[styles.label, isSubmenu && styles.submenuLabel]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const colors = {
  primary: "#2c3e50",
  accent: "#ff6f61",
  background: "#f9f9f9",
  text: "#333",
  muted: "#777",
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: colors.background,
    borderRightWidth: 1,
    borderColor: colors.muted,
    width: 250,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  submenuItem: {
    marginLeft: 20,
    backgroundColor: colors.background,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  submenuLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.muted,
  },
});
