import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import * as OrderService from "../../../../api/services/OrderService";
import * as UserService from "../../../../api/services/UserService";
import ProductService from "../services/ProductService";
import * as StatusService from "../../../../api/services/StatusService";
import Button from "../../../../components/AdminLayout/Button";
import CustomerSelector from "../partials/CustomerSelector";
import ProductsSection from "../partials/ProductsSection";
import DeliveryInfo from "../partials/DeliveryInfo";

const CreateOrder = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const [formData, setFormData] = useState({
    user: "",
    familyName: "",
    userName: "",
    userEmail: "",
    userPhone: "",
    shippingAddress: "",
    note: "",
    deliveryDate: "",
    deliveryTime: "",
    status: "",
    statusCode: "",
    orderItems: [],
    totalPrice: 0,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found. Please login again.");
      }

      const [usersData, productsData, statusesData] = await Promise.all([
        UserService.getAllUser(accessToken),
        ProductService.getAllProduct(),
        StatusService.getAllStatus(accessToken),
      ]);

      setUsers(usersData.data || []);
      setProducts(productsData.data || []);

      // Filter order statuses
      const orderStatuses = statusesData.data.filter(
        (status) => status.statusType === "Đơn hàng"
      );
      setStatuses(orderStatuses);

      // Set default status to first one (usually "Chờ xác nhận")
      if (orderStatuses.length > 0) {
        setFormData((prev) => ({
          ...prev,
          status: orderStatuses[0]._id,
          statusCode: orderStatuses[0].statusCode,
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error.message || "Không thể tải dữ liệu. Vui lòng thử lại!");
    }
  };

  const handleGuestToggle = (checked) => {
    setIsGuest(checked);
    if (checked) {
      setFormData({
        ...formData,
        user: "",
        familyName: "",
        userName: "",
        userEmail: "",
        userPhone: "",
      });
      setSearchUser("");
    }
  };

  const handleSelectUser = (user) => {
    setFormData({
      ...formData,
      user: user._id,
      familyName: user.familyName || "",
      userName: user.userName,
      userEmail: user.userEmail,
      userPhone: user.userPhone || "",
      shippingAddress: user.userAddress || "",
    });
    setSearchUser(user.userName);
    setShowUserDropdown(false);
  };

  const handleAddProduct = (product) => {
    const existingItem = formData.orderItems.find(
      (item) => item.product === product._id
    );

    if (existingItem) {
      alert("Sản phẩm đã có trong đơn hàng!");
      return;
    }

    const newItem = {
      product: product._id,
      productName: product.productName,
      productPrice: product.productPrice,
      productQuantity: 1,
      productImage: product.productImage,
    };

    const newItems = [...formData.orderItems, newItem];
    setFormData({
      ...formData,
      orderItems: newItems,
      totalPrice: calculateTotal(newItems),
    });
    setSearchProduct("");
    setShowProductDropdown(false);
  };

  const handleUpdateQuantity = (index, quantity) => {
    const newItems = [...formData.orderItems];
    newItems[index].productQuantity = Math.max(1, parseInt(quantity) || 1);
    setFormData({
      ...formData,
      orderItems: newItems,
      totalPrice: calculateTotal(newItems),
    });
  };

  const handleRemoveProduct = (index) => {
    const newItems = formData.orderItems.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      orderItems: newItems,
      totalPrice: calculateTotal(newItems),
    });
  };

  const calculateTotal = (items) => {
    return items.reduce(
      (sum, item) => sum + item.productPrice * item.productQuantity,
      0
    );
  };

  const validateForm = () => {
    if (!isGuest && !formData.user) {
      alert("Vui lòng chọn khách hàng hoặc bật chế độ Khách vãng lai!");
      return false;
    }

    if (isGuest) {
      if (
        !formData.familyName ||
        !formData.userName ||
        !formData.userEmail ||
        !formData.userPhone
      ) {
        alert(
          "Vui lòng nhập đầy đủ thông tin khách hàng (Họ, Tên, Email, SĐT)!"
        );
        return false;
      }
    }

    if (formData.orderItems.length === 0) {
      alert("Vui lòng thêm ít nhất một sản phẩm!");
      return false;
    }

    if (!formData.shippingAddress) {
      alert("Vui lòng nhập địa chỉ giao hàng!");
      return false;
    }

    if (!formData.deliveryDate || !formData.deliveryTime) {
      alert("Vui lòng chọn ngày và giờ giao hàng!");
      return false;
    }

    const deliveryDateTime = new Date(
      `${formData.deliveryDate}T${formData.deliveryTime}`
    );
    if (deliveryDateTime <= new Date()) {
      alert("Ngày và giờ giao hàng phải lớn hơn thời điểm hiện tại!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderData = {
        userId: isGuest ? null : formData.user,
        orderItems: formData.orderItems.map((item) => ({
          product: item.product,
          quantity: item.productQuantity,
          productName: item.productName,
          productPrice: item.productPrice,
          productImage: item.productImage,
          total: item.productPrice * item.productQuantity,
        })),
        shippingAddress: {
          familyName:
            formData.familyName || formData.userName?.split(" ")[0] || "Khách",
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPhone: formData.userPhone,
          userAddress: formData.shippingAddress,
        },
        orderNote: formData.note,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        status: formData.statusCode || "PENDING",
        shippingPrice: 0, // Admin orders have free shipping
        paymentMethod: "COD", // Default payment method
      };

      const response = await OrderService.createOrder(orderData);

      if (response.status === "OK") {
        alert("Tạo đơn hàng thành công!");
        onBack();
      } else {
        throw new Error(response.message || "Không thể tạo đơn hàng");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error.message || "Đã xảy ra lỗi khi tạo đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userName?.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.userEmail?.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.userPhone?.includes(searchUser)
  );

  const filteredProducts = products.filter((product) =>
    product.productName?.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          icon={<ArrowLeft className="w-5 h-5" />}
          className="mb-4"
        >
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Tạo đơn hàng mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Section */}
        <CustomerSelector
          isGuest={isGuest}
          onGuestToggle={handleGuestToggle}
          searchUser={searchUser}
          onSearchChange={(value) => {
            setSearchUser(value);
            setShowUserDropdown(true);
          }}
          showDropdown={showUserDropdown}
          onFocus={() => setShowUserDropdown(true)}
          filteredUsers={filteredUsers}
          onSelectUser={handleSelectUser}
          formData={formData}
          onFormChange={setFormData}
        />

        {/* Products Section */}
        <ProductsSection
          searchProduct={searchProduct}
          onSearchChange={(value) => {
            setSearchProduct(value);
            setShowProductDropdown(true);
          }}
          showDropdown={showProductDropdown}
          onFocus={() => setShowProductDropdown(true)}
          filteredProducts={filteredProducts}
          onAddProduct={handleAddProduct}
          orderItems={formData.orderItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveProduct}
          totalPrice={formData.totalPrice}
        />

        {/* Delivery Info Section */}
        <DeliveryInfo
          formData={formData}
          statuses={statuses}
          onFormChange={setFormData}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onBack} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo đơn hàng"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
