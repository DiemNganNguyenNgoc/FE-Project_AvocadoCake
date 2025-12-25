import React, { useState } from "react";
import {
  Brain,
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  Info,
  TrendingUp,
  Activity,
} from "lucide-react";
import axios from "axios";

const ModelTraining = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState("");
  const [modelStats, setModelStats] = useState(null);

  const RECSYS_API_URL =
    process.env.REACT_APP_RECSYS_API_URL || "http://localhost:8000";

  // Lấy thông tin model hiện tại
  const fetchModelStats = async () => {
    try {
      const response = await axios.get(`${RECSYS_API_URL}/model/evaluate`);
      setModelStats(response.data);
    } catch (error) {
      console.error("Error fetching model stats:", error);
    }
  };

  // Train model bất đồng bộ
  const handleTrainModel = async () => {
    setIsTraining(true);
    setTrainingStatus(null);
    setMessage("");

    try {
      const response = await axios.post(`${RECSYS_API_URL}/model/update`);
      setTrainingStatus("success");
      setMessage(
        response.data.message || "Model training started successfully"
      );

      // Đợi một chút rồi fetch lại stats
      setTimeout(() => {
        fetchModelStats();
      }, 5000);
    } catch (error) {
      setTrainingStatus("error");
      setMessage(
        error.response?.data?.detail ||
          "Failed to train model. Please try again."
      );
      console.error("Error training model:", error);
    } finally {
      setIsTraining(false);
    }
  };

  // Load stats khi component mount
  React.useEffect(() => {
    fetchModelStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Recommendation Model
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý và cập nhật mô hình gợi ý sản phẩm AI
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">Về chức năng train model:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>
                Huấn luyện lại mô hình AI dựa trên dữ liệu đơn hàng và tương tác
                người dùng mới nhất
              </li>
              <li>Nên train model khi có thêm nhiều đơn hàng mới (2-4 tuần)</li>
              <li>
                Quá trình training diễn ra trong background, không ảnh hưởng đến
                hệ thống
              </li>
              <li>Model mới sẽ tự động áp dụng sau khi training hoàn tất</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Model Stats */}
      {modelStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 font-medium">Precision</span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {(modelStats.precision * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-2">Độ chính xác dự đoán</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 font-medium">Recall</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {(modelStats.recall * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-2">Tỷ lệ phát hiện</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 font-medium">F1 Score</span>
              <Brain className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {(modelStats.f1_score * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-2">Hiệu suất tổng thể</p>
          </div>
        </div>
      )}

      {/* Training Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Cập nhật mô hình AI
        </h2>
        <p className="text-gray-600 mb-6">
          Nhấn nút bên dưới để bắt đầu huấn luyện lại mô hình với dữ liệu mới
          nhất. Quá trình này có thể mất vài phút.
        </p>

        {/* Status Message */}
        {trainingStatus && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
              trainingStatus === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {trainingStatus === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <p
              className={`text-sm font-medium ${
                trainingStatus === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message}
            </p>
          </div>
        )}

        {/* Train Button */}
        <button
          onClick={handleTrainModel}
          disabled={isTraining}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
            isTraining
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          {isTraining ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang huấn luyện model...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Bắt đầu huấn luyện model</span>
            </>
          )}
        </button>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Lưu ý quan trọng:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>
                Đảm bảo hệ thống có đủ dữ liệu đơn hàng trước khi train (tối
                thiểu 50 đơn)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Nên train model vào giờ thấp điểm để tránh ảnh hưởng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>
                Sau khi train xong, kiểm tra metrics để đánh giá hiệu suất
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* History/Logs Section */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          API Endpoint Information
        </h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Base URL:</span>{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">
              {RECSYS_API_URL}
            </code>
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Train Endpoint:</span>{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">
              POST /model/update
            </code>
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Evaluate Endpoint:</span>{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">
              GET /model/evaluate
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;
