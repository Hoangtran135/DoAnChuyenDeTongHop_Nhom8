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
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { BASE_URL } from "../ipconfig";

type AddBannerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Thêm Banner"
>;

export default function AddBanner() {
  const navigation = useNavigation<AddBannerScreenNavigationProp>();
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Bạn cần cho phép truy cập thư viện ảnh"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadBanner = async () => {
    if (!image) {
      Alert.alert("Thông báo", "Vui lòng chọn một ảnh banner");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      const uriParts = image.split("/");
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split(".").pop();

      formData.append("image", {
        uri: image,
        name: fileName,
        type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
      } as any);

      const response = await fetch(`${BASE_URL}/banners`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server trả về lỗi: ${response.status}`);
      }

      Alert.alert("Thành công", "Banner đã được thêm");
      setImage(null);
      navigation.replace("Quản Lý Banner");
    } catch (error) {
      console.error("Lỗi khi thêm banner:", error);
      Alert.alert("Lỗi", "Không thể thêm banner");
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
        style={[
          styles.submitButton,
          uploading && { backgroundColor: "#AAAAAA" },
        ]}
        onPress={uploadBanner}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>Tải lên</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "flex-start", // ✅ sửa chỗ này
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
  submitButton: {
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
  submitText: {
    fontSize: 18,
    color: "#FFFFFF", // White text for readability
    fontWeight: "600",
    textAlign: "center",
  },
});
