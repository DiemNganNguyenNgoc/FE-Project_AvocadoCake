import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import CardProduct from "../src/app/components/CardProduct/CardProduct";
import * as productServices from "../src/app/api/services/productServices";

// Mock i18next
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: { language: "en", changeLanguage: jest.fn() },
    }),
}));

// Mock productServices
jest.mock("../src/app/api/services/productServices", () => ({
    trackProductView: jest.fn(),
    trackProductClick: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe() { }
    unobserve() { }
    disconnect() { }
};

const mockStore = configureStore([]);

describe("CardProduct", () => {
    let store;
    const product = {
        id: "1",
        type: "Cake",
        img: "test.jpg",
        title: "Delicious Cake",
        price: 100000,
        discount: 10,
    };

    beforeEach(() => {
        store = mockStore({});
        store.dispatch = jest.fn();
        jest.clearAllMocks();
    });

    it("renders product details", () => {
        render(
            <Provider store={store}>
                <CardProduct {...product} />
            </Provider>
        );

        expect(screen.getByText("Delicious Cake")).toBeInTheDocument();
        // Discounted price: 100000 * 0.9 = 90000
        expect(screen.getByText(/90,000/)).toBeInTheDocument();
        expect(screen.getByText("-10%")).toBeInTheDocument();
    });

    it("calls trackProductClick and onCardClick when clicked", () => {
        const onCardClick = jest.fn();
        render(
            <Provider store={store}>
                <CardProduct {...product} onCardClick={onCardClick} />
            </Provider>
        );

        fireEvent.click(screen.getByRole("button"));

        expect(productServices.trackProductClick).toHaveBeenCalledWith("1");
        expect(onCardClick).toHaveBeenCalledWith(expect.objectContaining({ id: "1", title: "Delicious Cake" }));
    });

    it("dispatches addToCart when 'Add to cart' button is clicked", () => {
        render(
            <Provider store={store}>
                <CardProduct {...product} />
            </Provider>
        );

        // Mock document.querySelector for animation logic
        document.querySelector = jest.fn().mockReturnValue({
            getBoundingClientRect: () => ({ top: 0, left: 0, width: 10, height: 10 }),
            closest: () => ({
                getBoundingClientRect: () => ({ top: 0, left: 0, width: 10, height: 10 }),
                cloneNode: () => ({
                    style: {},
                    appendChild: jest.fn(),
                    addEventListener: jest.fn(),
                    remove: jest.fn()
                })
            })
        });

        fireEvent.click(screen.getByText("button.add_to_cart"));

        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "cart/addToCart" }));
    });
});
