import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BASE_URL } from "../ipconfig";

const colors = {
  primary: "#1C2526", // màu đen than
  background: "#FFFFFF",
  border: "#E0E0E0",
  muted: "#666666",
  card: "#F5F5F5",
  white: "#FFFFFF",
};

const commonShadow = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: colors.background,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 20,
    borderRadius: 12,
    fontSize: 16,
    color: colors.primary,
    backgroundColor: colors.card,
    ...commonShadow,
  },

  // Chỉnh lại style cho nút chọn ảnh giống AddBanner
  imagePicker: {
    width: "100%",
    height: 200,
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
    ...commonShadow,
  },
  imagePickerText: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
    padding: 10,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.white,
    ...commonShadow,
  },
  submitText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: "600",
    textAlign: "center",
  },
});

interface UpdateCategoryAdminProps {
  route: any;
  navigation: any;
}

const UpdateCategoryAdmin = ({
  route,
  navigation,
}: UpdateCategoryAdminProps) => {
  const { categoryId } = route.params;
  const [name, setName] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/categories/${categoryId}`)
      .then((res) => {
        setName(res.data.name);
        setOldImage(res.data.image);
      })
      .catch((err) => console.log("Lỗi khi lấy danh mục:", err));
  }, [categoryId]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Cần quyền",
        "Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // cho phép chỉnh sửa giống AddBanner
      aspect: [16, 9], // tỉ lệ 16:9 giống AddBanner
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setNewImage(result.assets[0].uri);
    }
  };

  const handleUpdateCategory = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên danh mục không được để trống");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("name", name.trim());

    if (newImage) {
      formData.append("image", {
        uri: newImage,
        name: "updated_category.jpg",
        type: "image/jpeg",
      } as any);
    }

    try {
      await axios.put(`${BASE_URL}/categories/${categoryId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Thành công", "Cập nhật danh mục thành công");
      navigation.replace("Quản Lý Danh Mục");
    } catch (err) {
      console.log(err);
      Alert.alert("Lỗi", "Không thể cập nhật danh mục");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tên danh mục"
        placeholderTextColor={colors.muted}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={styles.imagePicker}
        onPress={pickImage}
        disabled={uploading}
        activeOpacity={0.7}
      >
        {newImage ? (
          <Image source={{ uri: newImage }} style={styles.previewImage} />
        ) : oldImage ? (
          <Image
            source={{ uri: `${BASE_URL}/uploads/${oldImage}` }}
            style={styles.previewImage}
          />
        ) : (
          <Text style={styles.imagePickerText}>Chọn ảnh mới</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.submitButton,
          uploading && { backgroundColor: "#AAAAAA", borderColor: "#888888" },
        ]}
        onPress={handleUpdateCategory}
        disabled={uploading}
        activeOpacity={0.7}
      >
        {uploading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>Cập nhật danh mục</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UpdateCategoryAdmin;
