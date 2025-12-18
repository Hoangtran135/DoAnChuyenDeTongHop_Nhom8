import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BASE_URL } from "../ipconfig";

const colors = {
  primary: "#000000",
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
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: colors.background,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    fontSize: 16,
    color: colors.primary,
    backgroundColor: colors.card,
    ...commonShadow,
  },
  imagePicker: {
    height: 200,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    ...commonShadow,
    overflow: "hidden",
  },
  imagePickerText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    ...commonShadow,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});

interface AddCategoryAdminProps {
  navigation: any;
}

const AddCategoryAdmin = ({ navigation }: AddCategoryAdminProps) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<any>(null);

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
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleAddCategory = async () => {
    if (!name.trim() || !image) {
      Alert.alert("Thông báo", "Vui lòng nhập tên và chọn ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("image", {
      uri: image.uri,
      name: "category.jpg",
      type: "image/jpeg",
    } as any);

    try {
      await axios.post(`${BASE_URL}/categories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Thành công", "Đã thêm danh mục mới.");
      navigation.replace("Quản Lý Danh Mục");
    } catch (error) {
      Alert.alert("Lỗi", "Danh Mục Đã Tồn Tại.");
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
        activeOpacity={0.7}
      >
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.imagePickerText}>Chọn ảnh</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
        <Text style={styles.buttonText}>Thêm danh mục</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddCategoryAdmin;
