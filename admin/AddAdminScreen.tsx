import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BASE_URL } from "../ipconfig";

export default function AddAdminScreen({ navigation }: any) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddAdmin = async () => {
    if (!fullName || !username || !password || !email || !phone || !address) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/registeradmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          username,
          password,
          email,
          phone,
          address,
          role: 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Thành công", data.alert || "Tài khoản admin đã được tạo.");
        setFullName("");
        setUsername("");
        setPassword("");
        setEmail("");
        setPhone("");
        setAddress("");
        navigation.replace("Quản Lý Admin");
      } else {
        Alert.alert("Lỗi", data.alert || "Không thể tạo tài khoản.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm admin:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          placeholderTextColor="#b0b0b0"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          placeholderTextColor="#b0b0b0"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#b0b0b0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#b0b0b0"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          placeholderTextColor="#b0b0b0"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          placeholderTextColor="#b0b0b0"
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddAdmin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Đang thêm..." : "Thêm Admin"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingVertical: 40,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
    justifyContent: "center",
  },
  input: {
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 18,
    marginBottom: 20,
    fontSize: 16,
    color: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
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
});
