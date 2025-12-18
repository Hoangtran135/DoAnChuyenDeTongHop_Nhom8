import React, { useEffect, useState } from "react";
import NotLoggedIn from "../settings/NotLoggedIn";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../ipconfig";
import Navbar from "./Navbar";
import Icon from "react-native-vector-icons/Ionicons";

export default function AccountScreen({ navigation }: any) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setLoading(true);
    AsyncStorage.getItem("userId")
      .then((id) => {
        if (id) {
          setUserId(id);
          return axios.get(`${BASE_URL}/user/${id}`);
        } else {
          setUserId(null);
          setUserInfo(null);
          setLoading(false);
          return null;
        }
      })
      .then((res) => {
        if (res && res.data.success) {
          setUserInfo(res.data.user);
        } else if (res) {
          Alert.alert("Lỗi", "Không tìm thấy người dùng");
          setUserInfo(null);
        }
      })
      .catch(() => {
        Alert.alert("Lỗi", "Không thể lấy thông tin");
        setUserInfo(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigation]);

  const handleLogout = () => {
    setLoading(true);
    AsyncStorage.removeItem("userId")
      .then(() => {
        setUserId(null);
        setUserInfo(null);
        navigation.reset({
          index: 0,
          routes: [{ name: "Trang Chủ" }],
        });
      })
      .finally(() => setLoading(false));
  };

  const handleUpdate = () => {
    navigation.navigate("Cập Nhật Tài Khoản");
  };

  const handleVoucher = () => {
    navigation.navigate("Khuyến Mãi");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A0DAD" />
        <Text style={{ marginTop: 10 }}>Đang tải...</Text>
      </View>
    );
  }

  // ✅ Giao diện khi chưa đăng nhập - kiểu OrderManagement
  if (!userId) {
    return <NotLoggedIn navigation={navigation} />;
  }

  if (!userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không có thông tin người dùng.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topSection}>
          <Image
            source={require("../assets/avatar.png")}
            style={styles.avatar}
          />
          <Text style={styles.name}>{userInfo.name}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setShowInfo(!showInfo)}
          >
            <Text style={styles.buttonText}>Thông Tin Cá Nhân</Text>
          </TouchableOpacity>

          {showInfo && (
            <View style={styles.infoCard}>
              <View style={styles.inputContainer}>
                <Icon
                  name="person-outline"
                  size={20}
                  color="#666"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={userInfo.name}
                  editable={false}
                  placeholder="Họ tên"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="call-outline"
                  size={20}
                  color="#666"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={userInfo.phone}
                  editable={false}
                  placeholder="Số điện thoại"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="mail-outline"
                  size={20}
                  color="#666"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={userInfo.email}
                  editable={false}
                  placeholder="Email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon
                  name="location-outline"
                  size={20}
                  color="#666"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={userInfo.address}
                  editable={false}
                  placeholder="Địa chỉ"
                />
              </View>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
              >
                <Text style={styles.updateButtonText}>Cập nhật thông tin</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.mainButton} onPress={handleVoucher}>
            <Text style={styles.buttonText}>Khuyến Mãi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => navigation.navigate("Yêu Thích")}
          >
            <Text style={styles.buttonText}>Yêu Thích</Text>
          </TouchableOpacity>
           <TouchableOpacity
            style={styles.mainButton}
            onPress={() => navigation.navigate("Giới Thiệu")}
          >
            <Text style={styles.buttonText}>Giới Thiệu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => navigation.navigate("Chính Sách")}
          >
            <Text style={styles.buttonText}>Chính Sách</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => navigation.navigate("Liên Hệ")}
          >
            <Text style={styles.buttonText}>Liên Hệ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => navigation.navigate("Chat Page")}
          >
            <Text style={styles.buttonText}>Chat Với NineMart</Text>
          </TouchableOpacity>
         
          <TouchableOpacity
            style={[styles.mainButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.buttonText, { color: "#dc3545" }]}>
              Đăng Xuất
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Navbar navigation={navigation} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 24,
  },
  scrollContainer: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  topSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  phone: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  buttonContainer: {
    width: "100%",
  },
  mainButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  logoutButton: {
    borderColor: "#dc3545",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#333",
  },
  updateButton: {
    backgroundColor: "#6A0DAD",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // ==== Sửa phần này cho giao diện chưa đăng nhập ====
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: -50,
  },
  promptText: {
    fontSize: 18,
    color: "#444",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  bigLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6A0DAD",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  bigLoginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
