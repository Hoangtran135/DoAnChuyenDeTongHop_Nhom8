import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { BASE_URL } from "../ipconfig";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const styles = StyleSheet.create({
  addToCartButton: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    flex: 1,
    marginRight: 12,
    elevation: 4,
  },
  iconButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#6A0DAD",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default function ProductDetailScreen({ route, navigation }: any) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const { productId } = route.params || {};

  useEffect(() => {
    if (!productId) {
      Alert.alert("Lỗi", "Không tìm thấy sản phẩm");
      navigation.goBack();
      return;
    }

    fetchProduct();
    fetchUserId();
    fetchFeedbacks();
  }, [productId]);

  useEffect(() => {
    if (userId) {
      checkIfFavorite();
    }
  }, [userId]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products/${productId}`);
      setProduct(res.data);
    } catch (err) {
      console.error("❌ Lỗi lấy chi tiết sản phẩm:", err);
      Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserId = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        setUserId(parseInt(id, 10));
      }
    } catch (error) {
      console.warn("Lỗi lấy userId từ AsyncStorage:", error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/feedbacks/product/${productId}`);
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi lấy đánh giá:", err);
    }
  };

  const checkIfFavorite = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`${BASE_URL}/favorites/user/${userId}`);
      const favorites: any[] = res.data || [];
      const found = favorites.some((fav) => fav.product_id === productId);
      setIsFavorite(found);
    } catch (err) {
      console.warn("Lỗi kiểm tra mục yêu thích:", err);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      Alert.alert("Thông báo", "VUi lòng đăng nhập để tiếp tục");
      return;
    }
    if (!product) {
      Alert.alert("Thông báo", "Sản phẩm không tồn tại");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/cart-items`, {
        user_id: userId,
        product_id: product.id,
        quantity: 1,
      });
      Alert.alert("✅ Thành công", "Sản phẩm đã được thêm vào giỏ hàng");
    } catch (err) {
      console.error("❌ Lỗi thêm vào giỏ hàng:", err);
      Alert.alert("Lỗi", "Không thể thêm sản phẩm vào giỏ");
    }
  };

  // Hàm xử lý toggle yêu thích, gọi API thêm hoặc xóa favorites
  const handleToggleFavorite = async () => {
    if (!userId || !product) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để thực hiện thao tác này");
      return;
    }

    try {
      if (isFavorite) {
        // Gọi API xóa yêu thích
        await axios.delete(`${BASE_URL}/favorites`, {
          data: { user_id: userId, product_id: product.id },
        });
        setIsFavorite(false);
        Alert.alert("Thông báo", "Đã bỏ yêu thích sản phẩm");
      } else {
        // Gọi API thêm yêu thích
        await axios.post(`${BASE_URL}/favorites`, {
          user_id: userId,
          product_id: product.id,
        });
        setIsFavorite(true);
        Alert.alert("Thông báo", "Đã thêm sản phẩm vào yêu thích");
      }
    } catch (error) {
      console.error("Lỗi cập nhật yêu thích:", error);
      Alert.alert("Lỗi", "Không thể cập nhật yêu thích, vui lòng thử lại");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ff6f61" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy sản phẩm.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <Image
        source={{
          uri: product.images
            ? `${BASE_URL}/uploads/${product.images}`
            : undefined,
        }}
        style={{
          width: "100%",
          height: 320,
          resizeMode: "cover",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      />

      <View
        style={{
          padding: 20,
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginTop: -16,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#2c3e50",
            marginBottom: 12,
          }}
        >
          {product.name}
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            color: "#ff6f61",
            marginBottom: 16,
          }}
        >
          {product.price.toLocaleString()}₫
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#777",
            lineHeight: 24,
            marginBottom: 20,
          }}
        >
          {product.description}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
              Thêm vào giỏ hàng
            </Text>
          </TouchableOpacity>

          {userId && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleToggleFavorite}
            >
              <FontAwesome
                name="heart"
                size={28}
                color={isFavorite ? "red" : "white"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={{
          padding: 16,
          backgroundColor: "#f5f5f5",
          marginHorizontal: 16,
          marginTop: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>
          ⭐ Đánh giá sản phẩm
        </Text>
        {feedbacks.length > 0 ? (
          feedbacks.map((item, idx) => (
            <View
              key={idx}
              style={{
                marginBottom: 16,
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: 12,
                elevation: 2,
              }}
            >
              <Text style={{ fontWeight: "600", fontSize: 16 }}>
                {item.name || "Người dùng ẩn danh"}
              </Text>
              <Text style={{ marginTop: 4, color: "#555" }}>
                {item.feedback}
              </Text>
              <Text style={{ marginTop: 4 }}>⭐ {item.star}</Text>
              {item.images ? (
                <Image
                  source={{ uri: `${BASE_URL}/uploads/${item.images}` }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    marginTop: 6,
                  }}
                />
              ) : null}
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", color: "#999" }}>
            Chưa có đánh giá nào cho sản phẩm này.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
