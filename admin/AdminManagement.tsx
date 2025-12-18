import React, { useState, useEffect } from "react";
import { BASE_URL } from "../ipconfig";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
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

export default function AdminManagement({ navigation }: any) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNavbarVisible, setIsNavbarVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users?role=1&role1=1`);
      setAdmins(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách Admin:", err);
      Alert.alert("Lỗi", "Không thể tải danh sách Admin. Vui lòng thử lại sau.");
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

  const handleEdit = (adminId: number) => {
    navigation.navigate("Cập Nhật Admin", { adminId });
  };

  const handleDelete = async (adminId: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa tài khoản này không?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/deleteusers/${adminId}`);
            Alert.alert("Thành công", "Tài khoản đã được xóa.");
            fetchAdmins();
          } catch (err) {
            Alert.alert("Lỗi", "Không thể xóa tài khoản này. Vui lòng thử lại sau.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Đang tải danh sách admin...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        {/* Toggle Navbar */}
        <TouchableOpacity style={styles.toggleButton} onPress={toggleNavbar}>
          <Icon name={isNavbarVisible ? "close" : "menu"} size={30} color="#fff" />
        </TouchableOpacity>

        {isNavbarVisible && <Navbar toggleNavbar={toggleNavbar} />}

        <Text style={styles.title}>Quản Lý Admin</Text>

        {admins.length === 0 ? (
          <View style={styles.noAdmins}>
            <Text style={styles.noAdminsText}>Chưa có tài khoản admin nào.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.adminList}>
            {admins.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.userName}>Tài khoản #{item.id}</Text>
                <Text style={styles.email}>Email: {item.email}</Text>
                <Text style={styles.role}>Vai trò: {item.role === 1 ? "Admin" : "Khác"}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => handleEdit(item.id)}
                  >
                    <Text style={styles.buttonText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.buttonText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("Thêm Admin")}>
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>
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
  noAdmins: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noAdminsText: {
    fontSize: 18,
    color: colors.muted,
  },
  adminList: {
    paddingBottom: 80,
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
  email: {
    fontSize: 16,
    color: colors.muted,
    marginVertical: 5,
  },
  role: {
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
  editButton: {
    backgroundColor: colors.secondary,
  },
  deleteButton: {
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
