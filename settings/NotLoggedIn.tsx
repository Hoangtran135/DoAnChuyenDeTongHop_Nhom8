import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Navbar from "../components/Navbar";

export default function NotLoggedIn({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Icon name="person-circle-outline" size={100} color="#6A0DAD" />
        <Text style={styles.promptText}>Bạn chưa đăng nhập</Text>
        <TouchableOpacity
          style={styles.bigLoginButton}
          onPress={() => navigation.navigate("Trang Đăng Nhập")}
        >
          <Icon
            name="log-in-outline"
            size={24}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.bigLoginButtonText}>Đăng Nhập Ngay</Text>
        </TouchableOpacity>
      </View>
      <Navbar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
});
