// Main AdminProduct component
export { default as AdminProduct } from "./AdminProduct";

// Store
export { useAdminProductStore } from "./adminProductStore";

// Services
export { default as ProductService } from "./services/ProductService";

// Models
export {
  Product,
  createProduct,
  getDefaultProduct,
  PRODUCT_STATUS,
  PRODUCT_VALIDATION_RULES,
} from "./models/ProductModel";

// Schemas (simplified validation - no external dependencies)
// Note: Form validation is now handled directly in components

// Partials
export { default as Breadcrumb } from "./partials/Breadcrumb";
export { default as SearchBar } from "./partials/SearchBar";
export { default as FilterBar } from "./partials/FilterBar";
export { default as ProductTable } from "./partials/ProductTable";
export { default as ProductCard } from "./partials/ProductCard";
export { default as Pagination } from "./partials/Pagination";
export { default as ViewModeToggle } from "./partials/ViewModeToggle";
export { default as ViewProduct } from "./partials/ViewProduct";

// Usecases
export { default as AddProduct } from "./usecases/AddProduct";
export { default as UpdateProduct } from "./usecases/UpdateProduct";

// Default export
export { default } from "./AdminProduct";
