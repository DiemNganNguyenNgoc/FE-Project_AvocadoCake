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

    const mockProducts = [
        { id: "1", name: "Avocado Cake", price: 500000, category: "Cakes" },
        { id: "2", name: "Chocolate Cake", price: 450000, category: "Cakes" },
        { id: "3", name: "Sourdough Bread", price: 80000, category: "Breads" }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllProduct", () => {
        it("should return products on success", async () => {
            axios.get.mockResolvedValue({ data: mockProducts });

            const result = await getAllProduct(access_token);

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("/product/get-all-product"),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        token: `Bearer ${access_token}`,
                    }),
                })
            );
            expect(result).toEqual(mockProducts);
        });

        it("should throw fallback error on failure", async () => {
            axios.get.mockRejectedValue({
                response: { data: {} },
            });

            await expect(getAllProduct(access_token)).rejects.toEqual({
                message: "Đã xảy ra lỗi.",
            });
        });

        it("should throw network error on connection failure", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(getAllProduct(access_token)).rejects.toEqual({
                product: 500,
                message: "Không thể kết nối đến máy chủ."
            });
        });
    });

    describe("getDetailsproduct", () => {
        it("should return product details", async () => {
            const mockData = mockProducts[0];
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getDetailsproduct(productId, access_token);

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining(`/product/get-detail-product/${productId}`),
                expect.any(Object)
            );
            expect(result).toEqual(mockData);
        });

        it("should throw fallback error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: {} } });
            await expect(getDetailsproduct(productId, access_token)).rejects.toEqual({ message: "Đã xảy ra lỗi." });
        });
    });

    describe("searchProducts", () => {
        it("should return search results", async () => {
            const query = "avocado";
            axios.get.mockResolvedValue({ data: [mockProducts[0]] });

            const result = await searchProducts(query);

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining(`/product/search?search=${query}`),
                expect.any(Object)
            );
            expect(result).toEqual([mockProducts[0]]);
        });

        it("should throw network error on failure", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(searchProducts("query")).rejects.toEqual({
                product: 500,
                message: "Không thể kết nối đến máy chủ."
            });
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

        it("should throw network error on connection failure", async () => {
            axios.post.mockRejectedValue(new Error());
            await expect(createProduct({}, access_token)).rejects.toEqual({
                status: 500,
                message: "Không thể kết nối đến máy chủ."
            });
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

        it("should throw network error on failure", async () => {
            const mockFormData = { entries: () => [] };
            axios.put.mockRejectedValue(new Error());
            await expect(updateProduct(productId, access_token, mockFormData)).rejects.toEqual({
                product: 500,
                message: "Không thể kết nối đến máy chủ."
            });
        });
    });

    describe("deleteProduct", () => {
        it("should call axios.delete", async () => {
            axios.delete.mockResolvedValue({ data: { success: true } });
            const result = await deleteProduct(productId, access_token);
            expect(result).toEqual({ success: true });
        });

        it("should throw network error on failure", async () => {
            axios.delete.mockRejectedValue(new Error());
            await expect(deleteProduct(productId, access_token)).rejects.toEqual({
                product: 500,
                message: "Không thể kết nối đến máy chủ."
            });
        });
    });

    describe("getProductsByCategory", () => {
        it("should return products by category", async () => {
            axios.get.mockResolvedValue({ data: [mockProducts[0], mockProducts[1]] });
            const result = await getProductsByCategory("cat-1");
            expect(result).toEqual([mockProducts[0], mockProducts[1]]);
        });

        it("should throw fallback error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: {} } });
            await expect(getProductsByCategory("cat-1")).rejects.toEqual({ message: "Đã xảy ra lỗi." });
        });
    });

    describe("getRecommendations", () => {
        it("should return recommendations", async () => {
            const mockData = [mockProducts[1]];
            axios.post.mockResolvedValue({ data: mockData });
            const result = await getRecommendations("user-1", "prod-1");
            expect(result).toEqual(mockData);
        });

        it("should throw generic error on failure", async () => {
            axios.post.mockRejectedValue(new Error());
            await expect(getRecommendations("u", "p")).rejects.toEqual({ message: "Không thể lấy khuyến nghị" });
        });
    });

    describe("getWeeklyNewProducts", () => {
        it("should return weekly products", async () => {
            axios.get.mockResolvedValue({ data: mockProducts });
            const result = await getWeeklyNewProducts(access_token);
            expect(result).toEqual(mockProducts);
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
            axios.get.mockResolvedValue({ data: [] });
            const result = await getPreviousWeekNewProducts(access_token);
            expect(result).toEqual([]);
        });
    });

    describe("trackProductView", () => {
        it("should call axios.post", async () => {
            axios.post.mockResolvedValue({ data: { status: "OK" } });
            const result = await trackProductView("prod-1");
            expect(axios.post).toHaveBeenCalled();
            expect(result).toEqual({ status: "OK" });
        });

        it("should log error but not throw on failure (silent fail)", async () => {
            axios.post.mockRejectedValue(new Error("Track Error"));
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
            await expect(trackProductView("prod-1")).resolves.toBeUndefined();
            expect(consoleSpy).toHaveBeenCalledWith("Failed to track product view:", expect.any(Error));
            consoleSpy.mockRestore();
        });
    });

    describe("trackProductClick", () => {
        it("should call axios.post", async () => {
            axios.post.mockResolvedValue({ data: { status: "OK" } });
            const result = await trackProductClick("prod-1");
            expect(axios.post).toHaveBeenCalled();
            expect(result).toEqual({ status: "OK" });
        });

        it("should log error but not throw on failure (silent fail)", async () => {
            axios.post.mockRejectedValue(new Error("Click Error"));
            const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
            await expect(trackProductClick("prod-1")).resolves.toBeUndefined();
            expect(consoleSpy).toHaveBeenCalledWith("Failed to track product click:", expect.any(Error));
            consoleSpy.mockRestore();
        });
    });
});
