import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../ipconfig";
import Navbar from "./Navbar";
import Icon from "react-native-vector-icons/MaterialIcons";

const colors = {
  primary: "#2c3e50",
  accent: "#ff6f61",
  secondary: "#27ae60",
  background: "#f9f9f9",
  text: "#333",
  muted: "#777",
};

type Category = {
  id: number;
  name: string;
  product_count: number;
};

const CategoryManagementAdmin = ({ navigation }: { navigation: any }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      Alert.alert("Lỗi", "Không thể tải danh sách danh mục. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const toggleNavbar = () => {
    setIsNavbarVisible((prevState) => !prevState);
  };

  const handleOutsidePress = () => {
    setIsNavbarVisible(false);
  };

  const handleDelete = (categoryId: number, productCount: number) => {
    if (productCount > 0) {
      Alert.alert("Không thể xóa", "Danh mục này vẫn còn sản phẩm.");
      return;
    }

    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa danh mục này không?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/categories/${categoryId}`);
            Alert.alert("Thành công", "Danh mục đã được xóa.");
            setCategories(categories.filter((item) => item.id !== categoryId));
          } catch (err) {
            Alert.alert("Lỗi", "Không thể xóa danh mục này. Vui lòng thử lại sau.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleEdit = (categoryId: number) => {
    navigation.navigate("Cập Nhật Danh Mục", { categoryId });
  };

  const handleAddCategory = () => {
    navigation.navigate("Thêm Danh Mục");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Đang tải danh sách danh mục...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleNavbar}>
          <Icon
            name={isNavbarVisible ? "close" : "menu"}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>

        {isNavbarVisible && <Navbar toggleNavbar={toggleNavbar} />}

        <Text style={styles.title}>Quản Lý Danh Mục</Text>

        {categories.length === 0 ? (
          <View style={styles.noCategories}>
            <Text style={styles.noCategoriesText}>Chưa có danh mục nào.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {categories.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.productCount}>Số sản phẩm: {item.product_count}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => handleEdit(item.id)}
                  >
                    <Text style={styles.buttonText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDelete(item.id, item.product_count)}
                  >
                    <Text style={styles.buttonText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingHorizontal: 15,
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
    marginVertical: 15,
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
  noCategories: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCategoriesText: {
    fontSize: 18,
    color: colors.muted,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  productCount: {
    fontSize: 14,
    color: colors.muted,
    marginVertical: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: colors.secondary,
  },
  deleteButton: {
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
});

export default CategoryManagementAdmin;
