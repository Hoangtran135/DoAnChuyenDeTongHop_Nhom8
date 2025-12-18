import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BASE_URL } from "../ipconfig";

const colors = {
  primary: "#6A0DAD",
  accent: "#ff6f61",
  background: "#f9f9f9",
  text: "#333",
  muted: "#777",
  starActive: "#f1c40f",
  starInactive: "#ccc",
};

interface FeedbackScreenProps {
  navigation: any;
  route: {
    params: {
      orderId: number;
      userId: number;
    };
  };
}

export default function FeedbackScreen({
  navigation,
  route,
}: FeedbackScreenProps) {
  const { orderId, userId } = route.params;

  // Log để kiểm tra dữ liệu đầu vào
  console.log("orderId:", orderId);
  console.log("userId:", userId);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  const stars = [1, 2, 3, 4, 5];

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền bị từ chối",
        "Bạn cần cấp quyền truy cập thư viện ảnh."
      );
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.7,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
    }
  };

  const submitFeedback = async () => {
    if (rating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao đánh giá");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("orderId", orderId.toString());
    formData.append("userId", userId.toString());
    formData.append("star", rating.toString());
    formData.append("feedback", comment);

    if (image) {
      const filename = image.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("image", {
        uri: image,
        name: filename,
        type,
      } as any);
    }

    try {
      const response = await axios.post(`${BASE_URL}/feedbacks`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Thành công", "Cảm ơn bạn đã gửi phản hồi!");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi:", error);
      Alert.alert("Lỗi", "Gửi phản hồi thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const renderStar = (starNumber: number) => (
    <TouchableOpacity key={starNumber} onPress={() => setRating(starNumber)}>
      <Text
        style={[
          styles.star,
          {
            color:
              starNumber <= rating ? colors.starActive : colors.starInactive,
          },
        ]}
      >
        ★
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Phản hồi đơn hàng #{orderId}</Text>

      <View style={styles.starContainer}>{stars.map(renderStar)}</View>

      <TextInput
        style={styles.input}
        placeholder="Viết phản hồi của bạn ở đây..."
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
        editable={!loading}
      />

      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={pickImage}
          disabled={loading}
        >
          <Text style={styles.imagePickerButtonText}>Chọn ảnh</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.thumbnail} />}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.accent}
          style={{ marginTop: 20 }}
        />
      ) : (
        <TouchableOpacity style={styles.button} onPress={submitFeedback}>
          <Text style={styles.buttonText}>Gửi phản hồi</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  star: {
    fontSize: 40,
    marginHorizontal: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    marginTop: 30,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  imagePickerButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  imagePickerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
});
