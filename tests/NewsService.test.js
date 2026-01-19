import axios from "axios";
import {
    createNews,
    getDetailsNews,
    getAllNews,
    updateNews,
    deleteNews,
} from "../src/app/api/services/NewsService";

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

describe("NewsService", () => {
    const access_token = "mock-token";
    const newsId = "news-123";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createNews", () => {
        it("should create news successfully", async () => {
            const formData = new FormData();
            const mockResponse = { data: { success: true } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await createNews(formData, access_token);

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining("/news/create-news"),
                formData,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        "Content-Type": "multipart/form-data",
                        token: `Bearer ${access_token}`,
                    }),
                })
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error with API message on failure", async () => {
            const errorMsg = "Title is required";
            axios.post.mockRejectedValue({
                response: { data: { message: errorMsg } },
            });

            await expect(createNews({}, access_token)).rejects.toEqual({
                message: errorMsg,
            });
        });

        it("should throw default message if API response message is missing", async () => {
            axios.post.mockRejectedValue({
                response: { data: {} },
            });

            await expect(createNews({}, access_token)).rejects.toEqual({
                message: "Đã xảy ra lỗi.",
            });
        });

        it("should throw network error if no response", async () => {
            axios.post.mockRejectedValue(new Error("Network Error"));

            await expect(createNews({}, access_token)).rejects.toEqual({
                status: 500,
                message: "Không thể kết nối đến máy chủ.",
            });
        });
    });

    describe("getDetailsNews", () => {
        it("should return news details successfully", async () => {
            const mockResponse = { data: { id: newsId, title: "News Title" } };
            axios.get.mockResolvedValue(mockResponse);

            const result = await getDetailsNews(newsId, access_token);

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining(`/news/get-detail-news/${newsId}`),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        token: `Bearer ${access_token}`,
                    }),
                })
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error with API message on failure", async () => {
            axios.get.mockRejectedValue({
                response: { data: { message: "Not found" } },
            });

            await expect(getDetailsNews(newsId, access_token)).rejects.toEqual({
                message: "Not found",
            });
        });

        it("should throw network error if no response", async () => {
            axios.get.mockRejectedValue(new Error());

            await expect(getDetailsNews(newsId, access_token)).rejects.toEqual({
                news: 500,
                message: "Không thể kết nối đến máy chủ.",
            });
        });
    });

    describe("getAllNews", () => {
        it("should return all news successfully", async () => {
            const mockResponse = { data: [{ id: 1 }, { id: 2 }] };
            axios.get.mockResolvedValue(mockResponse);

            const result = await getAllNews();

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("/news/get-all-news"),
                expect.any(Object)
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error with API message on failure", async () => {
            axios.get.mockRejectedValue({
                response: { data: { message: "Error" } },
            });

            await expect(getAllNews()).rejects.toEqual({
                message: "Error",
            });
        });

        it("should throw network error if no response", async () => {
            axios.get.mockRejectedValue(new Error());

            await expect(getAllNews()).rejects.toEqual({
                news: 500,
                message: "Không thể kết nối đến máy chủ.",
            });
        });
    });

    describe("updateNews", () => {
        it("should update news successfully", async () => {
            const formData = new FormData();
            const mockResponse = { data: { success: true } };
            axios.put.mockResolvedValue(mockResponse);

            const result = await updateNews(newsId, access_token, formData);

            expect(axios.put).toHaveBeenCalledWith(
                expect.stringContaining(`/news/update-news/${newsId}`),
                formData,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        "Content-Type": "multipart/form-data",
                        token: `Bearer ${access_token}`,
                    }),
                })
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error with API message on failure", async () => {
            axios.put.mockRejectedValue({
                response: { data: { message: "Update failed" } },
            });

            await expect(updateNews(newsId, access_token, {})).rejects.toEqual({
                message: "Update failed",
            });
        });

        it("should throw network error if no response", async () => {
            axios.put.mockRejectedValue(new Error());

            await expect(updateNews(newsId, access_token, {})).rejects.toEqual({
                news: 500,
                message: "Không thể kết nối đến máy chủ.",
            });
        });
    });

    describe("deleteNews", () => {
        it("should delete news successfully", async () => {
            const mockResponse = { data: { success: true } };
            axios.delete.mockResolvedValue(mockResponse);

            const result = await deleteNews(newsId, access_token);

            expect(axios.delete).toHaveBeenCalledWith(
                expect.stringContaining(`/news/delete-news/${newsId}`),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        token: `Bearer ${access_token}`,
                    }),
                })
            );
            expect(result).toEqual(mockResponse.data);
        });

        it("should throw error with API message on failure", async () => {
            axios.delete.mockRejectedValue({
                response: { data: { message: "Delete failed" } },
            });

            await expect(deleteNews(newsId, access_token)).rejects.toEqual({
                message: "Delete failed",
            });
        });

        it("should throw network error if no response", async () => {
            axios.delete.mockRejectedValue(new Error());

            await expect(deleteNews(newsId, access_token)).rejects.toEqual({
                news: 500,
                message: "Không thể kết nối đến máy chủ.",
            });
        });
    });
});
