import axios from "axios";
import {
    getAllCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getDetaillsCategory,
} from "../src/app/api/services/CategoryService";

jest.mock("axios", () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn().mockReturnThis(),
}));

describe("CategoryService", () => {
    const access_token = "mock-token";
    const categoryId = "cat-123";

    const mockCategories = [
        { id: "1", categoryCode: "C01", categoryName: "Cakes", isActive: true },
        { id: "2", categoryCode: "C02", categoryName: "Breads", isActive: false },
        { id: "3", categoryCode: "C03", categoryName: "Cookies", isActive: true }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllCategory", () => {
        it("should return all categories on success", async () => {
            axios.get.mockResolvedValue({ data: mockCategories });

            const result = await getAllCategory();

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("/category/get-all-category")
            );
            expect(result).toEqual(mockCategories);
        });

        it("should throw default message on network failure", async () => {
            axios.get.mockRejectedValue(new Error("Network Error"));

            await expect(getAllCategory()).rejects.toEqual({
                status: 500,
                message: "Không thể kết nối đến máy chủ.",
            });
        });

        it("should throw fallback error message on failure if message is missing", async () => {
            axios.get.mockRejectedValue({
                response: { data: {} },
            });

            await expect(getAllCategory()).rejects.toEqual({
                message: "Đã xảy ra lỗi khi lấy danh mục.",
            });
        });
    });

    describe("createCategory", () => {
        it("should call axios.post with transformed data for Active status", async () => {
            const inputData = { categoryCode: "C01", categoryName: "Birthday", status: "Active" };
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await createCategory(inputData, access_token);

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/category/create-category"),
                {
                    categoryCode: "C01",
                    categoryName: "Birthday",
                    isActive: true,
                },
                expect.objectContaining({
                    headers: expect.objectContaining({
                        token: `Bearer ${access_token}`,
                    }),
                })
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should call axios.post with transformed data for Inactive status", async () => {
            const inputData = { categoryCode: "C01", categoryName: "Birthday", status: "Inactive" };
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);

            await createCategory(inputData, access_token);

            expect(axios.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ isActive: false }),
                expect.any(Object)
            );
        });

        it("should throw default message on connection failure", async () => {
            axios.post.mockRejectedValue(new Error("Connect Error"));
            await expect(createCategory({}, access_token)).rejects.toEqual({
                status: 500,
                message: "Không thể kết nối đến máy chủ."
            });
        });

        it("should throw fallback message if response has no message", async () => {
            axios.post.mockRejectedValue({ response: { data: {} } });
            await expect(createCategory({}, access_token)).rejects.toEqual({ message: "Đã xảy ra lỗi." });
        });
    });

    describe("getDetaillsCategory", () => {
        it("should return category details", async () => {
            const mockData = mockCategories[0];
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getDetaillsCategory(categoryId, access_token);

            expect(result).toEqual(mockData);
        });

        it("should throw network error on connection failure", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(getDetaillsCategory(categoryId, access_token)).rejects.toEqual({
                Discount: 500,
                message: "Không thể kết nối đến máy chủ."
            });
        });

        it("should throw fallback message on response error", async () => {
            axios.get.mockRejectedValue({ response: { data: {} } });
            await expect(getDetaillsCategory(categoryId, access_token)).rejects.toEqual({
                message: "Đã xảy ra lỗi."
            });
        });
    });

    describe("updateCategory", () => {
        it("should call axios.put with transformed data", async () => {
            const inputData = { categoryCode: "C02", categoryName: "Mini", status: "Inactive" };
            const mockResponse = { data: { success: true } };
            axios.put.mockResolvedValue(mockResponse);

            const result = await updateCategory(categoryId, access_token, inputData);

            expect(axios.put).toHaveBeenCalledWith(
                expect.stringContaining(`/category/update-category/${categoryId}`),
                {
                    categoryCode: "C02",
                    categoryName: "Mini",
                    isActive: false,
                },
                expect.any(Object)
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw network error on connection failure", async () => {
            axios.put.mockRejectedValue(new Error());
            await expect(updateCategory(categoryId, access_token, {})).rejects.toEqual({
                status: 500,
                message: "Không thể kết nối đến máy chủ."
            });
        });
    });

    describe("deleteCategory", () => {
        it("should call axios.delete", async () => {
            const mockResponse = { data: { success: true } };
            axios.delete.mockResolvedValue(mockResponse);

            const result = await deleteCategory(categoryId, access_token);

            expect(axios.delete).toHaveBeenCalledWith(
                expect.stringContaining(`/category/delete-category/${categoryId}`),
                expect.any(Object)
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw network error on connection failure", async () => {
            axios.delete.mockRejectedValue(new Error());
            await expect(deleteCategory(categoryId, access_token)).rejects.toEqual({
                message: "Không thể kết nối đến máy chủ."
            });
        });
    });
});
