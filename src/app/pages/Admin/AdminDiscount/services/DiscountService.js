// Import từ service gốc
import {
  createDiscount as createDiscountAPI,
  getDetailsDiscount as getDetailsDiscountAPI,
  getAllDiscount as getAllDiscountAPI,
  updateDiscount as updateDiscountAPI,
  deleteDiscount as deleteDiscountAPI,
} from "../../../../api/services/DiscountService";

import { getAllProduct as getAllProductAPI } from "../../../../api/services/productServices";

// Re-export các function từ API service gốc
export const createDiscount = createDiscountAPI;
export const getDetailsDiscount = getDetailsDiscountAPI;
export const getAllDiscount = getAllDiscountAPI;
export const updateDiscount = updateDiscountAPI;
export const deleteDiscount = deleteDiscountAPI;
export const getAllProducts = getAllProductAPI;
