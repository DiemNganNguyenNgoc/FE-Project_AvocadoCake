import axios from "axios";
import {
    getAllDiscount,
    getDetailsDiscount,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    getDiscountsByCategory,
    applyDiscount,
    getBestsDiscount,
} from "../src/app/api/services/DiscountService";

jest.mock("axios", () => ({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn().mockReturnThis(),
}));

describe("DiscountService", () => {
    const access_token = "mock-token";
    const discountId = "disc-123";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllDiscount", () => {
        it("should return all discounts on success", async () => {
            const mockData = [{ id: 1, name: "New Year" }];
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getAllDiscount();

            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getAllDiscount()).rejects.toEqual({ message: "Error" });
        });
    });

    describe("getDetailsDiscount", () => {
        it("should return discount details", async () => {
            const mockData = { id: discountId, name: "Sale" };
            axios.get.mockResolvedValue({ data: mockData });

            const result = await getDetailsDiscount(discountId, access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw network error on failure", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(getDetailsDiscount(discountId, access_token)).rejects.toEqual({ Discount: 500, message: "Không thể kết nối đến máy chủ." });
        });
    });

    describe("createDiscount", () => {
        it("should call axios.post with data", async () => {
            const inputData = { name: "Sale" };
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await createDiscount(inputData, access_token);

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/discount/create-discount"),
                inputData,
                expect.any(Object)
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Failed" } } });
            await expect(createDiscount({}, access_token)).rejects.toEqual({ message: "Failed" });
        });

        it("should throw network error on failure", async () => {
            axios.post.mockRejectedValue(new Error());
            await expect(createDiscount({}, access_token)).rejects.toEqual({ status: 500, message: "Không thể kết nối đến máy chủ." });
        });
    });

    describe("updateDiscount", () => {
        it("should call axios.put", async () => {
            const mockFormData = { entries: () => [] };
            axios.put.mockResolvedValue({ data: { success: true } });
            const result = await updateDiscount(discountId, access_token, mockFormData);
            expect(result).toEqual({ success: true });
        });

        it("should throw error on failure", async () => {
            const mockFormData = { entries: () => [] };
            axios.put.mockRejectedValue({ response: { data: { message: "Update failed" } } });
            await expect(updateDiscount(discountId, access_token, mockFormData)).rejects.toEqual({ message: "Update failed" });
        });

        it("should throw network error on failure", async () => {
            const mockFormData = { entries: () => [] };
            axios.put.mockRejectedValue(new Error());
            await expect(updateDiscount(discountId, access_token, mockFormData)).rejects.toEqual({ Discount: 500, message: "Không thể kết nối đến máy chủ." });
        });
    });

    describe("deleteDiscount", () => {
        it("should call axios.delete", async () => {
            axios.delete.mockResolvedValue({ data: { success: true } });
            const result = await deleteDiscount(discountId, access_token);
            expect(result).toEqual({ success: true });
        });

        it("should throw network error on failure", async () => {
            axios.delete.mockRejectedValue(new Error());
            await expect(deleteDiscount(discountId, access_token)).rejects.toEqual({ message: "Không thể kết nối đến máy chủ." });
        });
    });

    describe("getDiscountsByCategory", () => {
        it("should return discounts", async () => {
            const mockData = [];
            axios.get.mockResolvedValue({ data: mockData });
            const result = await getDiscountsByCategory("cat-1");
            expect(result).toEqual(mockData);
        });

        it("should throw network error on failure", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(getDiscountsByCategory("cat-1")).rejects.toEqual({ Discount: 500, message: "Không thể kết nối đến máy chủ." });
        });
    });

    describe("applyDiscount", () => {
        it("should call axios.post", async () => {
            axios.post.mockResolvedValue({});
            await applyDiscount("prod-1", "CODE");
            expect(axios.post).toHaveBeenCalled();
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Invalid code" } } });
            await expect(applyDiscount("prod-1", "CODE")).rejects.toEqual({ message: "Invalid code" });
        });

        it("should throw network error on failure", async () => {
            axios.post.mockRejectedValue(new Error());
            await expect(applyDiscount("prod-1", "CODE")).rejects.toEqual({ message: "Không thể kết nối đến máy chủ." });
        });
    });

    describe("getBestsDiscount", () => {
        it("should return best discounts", async () => {
            const mockData = { products: [] };
            axios.get.mockResolvedValue({ data: mockData });
            const result = await getBestsDiscount(null, access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw network error on failure", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(getBestsDiscount(null, access_token)).rejects.toEqual({ Discount: 500, message: "Không thể kết nối đến máy chủ." });
        });
    });
});
