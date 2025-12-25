import React from "react";
import { Sparkles, Calendar, Package } from "lucide-react";

/**
 * Component hiển thị message trong chatbot UI
 * Tuân thủ Design System: Gestalt principles + AvocadoCake colors
 */
const ChatMessage = ({ type, content }) => {
  if (type === "user") {
    return (
      <div className="flex justify-end mb-6 animate-fadeIn">
        <div className="max-w-[80%] bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-3xl rounded-tr-lg px-6 py-4 shadow-lg">
          <p className="text-xl font-medium">{content}</p>
        </div>
      </div>
    );
  }

  if (type === "ai-thinking") {
    return (
      <div className="flex justify-start mb-6">
        <div className="max-w-[80%] bg-white border-2 border-gray-200 rounded-3xl rounded-tl-lg px-6 py-4 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              AI đang phân tích...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "ai-summary") {
    return (
      <div className="flex justify-start mb-6 animate-fadeIn">
        <div className="max-w-[90%] bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl rounded-tl-lg px-6 py-5 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Kết quả phân tích AI
              </h4>
              <p className="text-xl text-gray-700 leading-relaxed">
                {content.summary}
              </p>

              {content.metadata && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl px-4 py-3 border border-green-200">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Sự kiện</p>
                        <p className="text-lg font-bold text-gray-900">
                          {content.metadata.totalEvents}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl px-4 py-3 border border-green-200">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Sản phẩm</p>
                        <p className="text-lg font-bold text-gray-900">
                          {content.metadata.suitableProducts}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="flex justify-start mb-6 animate-fadeIn">
        <div className="max-w-[80%] bg-red-50 border-2 border-red-300 rounded-3xl rounded-tl-lg px-6 py-4 shadow-md">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800">
                Đã xảy ra lỗi
              </p>
              <p className="text-sm text-red-700 mt-1">{content}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatMessage;
