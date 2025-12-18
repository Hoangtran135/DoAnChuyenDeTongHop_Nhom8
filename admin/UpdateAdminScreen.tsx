import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../ipconfig";

type AdminInfo = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

export default function UpdateAdminScreen({ route, navigation }: any) {
  const { adminId } = route.params;
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${adminId}`);
        if (response.data.success) {
          const user = response.data.user;
          setAdminInfo({
            id: user.id?.toString() || "",
            username: user.username || "",
            fullName: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            password: user.password || "",
          });
        } else {
          Alert.alert("Lỗi", "Không tìm thấy quản trị viên");
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể lấy dữ liệu quản trị viên");
      }
      setLoading(false);
    };

    fetchAdminInfo();
  }, [adminId, navigation]);

  const handleUpdate = () => {
    if (!adminInfo) return;

    const { username, fullName, email, phone, address } = adminInfo;
    if (!username || !fullName || !email || !phone || !address) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    axios
      .put(`${BASE_URL}/updateadmin/${adminInfo.id}`, {
        name: adminInfo.fullName,
        email: adminInfo.email,
        phone: adminInfo.phone,
        address: adminInfo.address,
        username: adminInfo.username,
        password: adminInfo.password,
      })
      .then((response) => {
        if (response.data.success) {
          Alert.alert(
            "Thành công",
            "Cập nhật thông tin quản trị viên thành công"
          );
          navigation.replace("Quản Lý Admin");
        } else {
          Alert.alert("Lỗi", "Cập nhật thông tin thất bại");
        }
      })
      .catch(() => Alert.alert("Lỗi", "Không thể cập nhật thông tin"));
  };

  if (loading)
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#1a1a1a" />
    );
  if (!adminInfo)
    return <Text style={styles.errorText}>Không tìm thấy quản trị viên</Text>;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={styles.label}>ID Quản trị viên:</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={adminInfo.id}
            editable={false}
          />

          <Text style={styles.label}>Tên đăng nhập:</Text>
          <TextInput
            style={styles.input}
            value={adminInfo.username}
            onChangeText={(text) =>
              setAdminInfo({ ...adminInfo, username: text })
            }
            placeholder="Nhập tên đăng nhập"
            placeholderTextColor="#b0b0b0"
          />

          <Text style={styles.label}>Họ và tên:</Text>
          <TextInput
            style={styles.input}
            value={adminInfo.fullName}
            onChangeText={(text) =>
              setAdminInfo({ ...adminInfo, fullName: text })
            }
            placeholder="Nhập họ và tên"
            placeholderTextColor="#b0b0b0"
          />

          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={adminInfo.email}
            onChangeText={(text) => setAdminInfo({ ...adminInfo, email: text })}
            placeholder="Nhập email"
            placeholderTextColor="#b0b0b0"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Số điện thoại:</Text>
          <TextInput
            style={styles.input}
            value={adminInfo.phone}
            onChangeText={(text) => setAdminInfo({ ...adminInfo, phone: text })}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#b0b0b0"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Địa chỉ:</Text>
          <TextInput
            style={styles.input}
            value={adminInfo.address}
            onChangeText={(text) =>
              setAdminInfo({ ...adminInfo, address: text })
            }
            placeholder="Nhập địa chỉ"
            placeholderTextColor="#b0b0b0"
          />

          <Text style={styles.label}>Mật khẩu mới (nếu muốn thay đổi):</Text>
          <TextInput
            style={styles.input}
            value={adminInfo.password}
            onChangeText={(text) =>
              setAdminInfo({ ...adminInfo, password: text })
            }
            placeholder="Nhập mật khẩu mới"
            placeholderTextColor="#b0b0b0"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !adminInfo && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={!adminInfo}
        >
          <Text style={styles.buttonText}>Cập nhật</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    paddingHorizontal: 28,
    paddingVertical: 40,
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  button: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#b0b0b0",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: "#1a1a1a",
    marginTop: 50,
  },
});
