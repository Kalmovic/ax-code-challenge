import { render } from "@testing-library/react";
// import ListedUrl from ".";
import "@testing-library/jest-dom/extend-expect";
import { ListedUrl } from ".";

test("listed url renders correctly", () => {
    const { getByText } = render(<ListedUrl url="url.com" />);

    expect(getByText("url.com")).toBeInTheDocument();
});

test("listed url rerenders correctly", () => {
    const { getByText, rerender } = render(<ListedUrl url="url.com" />);

    rerender(<ListedUrl url="url2.com" />);

    expect(getByText("url2.com")).toBeInTheDocument();
});
