import axios from "axios";
import {
    forgotPassword,
    verifyOTP,
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
} from "../src/app/api/services/AuthService";

jest.mock("axios", () => ({
    post: jest.fn(),
    create: jest.fn().mockReturnThis(),
}));

describe("AuthService", () => {
    const email = "test@example.com";
    const otp = "123456";
    const newPassword = "newPassword123";
    const token = "google-token";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("forgotPassword", () => {
        it("should call axios.post and return data on success", async () => {
            const mockResponse = { data: { status: "OK", message: "OTP sent" } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await forgotPassword(email);

            expect(axios.post).toHaveBeenCalledWith(
                `${process.env.REACT_APP_API_URL_BACKEND}/auth/forgot-password`,
                { email }
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error message on failure", async () => {
            const mockError = {
                response: {
                    data: { message: "Email not found" },
                },
            };
            axios.post.mockRejectedValue(mockError);

            await expect(forgotPassword(email)).rejects.toEqual({
                message: "Email not found",
            });
        });

        it("should throw default message on generic failure", async () => {
            axios.post.mockRejectedValue(new Error("Network Error"));

            await expect(forgotPassword(email)).rejects.toEqual({
                message: "Không thể kết nối đến máy chủ.",
            });
        });

        it("should throw fallback message if response has no message", async () => {
            axios.post.mockRejectedValue({ response: { data: {} } });
            await expect(forgotPassword(email)).rejects.toEqual({ message: "Đã xảy ra lỗi." });
        });
    });

    describe("verifyOTP", () => {
        it("should call axios.post and return data on success", async () => {
            const mockResponse = { data: { status: "OK", message: "OTP verified" } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await verifyOTP(email, otp);

            expect(axios.post).toHaveBeenCalledWith(
                `${process.env.REACT_APP_API_URL_BACKEND}/auth/verify-otp`,
                { email, otp }
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error message on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Invalid OTP" } } });
            await expect(verifyOTP(email, otp)).rejects.toEqual({ message: "Invalid OTP" });
        });

        it("should throw default message on network failure", async () => {
            axios.post.mockRejectedValue(new Error());
            await expect(verifyOTP(email, otp)).rejects.toEqual({ message: "Không thể kết nối đến máy chủ." });
        });

        it("should throw fallback message if response has no message", async () => {
            axios.post.mockRejectedValue({ response: { data: {} } });
            await expect(verifyOTP(email, otp)).rejects.toEqual({ message: "Đã xảy ra lỗi." });
        });
    });

    describe("resetPassword", () => {
        it("should call axios.post and return data on success", async () => {
            const mockResponse = { data: { status: "OK", message: "Password reset" } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await resetPassword(email, newPassword);

            expect(axios.post).toHaveBeenCalledWith(
                `${process.env.REACT_APP_API_URL_BACKEND}/auth/reset-password`,
                { email, newPassword }
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error message on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Short password" } } });
            await expect(resetPassword(email, newPassword)).rejects.toEqual({ message: "Short password" });
        });

        it("should throw default message on network failure", async () => {
            axios.post.mockRejectedValue(new Error());
            await expect(resetPassword(email, newPassword)).rejects.toEqual({ message: "Không thể kết nối đến máy chủ." });
        });

        it("should throw fallback message if response has no message", async () => {
            axios.post.mockRejectedValue({ response: { data: {} } });
            await expect(resetPassword(email, newPassword)).rejects.toEqual({ message: "Đã xảy ra lỗi." });
        });
    });

    describe("loginWithGoogle", () => {
        it("should call axios.post and return data on success", async () => {
            const mockResponse = { data: { status: "OK", access_token: "jwt" } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await loginWithGoogle(token);

            expect(axios.post).toHaveBeenCalledWith(
                `${process.env.REACT_APP_API_URL_BACKEND}/auth/login/google`,
                { token }
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error message on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Google auth failed" } } });
            await expect(loginWithGoogle(token)).rejects.toEqual({ message: "Google auth failed" });
        });

        it("should throw default message on network failure", async () => {
            axios.post.mockRejectedValue(new Error());
            await expect(loginWithGoogle(token)).rejects.toEqual({ message: "Không thể kết nối đến máy chủ." });
        });

        it("should throw fallback message if response has no message", async () => {
            axios.post.mockRejectedValue({ response: { data: {} } });
            await expect(loginWithGoogle(token)).rejects.toEqual({ message: "Đã xảy ra lỗi." });
        });
    });

    describe("loginWithFacebook", () => {
        it("should call axios.post and return data on success", async () => {
            const mockResponse = { data: { status: "OK", access_token: "jwt" } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await loginWithFacebook(token);

            expect(axios.post).toHaveBeenCalledWith(
                `${process.env.REACT_APP_API_URL_BACKEND}/auth/login/facebook`,
                { token }
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error message on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Facebook auth failed" } } });
            await expect(loginWithFacebook(token)).rejects.toEqual({ message: "Facebook auth failed" });
        });

        it("should throw default message on network failure", async () => {
            axios.post.mockRejectedValue(new Error());
            await expect(loginWithFacebook(token)).rejects.toEqual({ message: "Không thể kết nối đến máy chủ." });
        });

        it("should throw fallback message if response has no message", async () => {
            axios.post.mockRejectedValue({ response: { data: {} } });
            await expect(loginWithFacebook(token)).rejects.toEqual({ message: "Đã xảy ra lỗi." });
        });
    });
});
