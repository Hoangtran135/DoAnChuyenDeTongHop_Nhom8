import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BASE_URL } from "../ipconfig";
import { RootStackParamList } from "../types";

type UpdateBannerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Cập Nhật Banner"
>;
type UpdateBannerRouteProp = RouteProp<RootStackParamList, "Cập Nhật Banner">;

export default function UpdateBanner() {
  const navigation = useNavigation<UpdateBannerNavigationProp>();
  const route = useRoute<UpdateBannerRouteProp>();
  const { bannerId } = route.params;

  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Bạn cần cấp quyền truy cập ảnh để chọn ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [16, 9],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadBanner = async () => {
    if (!image) {
      Alert.alert("Vui lòng chọn ảnh trước khi tải lên");
      return;
    }
    if (!bannerId) {
      Alert.alert("Không xác định được banner cần cập nhật");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      const uriParts = image.split("/");
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split(".").pop()?.toLowerCase() || "jpg";

      formData.append("image", {
        uri: image,
        name: fileName,
        type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
      } as any);

      const res = await fetch(`${BASE_URL}/updatebanners/${bannerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Upload thất bại");
      }

      Alert.alert("Thành công", "Banner đã được cập nhật");
      setImage(null);
      navigation.replace("Quản Lý Banner");
    } catch (error) {
      Alert.alert("Lỗi", (error as Error).message || "Có lỗi xảy ra");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Chọn ảnh banner</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, uploading && { backgroundColor: "#AAAAAA" }]}
        onPress={uploadBanner}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Tải lên</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light gray for a neutral, clean background
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center", // Center all children horizontally
    justifyContent: "flex-start", // Distribute content evenly vertically
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C2526", // Deep charcoal for contrast
    textAlign: "center",
    marginBottom: 20,
    width: "100%", // Ensure title spans container for consistent alignment
  },
  imagePicker: {
    width: "100%", // Full width for consistency
    maxWidth: 400, // Cap width for larger screens
    height: 200,
    backgroundColor: "#E0E0E0", // Light gray placeholder
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#333333", // Dark gray border
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    fontSize: 18,
    color: "#666666", // Medium gray for placeholder
    textAlign: "center",
    padding: 10,
  },
  button: {
    backgroundColor: "#1C2526", // Dark charcoal button
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Full width for consistency
    maxWidth: 400, // Cap width for larger screens
    borderWidth: 1,
    borderColor: "#FFFFFF", // White border for contrast
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF", // White text for readability
    fontWeight: "600",
    textAlign: "center",
  },
});
