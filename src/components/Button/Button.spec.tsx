import { render } from "@testing-library/react";
import Button from ".";
import "@testing-library/jest-dom/extend-expect";

test("button renders correctly", () => {
    const { getByText } = render(
        <Button onClick={() => jest.fn()}>
            <h1>teste</h1>
        </Button>
    );

    expect(getByText("teste")).toBeInTheDocument();
});
