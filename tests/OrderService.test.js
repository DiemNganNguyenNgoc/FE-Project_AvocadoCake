import axios from "axios";
import {
    createOrder,
    getDetailsOrder,
    updateOrderInfo,
    updateOrderStatus,
    getAllOrders,
    deleteOrder,
    fetchCities,
    getOrdersByUser,
    createProductRating,
    getProductRatings,
    getUserProductRating,
    updateProductRating,
    applyCoinsToOrder,
    confirmPaymentWithVoucher,
    getRecentOrders,
    getWeeklyNewOrders,
    getBestSellingProducts,
    getPreviousWeekNewOrders,
} from "../src/app/api/services/OrderService";

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

describe("OrderService", () => {
    const access_token = "mock-token";
    const orderId = "order-123";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createOrder", () => {
        it("should create order successfully", async () => {
            const mockData = { items: [], total: 100 };
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await createOrder(mockData);

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/order/create-order"),
                mockData,
                expect.any(Object)
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(createOrder({})).rejects.toEqual({ message: "Error" });
        });
    });

    describe("getDetailsOrder", () => {
        it("should return order details", async () => {
            const mockResponse = { data: { id: orderId } };
            axios.get.mockResolvedValue(mockResponse);

            const result = await getDetailsOrder(orderId);

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining(`/order/get-detail-order/${orderId}`),
                expect.any(Object)
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw network error on failure", async () => {
            axios.get.mockRejectedValue(new Error());
            await expect(getDetailsOrder(orderId)).rejects.toEqual({
                status: 500,
                message: "Không thể kết nối đến máy chủ.",
            });
        });
    });

    describe("updateOrderInfo", () => {
        it("should update order info successfully", async () => {
            const updateData = { address: "New Address" };
            const mockResponse = { data: { success: true } };
            axios.put.mockResolvedValue(mockResponse);

            const result = await updateOrderInfo(orderId, updateData);

            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.put.mockRejectedValue({ response: { data: { message: "Update error" } } });
            await expect(updateOrderInfo(orderId, {})).rejects.toEqual({ message: "Update error" });
        });

        it("should throw network error on connection failure", async () => {
            axios.put.mockRejectedValue(new Error());
            await expect(updateOrderInfo(orderId, {})).rejects.toEqual({
                status: 500,
                message: "Không thể kết nối đến máy chủ.",
            });
        });
    });

    describe("updateOrderStatus", () => {
        it("should update order status", async () => {
            const mockResponse = { data: { status: "Updated" } };
            axios.put.mockResolvedValue(mockResponse);

            const result = await updateOrderStatus(orderId, "status-1", access_token);

            expect(axios.put).toHaveBeenCalledWith(
                expect.stringContaining(`/order/update-order-status/${orderId}`),
                { statusId: "status-1" },
                expect.any(Object)
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.put.mockRejectedValue({ response: { data: { status: "ERR", message: "Fail" } } });
            await expect(updateOrderStatus(orderId, "s1", access_token)).rejects.toEqual({
                status: "ERR",
                message: "Fail",
            });
        });
    });

    describe("getAllOrders", () => {
        it("should return all orders", async () => {
            const mockResponse = { data: [{ id: 1 }] };
            axios.get.mockResolvedValue(mockResponse);

            const result = await getAllOrders(access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getAllOrders(access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("deleteOrder", () => {
        it("should delete order", async () => {
            axios.delete.mockResolvedValue({ data: { success: true } });
            const result = await deleteOrder(orderId);
            expect(result).toEqual({ success: true });
        });

        it("should throw error on failure", async () => {
            axios.delete.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(deleteOrder(orderId)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("fetchCities", () => {
        it("should return cities", async () => {
            const mockData = [{ name: "HN" }];
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

    describe("getOrdersByUser", () => {
        it("should return user orders", async () => {
            const mockResponse = { data: [] };
            axios.get.mockResolvedValue(mockResponse);
            const result = await getOrdersByUser(access_token, "user-1");
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getOrdersByUser(access_token, "u1")).rejects.toEqual({ message: "Error" });
        });
    });

    describe("createProductRating", () => {
        it("should create rating", async () => {
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);
            const result = await createProductRating({}, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Rating error" } } });
            await expect(createProductRating({}, access_token)).rejects.toEqual({ message: "Rating error" });
        });
    });

    describe("getProductRatings", () => {
        it("should return product ratings", async () => {
            const mockResponse = { data: [] };
            axios.get.mockResolvedValue(mockResponse);
            const result = await getProductRatings("prod-1");
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getProductRatings("p1")).rejects.toEqual({ message: "Error" });
        });
    });

    describe("getUserProductRating", () => {
        it("should return user product rating", async () => {
            const mockResponse = { data: {} };
            axios.get.mockResolvedValue(mockResponse);
            const result = await getUserProductRating("p1", "o1", access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getUserProductRating("p1", "o1", access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("updateProductRating", () => {
        it("should update rating", async () => {
            const mockResponse = { data: { status: "OK" } };
            axios.put.mockResolvedValue(mockResponse);
            const result = await updateProductRating("r1", {}, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.put.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(updateProductRating("r1", {}, access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("applyCoinsToOrder", () => {
        it("should apply coins", async () => {
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);
            const result = await applyCoinsToOrder(orderId, 10, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Coin error" } } });
            await expect(applyCoinsToOrder(orderId, 10, access_token)).rejects.toEqual({ status: "ERR", message: "Coin error" });
        });
    });

    describe("confirmPaymentWithVoucher", () => {
        it("should confirm payment", async () => {
            const mockResponse = { data: { status: "OK" } };
            axios.post.mockResolvedValue(mockResponse);
            const result = await confirmPaymentWithVoucher(orderId, {}, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Voucher error" } } });
            await expect(confirmPaymentWithVoucher(orderId, {}, access_token)).rejects.toEqual({ status: "ERR", message: "Voucher error" });
        });
    });

    describe("getRecentOrders", () => {
        it("should return recent orders", async () => {
            const mockResponse = { data: [] };
            axios.get.mockResolvedValue(mockResponse);
            const result = await getRecentOrders(access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getRecentOrders(access_token)).rejects.toEqual({ status: "ERR", message: "Error" });
        });
    });

    describe("getBestSellingProducts", () => {
        it("should return best selling products", async () => {
            const mockData = [{ id: 1 }];
            axios.get.mockResolvedValue({ data: mockData });
            const result = await getBestSellingProducts(access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { status: "ERR", message: "Error" } } });
            await expect(getBestSellingProducts(access_token)).rejects.toEqual({ status: "ERR", message: "Error" });
        });
    });

    describe("getWeeklyNewOrders", () => {
        it("should return weekly new orders", async () => {
            const mockResponse = { data: { total: 5 } };
            axios.get.mockResolvedValue(mockResponse);
            const result = await getWeeklyNewOrders(access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getWeeklyNewOrders(access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("getPreviousWeekNewOrders", () => {
        it("should return previous week new orders", async () => {
            const mockData = { total: 3 };
            axios.get.mockResolvedValue({ data: mockData });
            const result = await getPreviousWeekNewOrders(access_token);
            expect(result).toEqual(mockData);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getPreviousWeekNewOrders(access_token)).rejects.toEqual({ message: "Error" });
        });
    });
});
