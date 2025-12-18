import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function ContactScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.item}>
        <Icon name="call-outline" size={24} color="#6A0DAD" style={styles.icon} />
        <View>
          <Text style={styles.label}>Hotline</Text>
          <Text style={styles.value}>0378106753</Text>
        </View>
      </View>

      <View style={styles.item}>
        <Icon name="mail-outline" size={24} color="#6A0DAD" style={styles.icon} />
        <View>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>hoangtranxuan04@gmail.com</Text>
        </View>
      </View>

      <View style={styles.item}>
        <Icon name="location-outline" size={24} color="#6A0DAD" style={styles.icon} />
        <View>
          <Text style={styles.label}>Địa chỉ</Text>
          <Text style={styles.value}>Quỳnh Mai, Hai Bà Trưng, Hà Nội</Text>
        </View>
      </View>

      <View style={styles.item}>
        <Icon name="time-outline" size={24} color="#6A0DAD" style={styles.icon} />
        <View>
          <Text style={styles.label}>Giờ hoạt động</Text>
          <Text style={styles.value}>7:00 - 21:00 (Thứ 2 - Chủ Nhật)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6A0DAD",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginTop: 2,
  },
});
