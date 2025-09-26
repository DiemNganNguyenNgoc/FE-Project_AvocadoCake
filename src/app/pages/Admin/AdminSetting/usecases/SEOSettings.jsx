import React, { useState } from "react";
import { ArrowLeft, Search, ExternalLink } from "lucide-react";

const SEOSettings = ({ onBack }) => {
  // TODO: Replace with API call to get SEO settings
  const [seoData, setSeoData] = useState({
    metaTitle: "Avocado Cake - Bánh ngọt tươi ngon, giao hàng tận nơi",
    metaDescription:
      "Cửa hàng bánh ngọt Avocado Cake chuyên cung cấp các loại bánh tươi ngon, chất lượng cao với dịch vụ giao hàng tận nơi. Đặt hàng ngay!",
    keywords:
      "bánh ngọt, bánh sinh nhật, bánh cupcake, giao hàng, avocado cake",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setSeoData({ ...seoData, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await SettingService.updateSEOSettings(seoData);
      console.log("Saving SEO settings:", seoData);

      // Simulate API call
      setTimeout(() => {
        alert("Cài đặt SEO đã được lưu thành công!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      alert("Có lỗi xảy ra khi lưu cài đặt!");
      setIsLoading(false);
    }
  };

  // Google Search Result Preview
  const SearchResultPreview = () => (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <h4 className="text-lg font-medium text-gray-900 mb-3">
        Xem trước kết quả tìm kiếm
      </h4>
      <div className="bg-gray-50 p-4 rounded border">
        <div className="text-xs text-gray-500 mb-1">
          https://avocadocake.com
        </div>
        <h3 className="text-lg text-blue-600 hover:underline cursor-pointer mb-1">
          {seoData.metaTitle || "Tiêu đề trang web"}
        </h3>
        <p className="text-sm text-gray-700">
          {seoData.metaDescription || "Mô tả trang web sẽ hiển thị ở đây..."}
        </p>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        * Đây là cách trang web của bạn sẽ xuất hiện trên Google
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
          <div className="flex items-center">
            <Search className="w-6 h-6 text-blue-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt SEO</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SEO Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin SEO
              </h3>

              {/* Meta Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={seoData.metaTitle}
                  onChange={(e) =>
                    handleInputChange("metaTitle", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tiêu đề trang web"
                  maxLength={60}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Nên có 50-60 ký tự để hiển thị tốt nhất</span>
                  <span
                    className={
                      seoData.metaTitle.length > 60 ? "text-red-500" : ""
                    }
                  >
                    {seoData.metaTitle.length}/60
                  </span>
                </div>
              </div>

              {/* Meta Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={seoData.metaDescription}
                  onChange={(e) =>
                    handleInputChange("metaDescription", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả trang web"
                  maxLength={160}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Nên có 150-160 ký tự</span>
                  <span
                    className={
                      seoData.metaDescription.length > 160 ? "text-red-500" : ""
                    }
                  >
                    {seoData.metaDescription.length}/160
                  </span>
                </div>
              </div>

              {/* Keywords */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ khóa (Keywords)
                </label>
                <input
                  type="text"
                  value={seoData.keywords}
                  onChange={(e) =>
                    handleInputChange("keywords", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Phân tách các từ khóa bằng dấu phẩy
                </p>
              </div>
            </div>

            {/* SEO Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Mẹo SEO:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Sử dụng từ khóa chính trong Meta Title</li>
                <li>• Meta Description nên mô tả rõ ràng nội dung trang</li>
                <li>• Tránh lặp từ khóa quá nhiều lần</li>
                <li>• Cập nhật định kỳ để tối ưu hiệu quả</li>
              </ul>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <SearchResultPreview />

            {/* External Tools */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Công cụ hữu ích
              </h3>
              <div className="space-y-3">
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      Google Search Console
                    </div>
                    <div className="text-sm text-gray-600">
                      Theo dõi hiệu suất SEO
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>

                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      Google Analytics
                    </div>
                    <div className="text-sm text-gray-600">
                      Phân tích lưu lượng truy cập
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Đang lưu...
              </>
            ) : (
              "Lưu cài đặt SEO"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEOSettings;
