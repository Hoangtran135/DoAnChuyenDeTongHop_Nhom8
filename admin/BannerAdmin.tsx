import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { BASE_URL } from "../ipconfig";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import Navbar from "./Navbar";
import Icon from "react-native-vector-icons/MaterialIcons";

type NavigationProp = StackNavigationProp<RootStackParamList, "Quản Lý Banner">;

interface Banner {
  id: string;
  images: string;
  created_at: string;
}

const colors = {
  primary: "#2c3e50",
  accent: "#ff6f61",
  secondary: "#27ae60",
  background: "#f9f9f9",
  text: "#333",
  muted: "#777",
};

export default function BannerAdmin() {
  const navigation = useNavigation<NavigationProp>();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/banners`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data: Banner[] = await response.json();
      setBanners(data);
    } catch (err) {
      setError(
        "Lỗi tải banner: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = (id: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa banner này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setDeletingId(id);
          try {
            const response = await fetch(`${BASE_URL}/banners/${id}`, {
              method: "DELETE",
            });
            if (!response.ok) {
              throw new Error(`Lỗi server: ${response.status}`);
            }
            setBanners((prev) => prev.filter((b) => b.id !== id));
            Alert.alert("Thành công", "Đã xóa banner");
            if (selectedId === id) setSelectedId(null);
          } catch {
            Alert.alert("Lỗi", "Không thể xóa banner");
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  const toggleNavbar = () => setIsNavbarVisible((prev) => !prev);
  const handleOutsidePress = () => setIsNavbarVisible(false);

  const renderBannerItem = ({ item }: { item: Banner }) => {
    const isSelected = selectedId === item.id;

    return (
      <View
        style={[styles.bannerContainer, isSelected && styles.selectedBanner]}
      >
        <TouchableOpacity
          onPress={() => {
            setSelectedId(item.id);
            navigation.navigate("Cập Nhật Banner", { bannerId: item.id });
          }}
        >
          <Image
            source={{
              uri: item.images
                ? `${BASE_URL}/uploads/${item.images}`
                : "https://via.placeholder.com/100",
            }}
            style={[styles.bannerImage, { width: screenWidth - 30 }]}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteBanner(item.id)}
          disabled={deletingId === item.id}
        >
          {deletingId === item.id ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.deleteButtonText}>Xóa Banner</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Đang tải banners...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchBanners} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        {/* Nút mở/đóng Navbar */}
        <TouchableOpacity style={styles.toggleButton} onPress={toggleNavbar}>
          <Icon
            name={isNavbarVisible ? "close" : "menu"}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>

        {isNavbarVisible && <Navbar toggleNavbar={toggleNavbar} />}

        <Text style={styles.title}>Quản Lý Banner</Text>

        {banners.length > 0 ? (
          <FlatList
            data={banners}
            keyExtractor={(item) => item.id}
            renderItem={renderBannerItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 600 }}
            ListFooterComponent={
              <TouchableOpacity
                style={[
                  styles.addButton,
                  { width: screenWidth - 30, marginTop: 10 },
                ]}
                onPress={() => navigation.navigate("Thêm Banner")}
              >
                <Text style={styles.addButtonText}>Thêm Banner</Text>
              </TouchableOpacity>
            }
          />
        ) : (
          <>
            <Text style={styles.noBannerText}>Chưa có banner nào.</Text>
            <TouchableOpacity
              style={[
                styles.addButton,
                { width: screenWidth - 30, marginTop: 10 },
              ]}
              onPress={() => navigation.navigate("Thêm Banner")}
            >
              <Text style={styles.addButtonText}>Thêm Banner</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 15,
    paddingTop: 50, // dành chỗ cho nút toggle và title
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginVertical: 15,
  },
  bannerContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingBottom: 10,
  },
  selectedBanner: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  bannerImage: {
    height: 150,
  },
  addButton: {
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  noBannerText: {
    fontSize: 18,
    color: colors.muted,
    textAlign: "center",
    marginVertical: 20,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: colors.accent,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.muted,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
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
});
