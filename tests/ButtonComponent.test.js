import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ButtonComponent from "../src/app/components/ButtonComponent/ButtonComponent";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUsedNavigate,
}));

describe("ButtonComponent", () => {
    it("renders with children", () => {
        render(
            <BrowserRouter>
                <ButtonComponent>Click Me</ButtonComponent>
            </BrowserRouter>
        );
        expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    it("calls onClick when clicked", () => {
        const handleClick = jest.fn();
        render(
            <BrowserRouter>
                <ButtonComponent onClick={handleClick}>Click Me</ButtonComponent>
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText("Click Me"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("navigates when 'to' prop is provided", () => {
        render(
            <BrowserRouter>
                <ButtonComponent to="/target">Go</ButtonComponent>
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText("Go"));
        expect(mockedUsedNavigate).toHaveBeenCalledWith("/target");
    });

    it("triggers file input click when file input exists", () => {
        // This is a bit tricky because fileInputRef is internal.
        // However, the input is rendered in the DOM.
        const { container } = render(
            <BrowserRouter>
                <ButtonComponent accept="image/*">Upload</ButtonComponent>
            </BrowserRouter>
        );
        const input = container.querySelector('input[type="file"]');
        const spy = jest.spyOn(input, 'click');

        fireEvent.click(screen.getByText("Upload"));
        expect(spy).toHaveBeenCalled();
    });
});
