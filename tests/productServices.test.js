import axios from "axios";
import {
    getAllProduct,
    getDetailsproduct,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getRecommendations,
    logSearch,
    getWeeklyNewProducts,
    getPreviousWeekNewProducts,
    trackProductView,
    trackProductClick,
} from "../src/app/api/services/productServices";

jest.mock("axios", () => {
    const mock = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
    };
    mock.create.mockReturnValue(mock);
    return mock;
});

describe("productServices", () => {
    const access_token = "mock-token";
    const productId = "product-123";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllProduct", () => {
        it("should return products on success", async () => {
            const mockData = [{ id: 1, name: "Cake" }];
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getAllProduct(access_token);

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("/product/get-all-product"),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        token: `Bearer ${access_token}`,
                    }),
                })
            );
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({
                response: { data: { message: "Error" } },
            });

            await expect(getAllProduct(access_token)).rejects.toEqual({
                message: "Error",
            });
        });
    });

    describe("getDetailsproduct", () => {
        it("should return product details", async () => {
            const mockData = { id: productId, name: "Special Cake" };
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getDetailsproduct(productId, access_token);

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining(`/product/get-detail-product/${productId}`),
                expect.any(Object)
            );
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Not found" } } });
            await expect(getDetailsproduct(productId, access_token)).rejects.toEqual({ message: "Not found" });
        });
    });

    describe("searchProducts", () => {
        it("should return search results", async () => {
            const query = "avocado";
            const mockData = [{ id: 1, name: "Avocado Cake" }];
            axios.get.mockResolvedValue({ data: mockData });

            const result = await searchProducts(query);

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining(`/product/search?search=${query}`),
                expect.any(Object)
            );
            expect(result).toEqual(mockData);
        });
    });

    describe("createProduct", () => {
        it("should call axios.post with form data", async () => {
            const mockFormData = new FormData();
            mockFormData.append("name", "New Cake");
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await createProduct(mockFormData, access_token);

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/product/create-product"),
                mockFormData,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        "Content-Type": "multipart/form-data",
                        token: `Bearer ${access_token}`,
                    }),
                })
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Create failed" } } });
            await expect(createProduct({}, access_token)).rejects.toEqual({ message: "Create failed" });
        });
    });

    describe("updateProduct", () => {
        it("should call axios.put with form data", async () => {
            const mockFormData = { entries: () => [] };
            const mockResponse = { data: { success: true } };
            axios.put.mockResolvedValue(mockResponse);

            const result = await updateProduct(productId, access_token, mockFormData);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            const mockFormData = { entries: () => [] };
            axios.put.mockRejectedValue({ response: { data: { message: "Update failed" } } });
            await expect(updateProduct(productId, access_token, mockFormData)).rejects.toEqual({ message: "Update failed" });
        });
    });

    describe("deleteProduct", () => {
        it("should call axios.delete", async () => {
            axios.delete.mockResolvedValue({ data: { success: true } });
            const result = await deleteProduct(productId, access_token);
            expect(result).toEqual({ success: true });
        });

        it("should throw error on failure", async () => {
            axios.delete.mockRejectedValue({ response: { data: { message: "Delete failed" } } });
            await expect(deleteProduct(productId, access_token)).rejects.toEqual({ message: "Delete failed" });
        });
    });

    describe("getProductsByCategory", () => {
        it("should return products by category", async () => {
            const mockData = [{ id: 1 }];
            axios.get.mockResolvedValue({ data: mockData });
            const result = await getProductsByCategory("cat-1");
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Category error" } } });
            await expect(getProductsByCategory("cat-1")).rejects.toEqual({ message: "Category error" });
        });
    });

    describe("getRecommendations", () => {
        it("should return recommendations", async () => {
            const mockData = [];
            axios.post.mockResolvedValue({ data: mockData });
            const result = await getRecommendations("user-1", "prod-1");
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Rec error" } } });
            await expect(getRecommendations("u", "p")).rejects.toEqual({ message: "Rec error" });
        });
    });

    describe("getWeeklyNewProducts", () => {
        it("should return weekly products", async () => {
            const mockData = [];
            axios.get.mockResolvedValue({ data: mockData });
            const result = await getWeeklyNewProducts(access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Weekly error" } } });
            await expect(getWeeklyNewProducts(access_token)).rejects.toEqual({ message: "Weekly error" });
        });
    });

    describe("logSearch", () => {
        it("should call axios.post to log", async () => {
            axios.post.mockResolvedValue({});
            await logSearch("user-1", "query");
            expect(axios.post).toHaveBeenCalled();
        });

        it("should log error but not throw on failure", async () => {
            axios.post.mockRejectedValue(new Error());
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
            await logSearch("u", "q");
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe("getPreviousWeekNewProducts", () => {
        it("should return previous weekly products", async () => {
            const mockData = [];
            axios.get.mockResolvedValue({ data: mockData });
            const result = await getPreviousWeekNewProducts(access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw generic error on failure", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(getPreviousWeekNewProducts(access_token)).rejects.toEqual({ message: "Không thể lấy sản phẩm mới" });
        });
    });

    describe("trackProductView", () => {
        it("should call axios.post", async () => {
            axios.post.mockResolvedValue({});
            await trackProductView("prod-1");
            expect(axios.post).toHaveBeenCalled();
        });

        it("should log error but not throw on failure", async () => {
            axios.post.mockRejectedValue(new Error());
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
            await expect(trackProductView("prod-1")).resolves.toBeUndefined();
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe("trackProductClick", () => {
        it("should call axios.post", async () => {
            axios.post.mockResolvedValue({});
            await trackProductClick("prod-1");
            expect(axios.post).toHaveBeenCalled();
        });

        it("should log error but not throw on failure", async () => {
            axios.post.mockRejectedValue(new Error());
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
            await expect(trackProductClick("prod-1")).resolves.toBeUndefined();
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});
