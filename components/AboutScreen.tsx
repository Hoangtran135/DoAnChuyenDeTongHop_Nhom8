import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.sectionTitle}>Giới Thiệu</Text>
      <Text style={styles.text}>
        Nine Mart là cửa hàng tạp hóa hiện đại, cung cấp đầy đủ các mặt hàng thiết yếu cho cuộc sống hàng ngày. Chúng tôi tự hào mang đến cho khách hàng trải nghiệm mua sắm tiện lợi, nhanh chóng và chất lượng.
      </Text>

      <Text style={styles.sectionTitle}>Sứ Mệnh</Text>
      <Text style={styles.text}>
        Chúng tôi cam kết phục vụ cộng đồng với sự tận tâm và uy tín, luôn đảm bảo sản phẩm sạch – an toàn – đúng giá. Nine Mart mong muốn trở thành người bạn đồng hành đáng tin cậy trong mỗi gia đình Việt.
      </Text>

      <Text style={styles.sectionTitle}>Giá Trị Cốt Lõi</Text>
      <Text style={styles.text}>
        - Khách hàng là trung tâm{"\n"}
        - Minh bạch và trung thực{"\n"}
        - Luôn đổi mới{"\n"}
        - Gắn kết cộng đồng
      </Text>

      <Text style={styles.sectionTitle}>Tại Sao Chọn Nine Mart?</Text>
      <Text style={styles.text}>
        ✅ Đa dạng sản phẩm{"\n"}
        ✅ Dịch vụ giao hàng nhanh{"\n"}
        ✅ Nhân viên thân thiện, chuyên nghiệp{"\n"}
        ✅ Chương trình khuyến mãi hấp dẫn hàng tuần
      </Text>

      <Text style={styles.footer}>Cảm ơn bạn đã tin tưởng và đồng hành cùng Nine Mart!</Text>
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
  footer: {
    marginTop: 30,
    fontSize: 16,
    fontStyle: "italic",
    color: "#444",
    textAlign: "center",
  },
});
