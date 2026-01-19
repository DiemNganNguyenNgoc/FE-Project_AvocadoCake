import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import LogInPage from "../src/app/pages/LogInPage/LogInPage";
import * as UserService from "../src/app/api/services/UserService";
import { useMutationHook } from "../src/app/hooks/useMutationHook";

// Mock requirements
jest.mock("../src/app/api/services/UserService");
jest.mock("../src/app/api/services/AuthService");
jest.mock("../src/app/hooks/useMutationHook");
jest.mock("jwt-decode", () => () => ({ id: "123" }));
jest.mock("@react-oauth/google", () => ({
    GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
    GoogleLogin: () => <div>GoogleLogin</div>,
}));

const mockStore = configureStore([]);

describe("LogInPage", () => {
    let store;
    let mockMutate;

    beforeEach(() => {
        store = mockStore({});
        store.dispatch = jest.fn();
        mockMutate = jest.fn();
        useMutationHook.mockReturnValue({
            mutate: mockMutate,
            isSuccess: false,
            isError: false,
            data: null,
            error: null,
        });
        jest.clearAllMocks();
    });

    const renderPage = () =>
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <LogInPage />
                </BrowserRouter>
            </Provider>
        );

    it("renders login form", () => {
        renderPage();
        expect(screen.getByText("ĐĂNG NHẬP")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Nhập email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Nhập mật khẩu")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Đăng nhập" })).toBeDisabled();
    });

    it("enables submit button when form is valid", () => {
        renderPage();
        fireEvent.change(screen.getByPlaceholderText("Nhập email"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu"), { target: { value: "password123" } });
        expect(screen.getByRole("button", { name: "Đăng nhập" })).not.toBeDisabled();
    });

    it("calls login mutation on submit", () => {
        renderPage();
        fireEvent.change(screen.getByPlaceholderText("Nhập email"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu"), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

        expect(mockMutate).toHaveBeenCalledWith({
            userEmail: "test@example.com",
            userPassword: "password123",
        });
    });

    it("shows success message on successful login", async () => {
        useMutationHook.mockReturnValue({
            mutate: mockMutate,
            isSuccess: true,
            isError: false,
            data: { access_token: "mock-token" },
        });

        UserService.getDetailsUser.mockResolvedValue({ status: "OK", data: { id: "123", name: "Test User" } });

        renderPage();

        await waitFor(() => {
            expect(screen.getByText(/Đăng nhập thành công/)).toBeInTheDocument();
        });
        expect(store.dispatch).toHaveBeenCalled();
    });

    it("shows error message on failed login", async () => {
        useMutationHook.mockReturnValue({
            mutate: mockMutate,
            isSuccess: false,
            isError: true,
            error: { message: { message: "Invalid credentials" } },
        });

        renderPage();

        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
});
