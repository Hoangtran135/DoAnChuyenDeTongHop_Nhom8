import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../ipconfig";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const UpdateProductAdmin = ({ route, navigation }: { route: any; navigation: any }) => {
  const { productId } = route.params;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  // Lấy thông tin sản phẩm hiện tại
  useEffect(() => {
    axios
      .get(`${BASE_URL}/products/${productId}`)
      .then((res) => {
        const product = res.data;
        setName(product.name);
        setPrice(product.price.toString());
        setDescription(product.description);
        setCategoryId(product.category_id.toString()); // Đảm bảo dạng string
        setImageUri(product.image);
      })
      .catch((err) => console.log("Lỗi khi lấy sản phẩm:", err));
  }, [productId]);

  // Lấy danh sách danh mục
  useEffect(() => {
    axios
      .get(`${BASE_URL}/categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log("Lỗi khi lấy danh mục:", err);
        Alert.alert("Lỗi", "Không thể tải danh mục sản phẩm.");
      });
  }, []);

  const handleChooseImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Lỗi", "Cần cấp quyền truy cập ảnh!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const handleUpdateProduct = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category_id", categoryId);

    if (imageUri) {
      const fileName = imageUri.split("/").pop();
      const ext = /\.(\w+)$/.exec(fileName || "")?.[1] || "jpg";
      const type = `image/${ext}`;
      formData.append("image", {
        uri: imageUri,
        type,
        name: fileName,
      } as any);
    }

    try {
      await axios.put(`${BASE_URL}/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Thành công", "Sản phẩm đã được cập nhật.");
      navigation.replace("Quản Lý Sản Phẩm");
    } catch (err) {
      Alert.alert("Lỗi", "Không thể cập nhật sản phẩm. Vui lòng thử lại sau.");
      console.log("Lỗi khi cập nhật sản phẩm:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tên sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên sản phẩm"
        placeholderTextColor="#b0b0b0"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Giá</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá sản phẩm"
        placeholderTextColor="#b0b0b0"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Nhập mô tả sản phẩm"
        placeholderTextColor="#b0b0b0"
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>Danh mục</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoryId}
          onValueChange={(itemValue) => setCategoryId(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Chọn danh mục" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Ảnh sản phẩm</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={handleChooseImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Chọn ảnh mới</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.updateButton,
          (!name || !price || !categoryId) && styles.buttonDisabled,
        ]}
        onPress={handleUpdateProduct}
        disabled={!name || !price || !categoryId}
      >
        <Text style={styles.updateButtonText}>Cập nhật sản phẩm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingVertical: 40,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 18,
    marginBottom: 10,
  },
  input: {
    height: 64,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 24,
    fontSize: 18,
    color: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  descriptionInput: {
    height: 140,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontSize: 18,
    color: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  picker: {
    height: 200,
    color: "#1a1a1a",
  },
  imagePicker: {
    height: 220,
    backgroundColor: "#eee",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#aaa",
    borderWidth: 2,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 18,
    color: "#999",
  },
  updateButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#b0b0b0",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  updateButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.6,
  },
});

export default UpdateProductAdmin;
