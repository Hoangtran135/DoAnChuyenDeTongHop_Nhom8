import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../ipconfig";
import Navbar from "./Navbar";

interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  images: string;
  productid: number;
}

const FavouriteScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => {
      if (id) {
        setUserId(parseInt(id, 10));
      }
    });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchFavorites = () => {
    setLoading(true);
    fetch(`${BASE_URL}/favourite/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Alert.alert("Lỗi", "Không thể tải danh sách yêu thích.");
      });
  };

  const handleRemoveFavorite = (productId: number) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            if (!userId) return;
            try {
              const res = await axios.delete(`${BASE_URL}/favorites`, {
                data: { user_id: userId, product_id: productId },
                headers: { "Content-Type": "application/json" },
              });
              if (res.status === 200) {
                setFavorites((prev) =>
                  prev.filter((item) => item.productid !== productId)
                );
              } else {
                Alert.alert("Lỗi", "Xóa sản phẩm thất bại.");
              }
            } catch (error) {
              Alert.alert("Lỗi", "Không thể kết nối tới server.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate("Chi Tiết Sản Phẩm", { productId: item.productid })
      }
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: item.images
            ? `${BASE_URL}/uploads/${item.images}`
            : "https://via.placeholder.com/100",
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          handleRemoveFavorite(item.productid);
        }}
      >
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!userId ? (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>
            Vui lòng đăng nhập để xem danh sách yêu thích.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Trang Đăng Nhập")}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6A0DAD" />
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : favorites.length === 0 ? (
            <Text style={styles.empty}>Chưa có sản phẩm nào.</Text>
          ) : (
            <FlatList
              data={favorites}
              keyExtractor={(item) => item.productid.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 100 }}
              style={{ flex: 1 }}
            />
          )}
        </>
      )}

      <View style={styles.navbarContainer}>
        <Navbar navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#888",
  },
  empty: {
    textAlign: "center",
    marginTop: 300,
    color: "#888",
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    color: "#d81b60",
    marginTop: 4,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 18,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  deleteButton: {
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ff4444",
    borderRadius: 6,
    alignSelf: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});

export default FavouriteScreen;
