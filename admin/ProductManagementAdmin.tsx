import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import { BASE_URL } from "../ipconfig";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import Navbar from "./Navbar";

const colors = {
  primary: "#2c3e50",
  accent: "#ff6f61",
  secondary: "#27ae60",
  background: "#f9f9f9",
  text: "#333",
  muted: "#777",
};

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  images: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export default function ProductManagementAdmin({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Hàm rút gọn mô tả sản phẩm
  const shortenDescription = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err);
      Alert.alert("Lỗi", "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(products);
      setSuggestionsVisible(false);
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);

    const suggestionList = products
      .map((p) => p.name)
      .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
    setSuggestions(suggestionList);
    setSuggestionsVisible(suggestionList.length > 0);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    const filtered = products.filter(
      (product) => product.name.toLowerCase() === suggestion.toLowerCase()
    );
    setFilteredProducts(filtered);
    setSuggestionsVisible(false);
  };

  const handleEdit = (productId: number) => {
    navigation.navigate("Cập Nhật Sản Phẩm", { productId });
  };

  const handleDelete = async (productId: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa sản phẩm này không?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/products/${productId}`);
            Alert.alert("Thành công", "Sản phẩm đã được xóa.");
            fetchProducts();
          } catch (err) {
            Alert.alert("Lỗi", "Không thể xóa sản phẩm này. Vui lòng thử lại sau.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const toggleNavbar = () => {
    setIsNavbarVisible((prevState) => !prevState);
  };

  const handleOutsidePress = () => {
    setIsNavbarVisible(false);
    setSuggestionsVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Đang tải danh sách sản phẩm...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleNavbar}>
          <Icon name={isNavbarVisible ? "close" : "menu"} size={30} color="#fff" />
        </TouchableOpacity>

        {isNavbarVisible && <Navbar toggleNavbar={toggleNavbar} />}

        <Text style={styles.title}>Quản Lý Sản Phẩm</Text>

        {/* Thanh tìm kiếm bên dưới tiêu đề */}
        <View style={{ zIndex: 0, marginBottom: 10 }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => {
              if (suggestions.length > 0) setSuggestionsVisible(true);
            }}
          />

         
        </View>

        {filteredProducts.length === 0 ? (
          <View style={styles.noProducts}>
            <Text style={styles.noProductsText}>Không tìm thấy sản phẩm nào.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.productList}>
            {filteredProducts.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.price}>Giá: {item.price}</Text>
                <Text style={styles.description}>
                  Mô tả: {shortenDescription(item.description)}
                </Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => handleEdit(item.id)}
                  >
                    <Text style={styles.buttonText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.buttonText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Thêm Sản Phẩm Admin")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 8,
    zIndex: 1000,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.muted,
  },
  noProducts: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProductsText: {
    fontSize: 18,
    color: colors.muted,
  },
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginTop: 5,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderTopWidth: 0,
    maxHeight: 150,
    zIndex: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  productList: {
    paddingBottom: 80,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },
  price: {
    fontSize: 16,
    color: colors.accent,
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: colors.muted,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: colors.secondary,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  addButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#333",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 28,
    color: "#fff",
  },
});
