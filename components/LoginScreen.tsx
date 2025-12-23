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
import { theme } from "../styles/theme";

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
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Nhập mật khẩu"
          placeholderTextColor={theme.colors.textMuted}
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
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xxxl,
    letterSpacing: 0.5,
  },
  form: {
    width: "90%",
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    ...theme.shadow.md,
  },
  label: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    backgroundColor: theme.colors.backgroundGray,
    marginBottom: theme.spacing.xl,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.backgroundGray,
    overflow: "hidden",
    height: 50,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerItem: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    height: 50,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    ...theme.shadow.md,
  },
  buttonText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textLight,
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
    textAlign: "center",
    marginTop: theme.spacing.lg,
  },
});
