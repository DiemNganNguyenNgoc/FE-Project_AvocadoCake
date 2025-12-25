import * as yup from "yup";

export const rankSchema = yup.object().shape({
  rankName: yup
    .string()
    .required("Tên rank là bắt buộc")
    .oneOf(
      ["Bronze", "Silver", "Gold"],
      "Rank phải là Bronze, Silver hoặc Gold"
    ),

  rankDisplayName: yup
    .string()
    .required("Tên hiển thị là bắt buộc")
    .min(2, "Tên hiển thị phải có ít nhất 2 ký tự"),

  rankCode: yup
    .string()
    .required("Mã rank là bắt buộc")
    .matches(/^RANK_[A-Z]+$/, "Mã rank phải có dạng RANK_XXX"),

  discountPercent: yup
    .number()
    .required("Phần trăm giảm giá là bắt buộc")
    .min(0, "Giảm giá phải lớn hơn hoặc bằng 0")
    .max(100, "Giảm giá phải nhỏ hơn hoặc bằng 100"),

  minSpending: yup
    .number()
    .required("Hạn mức tối thiểu là bắt buộc")
    .min(0, "Hạn mức tối thiểu phải lớn hơn hoặc bằng 0"),

  maxSpending: yup
    .number()
    .nullable()
    .min(0, "Hạn mức tối đa phải lớn hơn hoặc bằng 0")
    .test(
      "max-greater-than-min",
      "Hạn mức tối đa phải lớn hơn hạn mức tối thiểu",
      function (value) {
        const { minSpending } = this.parent;
        if (value === null || value === undefined) return true;
        return value > minSpending;
      }
    ),

  priority: yup
    .number()
    .required("Thứ tự ưu tiên là bắt buộc")
    .min(1, "Thứ tự ưu tiên phải lớn hơn hoặc bằng 1")
    .integer("Thứ tự ưu tiên phải là số nguyên"),

  color: yup
    .string()
    .required("Màu sắc là bắt buộc")
    .matches(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Màu sắc phải là mã hex hợp lệ"
    ),

  icon: yup.string().required("Icon là bắt buộc"),

  benefits: yup
    .array()
    .of(yup.string().min(5, "Mỗi đặc quyền phải có ít nhất 5 ký tự"))
    .min(1, "Phải có ít nhất 1 đặc quyền"),

  description: yup.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),

  isActive: yup.boolean().required("Trạng thái là bắt buộc"),
});
