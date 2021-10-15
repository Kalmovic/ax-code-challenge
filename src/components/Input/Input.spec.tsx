import { render } from "@testing-library/react";
import Input from ".";
import "@testing-library/jest-dom/extend-expect";

test("input renders correctly", () => {
    const { getByPlaceholderText } = render(
        <Input name="search" placeholder="teste" />
    );

    expect(getByPlaceholderText("teste")).toBeInTheDocument();
});
