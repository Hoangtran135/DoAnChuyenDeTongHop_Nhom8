import React, { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { BASE_URL } from "../ipconfig";

// Định nghĩa kiểu Navigation
type NavigationProp = StackNavigationProp<RootStackParamList>;

const Start = () => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((userId) => {
        if (!userId) {
          navigation.reset({ index: 0, routes: [{ name: "Trang Chủ" }] });
          return;
        }

        // Fetch với timeout (10 giây)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        fetch(`${BASE_URL}/checkusers/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        })
          .then((response) => {
            clearTimeout(timeoutId);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((result) => {
            if (result && result.role !== undefined) {
              if (Number(result.role) === 1) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Trang Chủ Admin" }],
                });
              } else {
                navigation.reset({ index: 0, routes: [{ name: "Trang Chủ" }] });
              }
            } else {
              Alert.alert("Lỗi", "Không xác định được vai trò người dùng.");
              navigation.reset({
                index: 0,
                routes: [{ name: "Trang Chủ" }],
              });
            }
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            let errorMessage = "Không thể kết nối đến máy chủ.";
            
            if (error.name === "AbortError" || error.message === "Network request timed out") {
              errorMessage = "Kết nối quá lâu. Vui lòng kiểm tra IP server và thử lại.";
            } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
              errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra IP và đảm bảo server đang chạy.";
            }
            
            Alert.alert("Lỗi kết nối", errorMessage);
            navigation.reset({
              index: 0,
              routes: [{ name: "Trang Chủ" }],
            });
          });
      })
      .catch(() => {
        Alert.alert("Lỗi", "Không thể lấy thông tin người dùng.");
        navigation.reset({ index: 0, routes: [{ name: "Trang Chủ" }] });
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#00aaff" />
    </View>
  );
};

export default Start;
