import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../ipconfig";
import Navbar from "./Navbar";
import Icon from "react-native-vector-icons/MaterialIcons";

const colors = {
  primary: "#2c3e50",
  accent: "#ff6f61",
  secondary: "#27ae60",
  background: "#f9f9f9",
  text: "#333",
  muted: "#777",
};

interface Admin {
  id: number;
  username: string;
  email: string;
  role: number;
}

export default function UserManagement({ navigation }: any) {
  const [users, setUsers] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNavbarVisible, setIsNavbarVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/users?role=0&role1=1`);
      setUsers(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách user:", err);
      Alert.alert("Lỗi", "Không thể tải danh sách user. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const toggleNavbar = () => {
    setIsNavbarVisible((prevState) => !prevState);
  };

  const handleOutsidePress = () => {
    setIsNavbarVisible(false);
  };

  const handleDelete = (userId: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa tài khoản này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/deleteusers/${userId}`);
            Alert.alert("Thành công", "Tài khoản đã được xóa.");
            fetchUsers(); // Refresh list
          } catch (err) {
            console.error("Lỗi khi xóa:", err);
            Alert.alert(
              "Lỗi",
              "Không thể xóa tài khoản này. Vui lòng thử lại sau."
            );
          }
        },
        style: "destructive",
      },
    ]);
  };

  const renderUserItem = ({ item }: { item: Admin }) => (
    <View style={styles.item}>
      <Text style={styles.userId}>Tài khoản #{item.id}</Text>
      <Text style={styles.userUsername}>Tên đăng nhập: {item.username}</Text>
      <Text style={styles.userEmail}>Email: {item.email}</Text>
      <Text style={styles.userRole}>
        Vai trò: {item.role === 1 ? "Admin" : "User"}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
          accessible
          accessibilityLabel={`Xóa tài khoản ${item.username}`}
        >
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Đang tải danh sách user...</Text>
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

        <Text style={styles.title}>Quản Lý User</Text>

        {users.length === 0 ? (
          <View style={styles.noUsers}>
            <Text style={styles.noUsersText}>Chưa có tài khoản user nào.</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
            contentContainerStyle={styles.userList}
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
}

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
  noUsers: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noUsersText: {
    fontSize: 18,
    color: colors.muted,
  },
  userList: {
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
  userId: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  userUsername: {
    fontSize: 16,
    color: colors.muted,
    marginVertical: 5,
  },
  userEmail: {
    fontSize: 16,
    color: colors.muted,
    marginVertical: 5,
  },
  userRole: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
