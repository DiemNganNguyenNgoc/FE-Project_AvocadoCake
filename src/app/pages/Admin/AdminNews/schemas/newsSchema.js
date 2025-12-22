export const validateNews = (newsData) => {
  const errors = {};

  // Validate newsTitle
  if (!newsData.newsTitle || newsData.newsTitle.trim() === "") {
    errors.newsTitle = "Tiêu đề tin không được để trống";
  } else if (newsData.newsTitle.length < 10) {
    errors.newsTitle = "Tiêu đề tin phải có ít nhất 10 ký tự";
  } else if (newsData.newsTitle.length > 200) {
    errors.newsTitle = "Tiêu đề tin không được vượt quá 200 ký tự";
  }

  // Validate newsContent
  if (!newsData.newsContent || newsData.newsContent.trim() === "") {
    errors.newsContent = "Nội dung tin không được để trống";
  } else if (newsData.newsContent.length < 50) {
    errors.newsContent = "Nội dung tin phải có ít nhất 50 ký tự";
  } else if (newsData.newsContent.length > 5000) {
    errors.newsContent = "Nội dung tin không được vượt quá 5000 ký tự";
  }

  // Validate newsImage (for create)
  if (newsData.isCreating && !newsData.newsImage) {
    errors.newsImage = "Vui lòng chọn ảnh tin tức";
  }

  // Validate status
  const validStatuses = ["Active", "Inactive", "Draft"];
  if (newsData.status && !validStatuses.includes(newsData.status)) {
    errors.status = "Trạng thái không hợp lệ";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const newsSchema = {
  newsTitle: {
    type: "string",
    required: true,
    minLength: 10,
    maxLength: 200,
  },
  newsContent: {
    type: "string",
    required: true,
    minLength: 50,
    maxLength: 5000,
  },
  newsImage: {
    type: "file",
    required: true,
    acceptedFormats: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
  },
  status: {
    type: "string",
    enum: ["Active", "Inactive", "Draft"],
    default: "Active",
  },
};
