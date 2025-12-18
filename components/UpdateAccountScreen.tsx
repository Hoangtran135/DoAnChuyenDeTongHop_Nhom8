import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { BASE_URL } from "../ipconfig";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

const colors = {
  primary: "#6A0DAD", // Button
  accent: "#ff6f61", // Not used here but included for consistency
  secondary: "#27ae60", // Not used here but included for consistency
  background: "#f9f9f9",
  text: "#2c3e50", // Primary text
  muted: "#777", // Secondary text and icons
};

type UserInfo = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function UpdateAccountScreen({ navigation }: any) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`${BASE_URL}/user/${userId}`);
          if (response.data.success) {
            setUserInfo(response.data.user);
          } else {
            Alert.alert("Lỗi", "Không tìm thấy người dùng");
            navigation.goBack();
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
          Alert.alert("Lỗi", "Không thể lấy dữ liệu người dùng");
        }
      } else {
        Alert.alert("Lỗi", "Người dùng chưa đăng nhập");
        navigation.navigate("Trang Đăng Nhập");
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [navigation]);

  const handleUpdate = () => {
    if (!userInfo) {
      Alert.alert("Lỗi", "Không có thông tin người dùng");
      return;
    }

    if (
      !userInfo.name ||
      !userInfo.email ||
      !userInfo.phone ||
      !userInfo.address
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    axios
      .put(`${BASE_URL}/updateuser/${userInfo.id}`, userInfo)
      .then((response) => {
        if (response.data.success) {
          Alert.alert("Thành công", "Cập nhật thông tin thành công");
          navigation.navigate("Tài Khoản");
        } else {
          Alert.alert("Lỗi", "Cập nhật thông tin thất bại");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật dữ liệu người dùng:", error);
        Alert.alert("Lỗi", "Không thể cập nhật thông tin");
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Không tìm thấy thông tin người dùng
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Icon
              name="person-outline"
              size={24}
              color={colors.muted}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={userInfo.name}
              onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
              placeholder="Tên"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon
              name="mail-outline"
              size={24}
              color={colors.muted}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={userInfo.email}
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
              placeholder="Email"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon
              name="call-outline"
              size={24}
              color={colors.muted}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={userInfo.phone}
              onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
              placeholder="Số điện thoại"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon
              name="location-outline"
              size={24}
              color={colors.muted}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={userInfo.address}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, address: text })
              }
              placeholder="Địa chỉ"
              placeholderTextColor={colors.muted}
            />
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Cập nhật thông tin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // #f9f9f9
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollContainer: {
    paddingBottom: 120, // Extra padding for ScrollView
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.muted, // #777
  },
  errorText: {
    fontSize: 18,
    color: colors.muted, // #777
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text, // #2c3e50
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.text, // #2c3e50
  },
  updateButton: {
    backgroundColor: colors.primary, // #6A0DAD
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
});
