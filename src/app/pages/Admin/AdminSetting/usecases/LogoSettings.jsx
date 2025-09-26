import React, { useState } from "react";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";

const LogoSettings = ({ onBack }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (type, file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Vui lòng chọn file hình ảnh (JPG, PNG, GIF)");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === "logo") {
        setLogoPreview(e.target.result);
      } else {
        setFaviconPreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to upload files
      // const formData = new FormData();
      // if (logoPreview) formData.append('logo', logoFile);
      // if (faviconPreview) formData.append('favicon', faviconFile);
      // await SettingService.uploadLogos(formData);

      console.log("Saving logos:", { logoPreview, faviconPreview });

      // Simulate API call
      setTimeout(() => {
        alert("Logo và favicon đã được cập nhật thành công!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error uploading logos:", error);
      alert("Có lỗi xảy ra khi tải lên!");
      setIsLoading(false);
    }
  };

  const FileUploadArea = ({
    type,
    preview,
    title,
    description,
    dimensions,
    iconSize,
  }) => (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 overflow-hidden">
      <input
        type="file"
        id={`${type}-upload`}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileUpload(type, e.target.files[0])}
      />
      <label htmlFor={`${type}-upload`} className="cursor-pointer block">
        {preview ? (
          <div className="p-8 text-center">
            <div className="relative inline-block mb-6">
              <img
                src={preview}
                alt={`${type} preview`}
                className={`${iconSize} mx-auto object-contain rounded-lg shadow-lg border-4 border-white`}
              />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-gray-900">{title}</h4>
              <p className="text-gray-600">Click để thay đổi hình ảnh</p>
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {dimensions}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center hover:bg-gray-50 transition-colors">
            <div className="mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white mx-auto w-fit shadow-lg">
                {type === "logo" ? (
                  <ImageIcon className="w-16 h-16" />
                ) : (
                  <Upload className="w-12 h-12" />
                )}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-gray-900">{title}</h4>
              <p className="text-gray-600 text-lg">{description}</p>
              <div className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-medium">
                {dimensions}
              </div>
              <p className="text-sm text-gray-500">
                JPG, PNG, GIF • Tối đa 5MB
              </p>
              <div className="mt-4">
                <span className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-block">
                  Chọn file
                </span>
              </div>
            </div>
          </div>
        )}
      </label>
    </div>
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-6 p-3 rounded-xl hover:bg-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="font-medium">Quay lại</span>
          </button>
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white mr-4 shadow-lg">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Logo và Favicon
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Tùy chỉnh hình ảnh đại diện cho cửa hàng
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Logo Upload */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-4"></div>
              Logo cửa hàng
            </h3>
            <FileUploadArea
              type="logo"
              preview={logoPreview}
              title="Tải lên logo"
              description="Logo chính của cửa hàng, hiển thị ở header và các trang quan trọng"
              dimensions="Khuyến nghị: 200x200px"
              iconSize="w-40 h-40"
            />
          </div>

          {/* Favicon Upload */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full mr-4"></div>
              Favicon
            </h3>
            <FileUploadArea
              type="favicon"
              preview={faviconPreview}
              title="Tải lên favicon"
              description="Icon nhỏ hiển thị trên tab trình duyệt và bookmark"
              dimensions="Kích thước: 32x32px"
              iconSize="w-20 h-20"
            />
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Usage Guidelines */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-6">
            <h4 className="font-bold text-blue-900 mb-4 text-xl flex items-center">
              💡 Hướng dẫn sử dụng
            </h4>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start">
                <span className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>
                  Logo sẽ được hiển thị ở header và các trang chính của website
                </span>
              </div>
              <div className="flex items-start">
                <span className="w-3 h-3 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>
                  Favicon sẽ xuất hiện trên tab trình duyệt và bookmark
                </span>
              </div>
              <div className="flex items-start">
                <span className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>
                  Sử dụng hình ảnh có nền trong suốt (PNG) để có kết quả tốt
                  nhất
                </span>
              </div>
              <div className="flex items-start">
                <span className="w-3 h-3 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>
                  Đảm bảo logo rõ nét và dễ nhận diện ở kích thước nhỏ
                </span>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-6">
            <h4 className="font-bold text-green-900 mb-4 text-xl flex items-center">
              📐 Thông số kỹ thuật
            </h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h5 className="font-bold text-green-800 mb-2">
                  Yêu cầu đối với Logo
                </h5>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Kích thước: 200x200px (tối thiểu)</li>
                  <li>• Định dạng: PNG, JPG, GIF</li>
                  <li>• Dung lượng: Tối đa 5MB</li>
                  <li>• Nền trong suốt (khuyến nghị)</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h5 className="font-bold text-green-800 mb-2">
                  Yêu cầu đối với Favicon
                </h5>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Kích thước: 32x32px hoặc 16x16px</li>
                  <li>• Định dạng: PNG, ICO</li>
                  <li>• Design đơn giản, dễ nhận diện</li>
                  <li>• Màu sắc tương phản cao</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={isLoading || (!logoPreview && !faviconPreview)}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Đang tải lên...
              </>
            ) : (
              "🚀 Lưu thay đổi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoSettings;
