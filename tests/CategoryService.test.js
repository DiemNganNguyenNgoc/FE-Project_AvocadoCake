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

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllCategory", () => {
        it("should return all categories on success", async () => {
            const mockData = [{ id: 1, categoryName: "Cakes" }];
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getAllCategory();

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("/category/get-all-category")
            );
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({
                response: { data: { message: "Fetch error" } },
            });

            await expect(getAllCategory()).rejects.toEqual({
                message: "Fetch error",
            });
        });
    });

    describe("createCategory", () => {
        it("should call axios.post with transformed data", async () => {
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

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Failed" } } });
            await expect(createCategory({}, access_token)).rejects.toEqual({ message: "Failed" });
        });
    });

    describe("getDetaillsCategory", () => {
        it("should return category details", async () => {
            const mockData = { id: categoryId, name: "Birthday" };
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getDetaillsCategory(categoryId, access_token);

            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Not found" } } });
            await expect(getDetaillsCategory(categoryId, access_token)).rejects.toEqual({ message: "Not found" });
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

        it("should throw error on failure", async () => {
            axios.put.mockRejectedValue({ response: { data: { message: "Update failed" } } });
            await expect(updateCategory(categoryId, access_token, {})).rejects.toEqual({ message: "Update failed" });
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

        it("should throw error on failure", async () => {
            axios.delete.mockRejectedValue({ response: { data: { message: "Delete failed" } } });
            await expect(deleteCategory(categoryId, access_token)).rejects.toEqual({ message: "Delete failed" });
        });
    });
});
