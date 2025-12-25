import React from "react";
import ProductSearch from "./ProductSearch";
import OrderItemsList from "./OrderItemsList";

const ProductsSection = ({
  searchProduct,
  onSearchChange,
  showDropdown,
  onFocus,
  filteredProducts,
  onAddProduct,
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>

      <ProductSearch
        searchProduct={searchProduct}
        onSearchChange={onSearchChange}
        showDropdown={showDropdown}
        onFocus={onFocus}
        filteredProducts={filteredProducts}
        onAddProduct={onAddProduct}
      />

      <OrderItemsList
        items={orderItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default ProductsSection;
