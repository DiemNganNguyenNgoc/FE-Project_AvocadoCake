import axios from "axios";
import {
    createVoucher,
    createBulkVouchers,
    updateVoucher,
    deleteVoucher,
    getAllVouchers,
    getVoucherDetails,
    toggleVoucherStatus,
    sendVoucherEmail,
    getVoucherStatistics,
    getPublicVouchers,
    claimVoucher,
    getUserVouchers,
    validateVoucherCode,
    applyVouchersToOrder,
    getVoucherTypeText,
    formatVoucherValue,
    isVoucherExpired,
    isVoucherAvailable,
    getVoucherStatusColor,
    getVoucherStatusText
} from "../src/app/api/services/VoucherService";

jest.mock("axios", () => {
    const mock = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        create: jest.fn(),
    };
    mock.create.mockReturnValue(mock);
    return mock;
});

describe("VoucherService", () => {
    const access_token = "mock-token";
    const voucherId = "voucher-123";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createVoucher", () => {
        it("should create voucher successfully", async () => {
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);
            const result = await createVoucher({}, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(createVoucher({}, access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("createBulkVouchers", () => {
        it("should create bulk vouchers successfully", async () => {
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);
            const result = await createBulkVouchers([], access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Bulk error" } } });
            await expect(createBulkVouchers([], access_token)).rejects.toEqual({ message: "Bulk error" });
        });
    });

    describe("updateVoucher", () => {
        it("should update voucher", async () => {
            const mockResponse = { data: { success: true } };
            axios.put.mockResolvedValue(mockResponse);
            const result = await updateVoucher(voucherId, {}, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.put.mockRejectedValue({ response: { data: { message: "Update error" } } });
            await expect(updateVoucher(voucherId, {}, access_token)).rejects.toEqual({ message: "Update error" });
        });
    });

    describe("deleteVoucher", () => {
        it("should delete voucher", async () => {
            axios.delete.mockResolvedValue({ data: { success: true } });
            const result = await deleteVoucher(voucherId, access_token);
            expect(result).toEqual({ success: true });
        });

        it("should throw error on failure", async () => {
            axios.delete.mockRejectedValue({ response: { data: { message: "Delete error" } } });
            await expect(deleteVoucher(voucherId, access_token)).rejects.toEqual({ message: "Delete error" });
        });
    });

    describe("getAllVouchers", () => {
        it("should return all vouchers", async () => {
            const mockResponse = { data: [] };
            axios.get.mockResolvedValue(mockResponse);
            const result = await getAllVouchers({ limit: 5 }, access_token);
            expect(result).toEqual(mockResponse.data);
            expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ params: { limit: 5, page: 0, sort: undefined, filter: undefined } }));
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getAllVouchers({}, access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("getVoucherDetails", () => {
        it("should return voucher details", async () => {
            const mockResponse = { data: { id: voucherId } };
            axios.get.mockResolvedValue(mockResponse);
            const result = await getVoucherDetails(voucherId, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getVoucherDetails(voucherId, access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("toggleVoucherStatus", () => {
        it("should toggle status successfully", async () => {
            const mockResponse = { data: { status: "Active" } };
            axios.patch.mockResolvedValue(mockResponse);
            const result = await toggleVoucherStatus(voucherId, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.patch.mockRejectedValue({ response: { data: { message: "Toggle error" } } });
            await expect(toggleVoucherStatus(voucherId, access_token)).rejects.toEqual({ message: "Toggle error" });
        });
    });

    describe("sendVoucherEmail", () => {
        it("should send email successfully", async () => {
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);
            const result = await sendVoucherEmail({}, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(sendVoucherEmail({}, access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("getVoucherStatistics", () => {
        it("should return statistics", async () => {
            const mockResponse = { data: { total: 100 } };
            axios.get.mockResolvedValue(mockResponse);
            const result = await getVoucherStatistics(access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getVoucherStatistics(access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("getPublicVouchers", () => {
        it("should return public vouchers", async () => {
            const mockResponse = { data: [] };
            axios.get.mockResolvedValue(mockResponse);
            const result = await getPublicVouchers();
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getPublicVouchers()).rejects.toEqual({ message: "Error" });
        });
    });

    describe("claimVoucher", () => {
        it("should claim voucher successfully", async () => {
            const mockResponse = { data: { status: "OK" } };
            axios.post.mockResolvedValue(mockResponse);
            const result = await claimVoucher(voucherId, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { status: "ERR", message: "Error" } } });
            await expect(claimVoucher(voucherId, access_token)).rejects.toEqual({ status: "ERR", message: "Error" });
        });
    });

    describe("validateVoucherCode", () => {
        it("should validate code successfully", async () => {
            const mockResponse = { data: { valid: true } };
            axios.post.mockResolvedValue(mockResponse);
            const result = await validateVoucherCode("CODE10", access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Invalid" } } });
            await expect(validateVoucherCode("C10", access_token)).rejects.toEqual({ message: "Invalid" });
        });
    });

    describe("getUserVouchers", () => {
        it("should return user vouchers", async () => {
            const mockResponse = { data: [] };
            axios.get.mockResolvedValue(mockResponse);
            const result = await getUserVouchers("ACTIVE", access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.get.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(getUserVouchers("ACTIVE", access_token)).rejects.toEqual({ message: "Error" });
        });
    });

    describe("applyVouchersToOrder", () => {
        it("should apply vouchers successfully", async () => {
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);
            const result = await applyVouchersToOrder([], {}, access_token);
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error on failure", async () => {
            axios.post.mockRejectedValue({ response: { data: { message: "Error" } } });
            await expect(applyVouchersToOrder([], {}, access_token)).rejects.toEqual({ message: "Error" });
        });
    });
    describe("Helper Functions", () => {
        it("getVoucherTypeText should return correct text", () => {
            expect(getVoucherTypeText("PERCENTAGE")).toBe("Giảm theo %");
            expect(getVoucherTypeText("UNKNOWN")).toBe("UNKNOWN");
        });

        it("formatVoucherValue should return correct format", () => {
            const v1 = { voucherType: "PERCENTAGE", discountValue: 10, maxDiscountAmount: 50000 };
            expect(formatVoucherValue(v1)).toContain("10%");
            expect(formatVoucherValue(v1)).toContain("50.000");

            const v2 = { voucherType: "FIXED_AMOUNT", discountValue: 10000 };
            expect(formatVoucherValue(v2)).toBe("10.000₫");

            const v3 = { voucherType: "FREE_SHIPPING" };
            expect(formatVoucherValue(v3)).toBe("Miễn phí ship");

            const v4 = { voucherType: "OTHER", discountValue: "Custom" };
            expect(formatVoucherValue(v4)).toBe("Custom");
        });

        it("isVoucherExpired should return correct boolean", () => {
            const pastDate = new Date();
            pastDate.setFullYear(pastDate.getFullYear() - 1);
            expect(isVoucherExpired(pastDate.toISOString())).toBe(true);

            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            expect(isVoucherExpired(futureDate.toISOString())).toBe(false);
        });

        it("isVoucherAvailable should check multiple conditions", () => {
            const now = new Date();
            const start = new Date(now.getTime() - 100000);
            const end = new Date(now.getTime() + 100000);
            const voucher = {
                isActive: true,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                claimedQuantity: 5,
                totalQuantity: 10
            };
            expect(isVoucherAvailable(voucher)).toBe(true);

            voucher.isActive = false;
            expect(isVoucherAvailable(voucher)).toBe(false);
        });

        it("getVoucherStatusColor should return correct class", () => {
            expect(getVoucherStatusColor("ACTIVE")).toBe("bg-green-100 text-green-800");
            expect(getVoucherStatusColor("EXPIRED")).toBe("bg-red-100 text-red-800");
        });

        it("getVoucherStatusText should return correct text", () => {
            expect(getVoucherStatusText("ACTIVE")).toBe("Có thể dùng");
            expect(getVoucherStatusText("USED")).toBe("Đã sử dụng");
        });
    });
});
