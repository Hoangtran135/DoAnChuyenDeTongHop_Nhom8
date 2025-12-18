import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../ipconfig";
import Navbar from "./Navbar";
import AddToCartScreen from "./AddToCartScreen";

export default function HomeScreen({ route, navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [topSearches, setTopSearches] = useState<string[]>([]);
  const [productNameList, setProductNameList] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [banners, setBanners] = useState<any[]>([]);
  const [showBannerAndCategories, setShowBannerAndCategories] = useState(true);
  useEffect(() => {
    if (banners.length <= 1) return; 

    const intervalId = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, [banners]);
  useEffect(() => {
    if (route.params?.userId) {
      setUserId(route.params.userId);
    } else {
      AsyncStorage.getItem("userId").then((id) => {
        if (id) {
          setUserId(parseInt(id, 10));
        }
      });
    }
  }, [route.params]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/listcategories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    const url =
      selectedCategoryId !== null
        ? `${BASE_URL}/products?category_id=${selectedCategoryId}`
        : `${BASE_URL}/products`;
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setProductNameList(res.data.map((p: any) => p.name));
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, [selectedCategoryId]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`${BASE_URL}/topSearches`, {
          params: { limit: 4, userId: userId },
        })
        .then((res) => setTopSearches(res.data))
        .catch((err) => console.error("Error fetching top searches:", err));
    } else {
      setTopSearches([]);
    }
  }, [userId]);

  useEffect(() => {
    if (searchText.trim() === "") {
      setSearchSuggestions([]);
    } else {
      const keyword = searchText.trim().toLowerCase();
      const suggestions = productNameList
        .filter((name) => name.toLowerCase().includes(keyword))
        .slice(0, 3);
      setSearchSuggestions(suggestions);
    }
  }, [searchText, productNameList]);

  // Lấy banner
  useEffect(() => {
    axios
      .get(`${BASE_URL}/laybanners`)
      .then((res) => setBanners(res.data))
      .catch((err) => console.error("Error fetching banners:", err));
  }, []);

  const clearSearch = () => {
    setSearchText("");
    setFilteredProducts(products);
    setIsSearchFocused(true);
  };
  const saveSearchKeyword = (keyword: string) => {
    if (!userId) return;
    axios
      .post(`${BASE_URL}/saveSearch`, {
        userId,
        searchContent: keyword,
      })
      .catch((err) => console.error("Error saving search:", err));
  };
  const handleSearch = async () => {
    const trimmed = searchText.trim();

    if (trimmed === "") {
      setFilteredProducts(products);
      return;
    }

    setShowBannerAndCategories(false);

    // Lọc sản phẩm trong mảng products dựa trên tên chứa trimmed (không gọi API)
    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(trimmed.toLowerCase())
    );

    setSearchText(trimmed);
    saveSearchKeyword(trimmed);
    setSelectedCategoryId(null);
    setFilteredProducts(filtered);

    // Cập nhật lại top 4 tìm kiếm từ server nếu có userId
    if (userId) {
      try {
        const response = await axios.get(`${BASE_URL}/topSearches`, {
          params: { limit: 4, userId },
        });
        setTopSearches(response.data);
      } catch (error) {
        console.error("Failed to fetch top searches:", error);
      }
    }
  };
  const handleSelectSuggestion = async (keyword: string) => {
    setSearchText(keyword);
    saveSearchKeyword(keyword);
    setSelectedCategoryId(null);
    setShowBannerAndCategories(false);

    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredProducts(filtered);

    if (userId) {
      try {
        const response = await axios.get(`${BASE_URL}/topSearches`, {
          params: { limit: 4, userId },
        });
        setTopSearches(response.data);
      } catch (error) {
        console.error("Failed to fetch top searches:", error);
      }
    }
  };
  const handleAddToCart = (item: any) => {
    setSelectedProductId(item.id);
    setShowAddToCart(true);
  };

  const handleNavigateToDetail = (item: any) => {
    navigation.navigate("Chi Tiết Sản Phẩm", { productId: item.id });
  };

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategoryId === item.id && styles.categoryItemSelected,
      ]}
      onPress={() => setSelectedCategoryId(item.id)}
    >
      <View style={styles.categoryImageWrapper}>
        <Image
          source={{
            uri: item.images
              ? `${BASE_URL}/uploads/${item.images}`
              : "https://via.placeholder.com/100",
          }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.categoryTextWrapper}>
        <Text
          style={[
            styles.categoryName,     
            selectedCategoryId === item.id && styles.categoryNameSelected,
          ]}
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder=" Search products..."
          value={searchText}
          onChangeText={setSearchText}
          onFocus={() => {
            setIsSearchFocused(true);
            setSelectedCategoryId(null);
          }}
          onBlur={() => setIsSearchFocused(false)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {isSearchFocused && (
        <View style={styles.searchOverlay}>
          {userId && searchText.trim() === "" && topSearches.length > 0
            ? topSearches.map((keyword, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectSuggestion(keyword)}
                  style={styles.topSearchItem}
                >
                  <Text style={styles.topSearchText}>{keyword}</Text>
                </TouchableOpacity>
              ))
            : searchSuggestions.map((keyword, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectSuggestion(keyword)}
                  style={styles.topSearchItem}
                >
                  <Text style={styles.topSearchText}>{keyword}</Text>
                </TouchableOpacity>
              ))}
        </View>
      )}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {showBannerAndCategories && (
          <>
            {/* Banner */}
            {banners.length > 0 && (
              <View style={styles.bannerContainer}>
                <Image
                  source={{
                    uri: `${BASE_URL}/uploads/${banners[currentBannerIndex].images}`,
                  }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📂 Categories</Text>
              <FlatList
                data={categories}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={renderCategoryItem}
                horizontal
                contentContainerStyle={styles.categoryContainer}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛍️ Products</Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#6A0DAD"
              style={{ marginTop: 20 }}
            />
          ) : filteredProducts.length === 0 ? (
            <Text style={styles.noProductsText}>No products found!</Text>
          ) : (
            <View style={styles.productContainer}>
              {filteredProducts.map((item: any) => (
                <View key={item.id.toString()} style={styles.item}>
                  <Image
                    source={{ uri: `${BASE_URL}/uploads/${item.images}` }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.price}>
                    {Number(item.price).toLocaleString()} VND
                  </Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text style={styles.buttonText}>Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleNavigateToDetail(item)}
                  >
                    <Text style={styles.buttonText}>Details</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {showAddToCart && selectedProductId && (
        <AddToCartScreen
          visible={showAddToCart}
          productId={selectedProductId}
          onClose={() => setShowAddToCart(false)}
          userId={userId}
          navigation={navigation}
        />
      )}

      <Navbar navigation={navigation} userId={userId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Nền sáng nhẹ giống Shopee
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#333",
  },
  clearButton: {
    position: "absolute",
    right: 85,
    top: 8,
    backgroundColor: "#ddd",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 18,
    color: "#666",
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#6A0DAD", // Màu cam Shopee
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  bannerContainer: {
    width: "100%",
    height: 190,
    marginVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  searchOverlay: {
    position: "absolute",
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
    zIndex: 10,
    maxHeight: 200,
  },
  topSearchItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  topSearchText: {
    fontSize: 14,
    color: "#333",
  },
  section: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  categoryContainer: {
    paddingVertical: 5,
  },
  categoryItem: {
    width: 90, // Giảm chiều rộng để gọn hơn
    height: 120,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 8,
    marginRight: 8,
    elevation: 2,
  },
  categoryItemSelected: {
    borderColor: "#ff6200",
    borderWidth: 1,
  },
  categoryImageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 5,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryTextWrapper: {
    alignItems: "center",
  },
  categoryName: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  categoryNameSelected: {
    color: "#ff6200",
    fontWeight: "bold",
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    width: "48%",
    backgroundColor: "#fff",
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f0f0f0", // Nền khi hình chưa tải
  },
  name: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  price: {
    marginTop: 3,
    fontSize: 14,
    color: "#6A0DAD", // Màu cam cho giá
    fontWeight: "bold",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#6A0DAD", // Màu đỏ giống nút "Mua hàng"
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  noProductsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});
