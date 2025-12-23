import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../ipconfig";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

interface Category {
  id: number;
  name: string;
}

export default function AddProductAdmin({ navigation }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/listcategories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        Alert.alert("Lỗi", "Không thể tải danh mục");
      }
    };

    fetchCategories();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Cần quyền", "Bạn cần cấp quyền truy cập ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !price || selectedCategoryId === null) {
      Alert.alert("Lỗi", "Vui lòng nhập tên, giá và chọn danh mục");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("category_id", selectedCategoryId.toString());

      if (imageUri) {
        const fileName = imageUri.split("/").pop() || "image.jpg";
        const fileType = fileName.split(".").pop() || "jpg";

        formData.append("image", {
          uri: imageUri,
          name: fileName,
          type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
        } as any);
      }

      const response = await axios.post(`${BASE_URL}/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Thành công", "Sản phẩm đã được thêm");
      navigation.replace("Quản Lý Sản Phẩm");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      Alert.alert("Lỗi", "Không thể thêm sản phẩm");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tên sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên sản phẩm"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Nhập mô tả sản phẩm"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Giá</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Danh mục</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategoryId}
          onValueChange={(itemValue) =>
            setSelectedCategoryId(itemValue !== 0 ? Number(itemValue) : null)
          }
        >
          <Picker.Item label="-- Chọn danh mục --" value={0} />
          {categories.map((category) => (
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.id}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Chọn ảnh sản phẩm</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!name || !price || selectedCategoryId === null || uploading) &&
            styles.disabled,
        ]}
        onPress={handleAddProduct}
        disabled={!name || !price || selectedCategoryId === null || uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Thêm sản phẩm</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 30,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  imagePicker: {
    height: 200,
    backgroundColor: "#eee",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#aaa",
    borderWidth: 2,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    fontSize: 16,
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#1C2526",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  disabled: {
    backgroundColor: "#aaa",
  },
  submitText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
