import axios from "axios";
import {
    loginUser,
    signupUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    updateUserInfo,
    getAllUser,
    deleteUser,
    getWeeklyNewUsers,
    getPreviousWeekNewUsers,
    fetchCities,
    fetchWards,
    getUserAssets,
    checkUserCoins,
} from "../src/app/api/services/UserService";

jest.mock("axios", () => ({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn().mockReturnThis(),
}));

describe("UserService", () => {
    const access_token = "mock-token";
    const userId = "user-123";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("loginUser", () => {
        it("should return user data on successful login", async () => {
            const mockData = { status: "OK", access_token: "jwt" };
            axios.post.mockResolvedValue({ data: mockData });

            const result = await loginUser({ email: "test@test.com", password: "123" });

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/user/log-in"),
                expect.any(Object),
                expect.any(Object)
            );
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({
                response: { status: 401, data: { message: "Invalid credentials" } },
            });

            await expect(loginUser({})).rejects.toEqual({
                status: 401,
                message: "Invalid credentials",
            });
        });
    });

    describe("signupUser", () => {
        it("should return data on successful signup", async () => {
            const mockData = { status: "OK", message: "Success" };
            axios.post.mockResolvedValue({ data: mockData });

            const result = await signupUser({ email: "new@test.com" });
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "User exists" } } });
            await expect(signupUser({})).rejects.toEqual({ message: "User exists" });
        });
    });

    describe("getDetailsUser", () => {
        it("should return user details", async () => {
            const mockData = { name: "Test User" };
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getDetailsUser(userId, access_token);

            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Not found" } } });
            await expect(getDetailsUser(userId, access_token)).rejects.toEqual({ message: "Not found" });
        });
    });

    describe("refreshToken", () => {
        it("should return new token", async () => {
            const mockData = { access_token: "new-jwt" };
            axios.post.mockResolvedValue({ data: mockData });

            const result = await refreshToken();
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Session expired" } } });
            await expect(refreshToken()).rejects.toEqual({ message: "Session expired" });
        });
    });

    describe("logoutUser", () => {
        it("should call logout endpoint", async () => {
            axios.post.mockResolvedValue({ data: { status: "OK" } });
            await logoutUser();
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/user/log-out"),
                {},
                expect.any(Object)
            );
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Logout failed" } } });
            await expect(logoutUser()).rejects.toEqual({ message: "Logout failed" });
        });
    });

    describe("updateUserInfo", () => {
        it("should call update endpoint", async () => {
            const mockData = { status: "OK" };
            axios.put.mockResolvedValue({ data: mockData });

            const result = await updateUserInfo(userId, { name: "updated" }, access_token);
            expect(result).toEqual(mockData);
        });
    });

    describe("getAllUser", () => {
        it("should return all users", async () => {
            const mockData = [{ id: 1 }];
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getAllUser(access_token);
            expect(result).toEqual(mockData);
        });
    });

    describe("deleteUser", () => {
        it("should call delete endpoint", async () => {
            const mockData = { status: "OK" };
            axios.delete.mockResolvedValue({ data: mockData });

            const result = await deleteUser(userId, access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.delete.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(deleteUser(userId, access_token)).rejects.toEqual({ message: "Error" });
        });

        it("should throw network error on failure", async () => {
            axios.delete.mockRejectedValue(new Error());
            await expect(deleteUser(userId, access_token)).rejects.toEqual({ status: 500, message: "Không thể kết nối đến máy chủ." });
        });
    });

    describe("getWeeklyNewUsers", () => {
        it("should return weekly users", async () => {
            const mockData = { total: 10 };
            axios.get.mockResolvedValue({ data: mockData });
            const result = await getWeeklyNewUsers(access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getWeeklyNewUsers(access_token)).rejects.toEqual({ message: "Error" });
        });

        it("should throw network error on failure", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(getWeeklyNewUsers(access_token)).rejects.toEqual({ status: 500, message: "Không thể kết nối đến máy chủ." });
        });
    });

    describe("getPreviousWeekNewUsers", () => {
        it("should return previous weekly users", async () => {
            const mockData = { total: 5 };
            axios.get.mockResolvedValue({ data: mockData });
            const result = await getPreviousWeekNewUsers(access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getPreviousWeekNewUsers(access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("fetchCities", () => {
        it("should return cities", async () => {
            const mockData = [{ name: "City" }];
            axios.get.mockResolvedValue({ data: mockData });
            const result = await fetchCities();
            expect(result).toEqual(mockData);
        });

        it("should return empty array on failure", async () => {
            axios.get.mockRejectedValue(new Error());
            const result = await fetchCities();
            expect(result).toEqual([]);
        });
    });

    describe("fetchWards", () => {
        it("should return wards", async () => {
            const mockData = { wards: [{ name: "Ward" }] };
            axios.get.mockResolvedValue({ data: mockData });
            const result = await fetchWards(1);
            expect(result).toEqual(mockData.wards);
        });

        it("should return empty array on failure", async () => {
            axios.get.mockRejectedValue(new Error());
            const result = await fetchWards(1);
            expect(result).toEqual([]);
        });
    });

    describe("getUserAssets", () => {
        it("should return assets", async () => {
            const mockData = { coins: 100 };
            axios.get.mockResolvedValue({ data: mockData });
            const result = await getUserAssets(access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw network error", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(getUserAssets(access_token)).rejects.toEqual({ status: 500, message: "Không thể kết nối đến máy chủ." });
        });
    });

    describe("checkUserCoins", () => {
        it("should return coins", async () => {
            const mockData = { status: "OK", coins: 50 };
            axios.get.mockResolvedValue({ data: mockData });
            const result = await checkUserCoins(access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw network error", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(checkUserCoins(access_token)).rejects.toEqual({ status: 500, message: "Không thể kết nối đến máy chủ." });
        });
    });
});
