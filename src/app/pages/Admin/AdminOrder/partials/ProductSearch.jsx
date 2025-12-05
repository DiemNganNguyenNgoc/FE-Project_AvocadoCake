import React from "react";
import { Search } from "lucide-react";
import Input from "../../../../components/AdminLayout/Input";

const ProductSearch = ({
  searchProduct,
  onSearchChange,
  showDropdown,
  onFocus,
  filteredProducts,
  onAddProduct,
}) => {
  return (
    <div className="relative mb-4">
      <Input
        label="Thêm sản phẩm *"
        placeholder="Tìm kiếm sản phẩm..."
        value={searchProduct}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onFocus}
        leftIcon={<Search className="w-5 h-5" />}
      />

      {showDropdown && filteredProducts.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => onAddProduct(product)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center gap-3"
            >
              <img
                src={product.productImage}
                alt={product.productName}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-medium">{product.productName}</div>
                <div className="text-sm text-gray-600">
                  {product.productPrice.toLocaleString("vi-VN")}đ
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
