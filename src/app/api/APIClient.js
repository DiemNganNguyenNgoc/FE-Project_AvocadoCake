import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:3001";

const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Credentials": true,
};

const getAuthorizationHeader = () => {
  // Lấy mã JWT từ localStorage
  const jwtToken = localStorage.getItem("access_token");
  return jwtToken ? { token: `Bearer ${jwtToken}` } : {};
};

// Hàm refresh token
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_URL}/api/user/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    if (data?.access_token) {
      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    }
    throw new Error("No access token in response");
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Xóa token và chuyển về trang đăng nhập
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
    throw error;
  }
};

// Hàm kiểm tra và refresh token nếu cần
const ensureValidToken = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Nếu token sắp hết hạn trong vòng 1 phút, refresh ngay
    if (decoded.exp - currentTime < 60) {
      console.log("Token sắp hết hạn, đang refresh...");
      return await refreshAccessToken();
    }

    return token;
  } catch (error) {
    console.error("Invalid token:", error);
    return await refreshAccessToken();
  }
};

// Hàm xử lý request với retry logic
const makeRequest = async (url, options, retryCount = 0) => {
  try {
    const response = await fetch(url, options);

    // Nếu nhận 401 và chưa retry, thử refresh token
    if (response.status === 401 && retryCount === 0) {
      console.log("Received 401, attempting to refresh token...");
      const newToken = await refreshAccessToken();

      // Retry request với token mới
      options.headers.token = `Bearer ${newToken}`;
      return await makeRequest(url, options, retryCount + 1);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

const api = {
  get: async (endpoint) => {
    try {
      // Đảm bảo token còn hiệu lực
      await ensureValidToken();

      const response = await makeRequest(`${API_URL}${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...defaultHeaders,
          ...getAuthorizationHeader(),
        },
      });

      const dataRes = await response.json();
      return { status: response.status, data: dataRes };
    } catch (error) {
      console.error("GET request error:", error);
      return { status: 500, data: null, error: error.message };
    }
  },

  post: async (endpoint, data) => {
    try {
      // Đảm bảo token còn hiệu lực
      await ensureValidToken();

      const response = await makeRequest(`${API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...defaultHeaders,
          ...getAuthorizationHeader(),
        },
        body: JSON.stringify(data),
      });

      const dataRes = await response.json();
      return { status: response.status, data: dataRes };
    } catch (error) {
      console.error("POST request error:", error);
      return { status: 500, data: null, error: error.message };
    }
  },

  put: async (endpoint, data) => {
    try {
      // Đảm bảo token còn hiệu lực
      await ensureValidToken();

      const response = await makeRequest(`${API_URL}${endpoint}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          ...defaultHeaders,
          ...getAuthorizationHeader(),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return { status: response.status };
      }

      const dataRes = await response.json();
      return { status: response.status, data: dataRes };
    } catch (error) {
      console.error("PUT request error:", error);
      return { status: 500, data: null, error: error.message };
    }
  },

  delete: async (endpoint) => {
    try {
      // Đảm bảo token còn hiệu lực
      await ensureValidToken();

      const response = await makeRequest(`${API_URL}${endpoint}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          ...defaultHeaders,
          ...getAuthorizationHeader(),
        },
      });

      const dataRes = await response.json();
      return { status: response.status, data: dataRes };
    } catch (error) {
      console.error("DELETE request error:", error);
      return { status: 500, data: null, error: error.message };
    }
  },
};

export default api;
