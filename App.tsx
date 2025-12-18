import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeIP } from "./ipconfig";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import HomeScreen from "./components/HomeScreen";
import CartScreen from "./components/CartScreen";
import AccountScreen from "./components/AccountScreen";
import OrderManagementScreen from "./components/OrderManagementScreen";
import AddToCartScreen from "./components/AddToCartScreen";
import OrderDetailScreen from "./components/OrderDetailScreen";
import AddOrderScreen from "./components/AddOrderScreen";
import UpdateAccountScreen from "./components/UpdateAccountScreen";
import ProductDetailScreen from "./components/ProductDetailScreen";
import HomeAdminScreen from "./admin/HomeAdminScreen";
import UserManagement from "./admin/UserManagement";
import AdminManagement from "./admin/AdminManagement";
import AddAdminScreen from "./admin/AddAdminScreen";
import UpdateAdminScreen from "./admin/UpdateAdminScreen";
import ProductManagementAdmin from "./admin/ProductManagementAdmin";
import CategoryManagementAdmin from "./admin/CategoryManagementAdmin";
import OrderManagementAdmin from "./admin/OrderManagementAdmin";
import OrderDetailAdmin from "./admin/OrderDetailAdmin";
import TopProductReportAdmin from "./admin/TopProductsReportAdmin";
import RevenueReportAdmin from "./admin/RevenueReportAdmin";
import AddProductAdmin from "./admin/AddProductAdmin";
import UpdateProductAdmin from "./admin/UpdateProductAdmin";
import UpdateCategoryAdmin from "./admin/UpdateCategoryAdmin";
import AddCategoryAdmin from "./admin/AddCategoryAdmin";
import FeedbackScreen from "./components/FeedbackScreen";
import BannerAdmin from "./admin/BannerAdmin";
import UpdateBanner from "./admin/UpdateBanner";
import AddBanner from "./admin/AddBanner";
import VoucherAdmin from "./admin/VoucherAdmin";
import AddVoucher from "./admin/AddVoucher";
import VoucherScreen from "./components/VoucherScreen";
import VoucherSelectionScreen from "./components/VoucherSelectionScreen";
import FavouriteScreen from "./components/FavouriteScreen";
import PolicyScreen from "./components/PolicyScreen";
import ContactScreen from "./components/ContactScreen";
import AboutScreen from "./components/AboutScreen";
import NotLoggedIn from "./settings/NotLoggedIn";
import ChatPage from "./components/ChatPage";
import ChatBox from "./components/ChatBox";
import AdminChatManagement from "./admin/AdminChatManagement";
import ChatBoxAdmin from "./admin/ChatBoxAdmin";
import Start from "./settings/Start";
const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initializeIP();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
        screenOptions={{ headerShown: true, animation: "fade" }}
      >
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Trang Đăng Nhập" component={LoginScreen} />
        <Stack.Screen name="Trang Đăng Ký" component={RegisterScreen} />
        <Stack.Screen name="Trang Chủ" component={HomeScreen} />
        <Stack.Screen name="Giỏ Hàng" component={CartScreen} />
        <Stack.Screen name="Tài Khoản" component={AccountScreen} />
        <Stack.Screen
          name="Quản Lý Đơn Hàng"
          component={OrderManagementScreen}
        />
        <Stack.Screen
          name="Thêm Sản Phẩm Vào Giỏ"
          component={AddToCartScreen}
        />
        <Stack.Screen name="Chi Tiết Đơn Hàng" component={OrderDetailScreen} />
        <Stack.Screen name="Tạo Đơn Hàng" component={AddOrderScreen} />
        <Stack.Screen name="Trang Chủ Admin" component={HomeAdminScreen} />
        <Stack.Screen
          name="Cập Nhật Tài Khoản"
          component={UpdateAccountScreen}
        />
        <Stack.Screen
          name="Chi Tiết Sản Phẩm"
          component={ProductDetailScreen}
        />
        <Stack.Screen name="Quản Lý Admin" component={AdminManagement} />
        <Stack.Screen name="Quản Lý User" component={UserManagement} />
        <Stack.Screen name="Thêm Admin" component={AddAdminScreen} />
        <Stack.Screen name="Cập Nhật Admin" component={UpdateAdminScreen} />
        <Stack.Screen
          name="Quản Lý Sản Phẩm"
          component={ProductManagementAdmin}
        />
        <Stack.Screen
          name="Quản Lý Danh Mục"
          component={CategoryManagementAdmin}
        />
        <Stack.Screen
          name="Quản Lý Đơn Hàng Admin"
          component={OrderManagementAdmin}
        />
        <Stack.Screen
          name="Chi Tiết Đơn Hàng Admin"
          component={OrderDetailAdmin}
        />
        <Stack.Screen name="Báo Cáo Doanh Thu" component={RevenueReportAdmin} />
        <Stack.Screen
          name="Sản Phẩm Bán Chạy"
          component={TopProductReportAdmin}
        />
        <Stack.Screen name="Thêm Sản Phẩm Admin" component={AddProductAdmin} />
        <Stack.Screen name="Cập Nhật Sản Phẩm" component={UpdateProductAdmin} />
        <Stack.Screen
          name="Cập Nhật Danh Mục"
          component={UpdateCategoryAdmin}
        />
        <Stack.Screen name="Thêm Danh Mục" component={AddCategoryAdmin} />
        <Stack.Screen name="Phản Hồi" component={FeedbackScreen} />
        <Stack.Screen name="Khuyến Mãi" component={VoucherScreen} />
        <Stack.Screen name="Thêm Khuyến Mãi" component={AddVoucher} />

        <Stack.Screen
          name="Chọn Khuyến Mãi"
          component={VoucherSelectionScreen}
        />
        <Stack.Screen name="Quản Lý Khuyến Mãi" component={VoucherAdmin} />
        <Stack.Screen name="Quản Lý Banner" component={BannerAdmin} />
        <Stack.Screen name="Cập Nhật Banner" component={UpdateBanner} />
        <Stack.Screen name="Thêm Banner" component={AddBanner} />
        <Stack.Screen name="Chính Sách" component={PolicyScreen} />
        <Stack.Screen name="Yêu Thích" component={FavouriteScreen} />
        <Stack.Screen name="Liên Hệ" component={ContactScreen} />
        <Stack.Screen name="Giới Thiệu" component={AboutScreen} />
        <Stack.Screen name="Chưa Đăng Nhập" component={NotLoggedIn} />
        <Stack.Screen name="Chat Box" component={ChatBox} />
        <Stack.Screen name="Chat Page" component={ChatPage} />
        <Stack.Screen name="Chat Admin" component={AdminChatManagement} />
        <Stack.Screen name="ChatBoxAdmin" component={ChatBoxAdmin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
