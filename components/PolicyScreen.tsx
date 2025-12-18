import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function PolicyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>1. Chính Sách Bảo Mật</Text>
      <Text style={styles.text}>
        - Nine Mart cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng.
        {"\n"}- Mọi dữ liệu chỉ được sử dụng cho mục đích liên quan đến dịch vụ chăm sóc khách hàng và không chia sẻ cho bên thứ ba.
      </Text>

      <Text style={styles.sectionTitle}>2. Chính Sách Giao Hàng</Text>
      <Text style={styles.text}>
        - Giao hàng nội thành trong vòng 2 giờ đối với đơn đặt trước 17h.
        {"\n"}- Miễn phí giao hàng cho đơn hàng từ 300.000đ.
        {"\n"}- Phí giao hàng cho đơn hàng nhỏ hơn 300.000đ là 15.000đ.
      </Text>

      <Text style={styles.sectionTitle}>3. Chính Sách Thanh Toán</Text>
      <Text style={styles.text}>
        - Chấp nhận thanh toán tiền mặt, chuyển khoản, ví điện tử Momo, ZaloPay.
        {"\n"}- Với thanh toán online, hóa đơn sẽ được gửi qua email hoặc SMS.
      </Text>

      <Text style={styles.sectionTitle}>4. Chính Sách Hỗ Trợ Khách Hàng</Text>
      <Text style={styles.text}>
        - Đội ngũ hỗ trợ hoạt động từ 8h đến 22h hàng ngày, kể cả cuối tuần.
        {"\n"}- Mọi thắc mắc, khiếu nại được tiếp nhận qua hotline, email hoặc fanpage Nine Mart.
      </Text>

      <Text style={styles.sectionTitle}>5. Chính Sách Bảo Hành Sản Phẩm</Text>
      <Text style={styles.text}>
        - Các sản phẩm điện tử gia dụng được bảo hành theo chính sách của nhà sản xuất.
        {"\n"}- Thời gian bảo hành cụ thể sẽ được ghi rõ trên phiếu bảo hành hoặc thông báo trong phần mô tả sản phẩm.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
});
