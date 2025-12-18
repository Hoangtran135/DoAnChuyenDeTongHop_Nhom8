import React, { useState } from "react";
import { BASE_URL } from "../ipconfig";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const colors = {
  primary: "#6A0DAD", // Button
  accent: "#ff6f61", // Highlights
  secondary: "#27ae60",
  background: "#f9f9f9",
  text: "#2c3e50",
  muted: "#777",
};

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(0); // 0 = Member, 1 = Admin

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Lỗi nhập liệu", "Vui lòng nhập cả tên đăng nhập và mật khẩu");
      return;
    }

    axios
      .post(`${BASE_URL}/login`, { username, password, role })
      .then((res) => {
        if (res.data.success) {
          const userId = res.data.user.id;
          AsyncStorage.setItem("userId", userId.toString()).then(() => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: role === 1 ? "Trang Chủ Admin" : "Trang Chủ",
                  params: { user: res.data.user },
                },
              ],
            });
          });
        } else {
          Alert.alert("Đăng nhập thất bại", res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Lỗi", "Đăng Nhập Thất Bại.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Tên đăng nhập</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Nhập tên đăng nhập"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Nhập mật khẩu"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Chọn vai trò</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
            {...(Platform.OS === "ios" && { itemStyle: styles.pickerItem })}
          >
            <Picker.Item label="Member" value={0} />
            <Picker.Item label="Admin" value={1} />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Trang Đăng Ký")}>
          <Text style={styles.footerText}>Chưa có tài khoản? Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  form: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: "#fafafa",
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fafafa",
    overflow: "hidden",
    height: 50,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerItem: {
    fontSize: 16,
    color: colors.text,
    height: 50,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.primary,
    textAlign: "center",
    marginTop: 16,
  },
});
