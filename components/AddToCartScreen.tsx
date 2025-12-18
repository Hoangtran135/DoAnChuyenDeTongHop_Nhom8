import React, { useEffect, useState } from "react";
import { BASE_URL } from "../ipconfig";
import {
  View,
  Text,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const colors = {
  primary: "#6A0DAD", // Buttons
  accent: "#ff6f61", // Price
  background: "#ffffff", // Modal background
  text: "#2c3e50", // Primary text
  muted: "#777", // Secondary text
};

interface AddToCartScreenProps {
  visible: boolean;
  onClose: () => void;
  productId: number | null;
  navigation?: any; // Đã đổi thành không bắt buộc
  userId: number | null; // thêm dòng này
}

const AddToCartScreen: React.FC<AddToCartScreenProps> = ({
  visible,
  onClose,
  productId,
  navigation, // có thể có hoặc không
}) => {
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (productId && visible) {
      axios
        .get(`${BASE_URL}/products/${productId}`)
        .then((res) => setProduct(res.data))
        .catch((err) => console.error("❌ Lỗi lấy sản phẩm:", err));

      AsyncStorage.getItem("userId").then((id) => {
        if (id) {
          setUserId(parseInt(id, 10));
        }
      });
    }
  }, [productId, visible]);

  const handleAddToCart = () => {
    if (!userId || !product) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để tiếp tục");
      return;
    }

    if (quantity <= 0 || isNaN(quantity)) {
      Alert.alert("Thông báo", "Số lượng không hợp lệ");
      return;
    }

    axios
      .post(`${BASE_URL}/cart-items`, {
        user_id: userId,
        product_id: product.id,
        quantity: quantity,
      })
      .then(() => {
        Alert.alert("Đã thêm vào giỏ hàng");
        setQuantity(1);
        onClose();
      })
      .catch((err) => {
        console.error("❌ Lỗi thêm vào cart_items:", err);
        Alert.alert("❌ Lỗi khi thêm vào giỏ hàng");
      });
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              {product ? (
                <>
                  <View style={styles.topContainer}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri: `${BASE_URL}/uploads/${product.images}`,
                        }}
                        style={styles.productImage}
                      />
                    </View>
                    <View style={styles.productInfoContainer}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>
                        {product.price.toLocaleString()}₫
                      </Text>
                    </View>
                  </View>

                  <View style={styles.productDetailsContainer}>
                    <Text style={styles.productDescription}numberOfLines={2} ellipsizeMode="tail">
                      {product.description}
                    </Text>

                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={handleDecrease}
                      >
                        <Text style={styles.quantityButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={handleIncrease}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={handleAddToCart}
                      style={styles.confirmButton}
                    >
                      <Text style={styles.buttonText}>Xác nhận</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff", // Nền trắng giống Shopee
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: "40%", // Giảm chiều cao để gọn hơn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  topContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  imageContainer: {
    width: 80, // Giảm kích thước hình ảnh để gọn như trong hình
    height: 80,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0", // Nền xám nhạt khi hình chưa tải
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // Chuyển sang contain để giống hình ảnh trong giỏ hàng
  },
  productInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16, // Giảm kích thước chữ để giống Shopee
    fontWeight: "500",
    color: "#333", // Màu chữ tối
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6A0DAD", // Màu cam đặc trưng của Shopee
  },
  productDetailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  productDescription: {
    fontSize: 14,
    color: "#888", // Màu xám nhạt cho mô tả
    marginBottom: 16,
    lineHeight: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Căn trái giống hình
    marginBottom: 16,
  },
  quantityButton: {
    backgroundColor: "#e0e0e0", // Nền xám nhạt giống nút trong hình giỏ hàng
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  quantityButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    minWidth: 40,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#6A0DAD", // Màu đỏ giống nút "Mua hàng" trong hình
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
        textAlign: "center",

  },
  loadingText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
export default AddToCartScreen;
