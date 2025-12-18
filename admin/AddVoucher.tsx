import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BASE_URL } from "../ipconfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type AddVoucherScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Thêm Khuyến Mãi"
>;

type Props = {
  navigation: AddVoucherScreenNavigationProp;
};

const colors = {
  primary: "#1A1A1A",
  accent: "#4A4A4A",
  secondary: "#6B6B6B",
  background: "#F5F5F5",
  text: "#2B2B2B",
  muted: "#8B8B8B",
  white: "#FFFFFF",
  lightBorder: "#D1D1D1",
};

const generateRandomCode = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const AddVoucher: React.FC<Props> = ({ navigation }) => {
  const [discount, setDiscount] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string>("");

  useEffect(() => {
    setVoucherCode(generateRandomCode());
  }, []);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "dismissed" || !selectedDate) {
      return;
    }
    setStartDate(selectedDate);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Chọn ngày bắt đầu";
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const resetForm = () => {
    setDiscount("");
    setStartDate(null);
    setDuration("");
    setQuantity("");
    setVoucherCode(generateRandomCode());
  };

  const validateAndSave = async () => {
    if (!startDate) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày bắt đầu");
      return;
    }
    const durationNum = Number(duration);
    if (!duration.trim() || isNaN(durationNum) || durationNum <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số ngày hiệu lực hợp lệ");
      return;
    }
    const discountNum = Number(discount);
    if (!discount || isNaN(discountNum) || discountNum <= 0 || discountNum > 100) {
      Alert.alert("Lỗi", "Vui lòng nhập phần trăm giảm giá hợp lệ (0-100%)");
      return;
    }
    const quantityNum = Number(quantity);
    if (!quantity.trim() || isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số lượng voucher hợp lệ");
      return;
    }

    const end = new Date(startDate);
    end.setDate(end.getDate() + durationNum);

    const voucherData = {
      discountcode: voucherCode,
      discount: discountNum,
      start: formatDate(startDate),
      end: formatDate(end),
      created_at: new Date().toISOString(),
      quantity: quantityNum,
    };

    try {
      const response = await fetch(`${BASE_URL}/addvouchers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voucherData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi tạo voucher");
      }

      Alert.alert("Thành công", `Đã thêm voucher "${voucherCode}" thành công!`);
      resetForm();
      navigation.replace("Quản Lý Khuyến Mãi");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể thêm voucher");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.label}>Mã voucher (tự tạo)</Text>
        <TextInput
          style={styles.disabledInput}
          value={voucherCode}
          editable={false}
        />

        <Text style={styles.label}>Phần trăm giảm giá (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập phần trăm giảm giá"
          placeholderTextColor={colors.muted}
          value={discount}
          onChangeText={setDiscount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Ngày bắt đầu</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: colors.text }}>{formatDate(startDate)}</Text>
        </TouchableOpacity>

        {/* iOS Picker */}
        {showDatePicker && Platform.OS === "ios" && (
          <View style={{ backgroundColor: colors.white, borderRadius: 10, padding: 10 }}>
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="spinner"
              onChange={onChangeDate}
              minimumDate={new Date()}
              style={{ width: "100%" }}
            />
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: colors.primary,
                padding: 10,
                borderRadius: 6,
                alignItems: "center",
              }}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={{ color: colors.white, fontSize: 16 }}>Xong</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Android Picker */}
        {showDatePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.label}>Thời gian hiệu lực (ngày)</Text>
        <TextInput
















































          style={styles.input}
          placeholder="Nhập số ngày hiệu lực (ví dụ: 30)"
          placeholderTextColor={colors.muted}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Số lượng voucher</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số lượng voucher"
          placeholderTextColor={colors.muted}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={validateAndSave}>
          <Text style={styles.buttonText}>Lưu Voucher</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#E5E5E5",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: 6,
    padding: 10,
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  button: {
    marginTop: 30,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddVoucher;
