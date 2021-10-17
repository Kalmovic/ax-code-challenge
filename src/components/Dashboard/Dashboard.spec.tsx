import {
    render,
    screen,
    fireEvent,
    act,
    waitFor,
    queryByText
} from "@testing-library/react";
import Dashboard from ".";
import "@testing-library/jest-dom/extend-expect";
import "jest-styled-components";

jest.mock("../../services/api");

const getKeywordResultMock = require("../../services/api").getKeywordResult;
const getIdMock = require("../../services/api").getId;

beforeEach(() => {
    jest.restoreAllMocks();
});

test("dashboard renders correctly", () => {
    render(<Dashboard />);
});

test("input keyword incorrectly with more than one word", async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
        <Dashboard />
    );
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "two words" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(getByText("Keyword must be one word")).toBeInTheDocument();
        expect(getByTestId("input-wrapper")).toHaveStyleRule(
            "border",
            "1px solid var(--warning)"
        );
    });
});

test("input keyword incorrectly with less than 4 characters", async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
        <Dashboard />
    );
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "val" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(
            getByText("Keyword must have more than 3 characters")
        ).toBeInTheDocument();
        expect(getByTestId("input-wrapper")).toHaveStyleRule(
            "border",
            "1px solid var(--warning)"
        );
    });
});

test("connection handling", async () => {
    jest.spyOn(navigator, "onLine", "get").mockReturnValueOnce(false);
    const { getByPlaceholderText, getByText, getByTestId, queryByText } =
        render(<Dashboard />);
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(
            getByText("Please check your connection and try again")
        ).toBeInTheDocument();
        expect(getByTestId("input-wrapper")).toHaveStyleRule(
            "border",
            "1px solid var(--warning)"
        );
    });

    // test the connection reestablish to get a result

    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" } });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "active", urls: [] }
        });
    });
    jest.spyOn(navigator, "onLine", "get").mockReturnValueOnce(true);

    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });

    await waitFor(() => {
        expect(
            queryByText("Please check your connection and try again")
        ).not.toBeInTheDocument();
        expect(getByTestId("input-wrapper")).toHaveStyleRule(
            "border",
            "1px solid var(--purple)"
        );
    });
});

test("input keyword incorrectly with more than 32 characters", async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
        <Dashboard />
    );
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "valuewaaaaaaaaaytoobigtobeaccepted" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(
            getByText("Keyword must have less than 33 characters")
        ).toBeInTheDocument();
        expect(getByTestId("input-wrapper")).toHaveStyleRule(
            "border",
            "1px solid var(--warning)"
        );
    });
});

test("remove error from screen after correct input", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" } });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "active", urls: [] }
        });
    });

    const { getByPlaceholderText, getByText, queryByText, getByTestId } =
        render(<Dashboard />);
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "valuewaaaaaaaaaytoobigtobeaccepted" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(
            getByText("Keyword must have less than 33 characters")
        ).toBeInTheDocument();
        expect(getByTestId("input-wrapper")).toHaveStyleRule(
            "border",
            "1px solid var(--warning)"
        );
    });
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "" }
    });

    // input field empty and the error border is removed
    expect(getByTestId("input-wrapper")).toHaveStyleRule(
        "border",
        "1px solid var(--purple)"
    );
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(
            queryByText("Keyword must have less than 33 characters")
        ).not.toBeInTheDocument();
        expect(getByTestId("input-wrapper")).toHaveStyleRule(
            "border",
            "1px solid var(--purple)"
        );
    });
});

test("throw error in case getId return status error", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" }, status: 500 });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "active", urls: [] }
        });
    });

    const { getByPlaceholderText, getByText, queryByText, getByTestId } =
        render(<Dashboard />);
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(
            getByText(
                "There was a problem with your request, please try again later"
            )
        ).toBeInTheDocument();
        expect(getByTestId("input-wrapper")).toHaveStyleRule(
            "border",
            "1px solid var(--warning)"
        );
    });
});

test("throw error in case getKeywordResult return status error", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" } });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "active", urls: [] },
            status: 500
        });
    });

    const { getByPlaceholderText, getByText, queryByText, getByTestId } =
        render(<Dashboard />);
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(
            getByText(
                "There was a problem with your request, please try again later"
            )
        ).toBeInTheDocument();
        expect(getByTestId("input-wrapper")).toHaveStyleRule(
            "border",
            "1px solid var(--warning)"
        );
    });
});

test("renders keyword correctly", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" }, status: 200 });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "active", urls: [] },
            status: 200
        });
    });
    const { getByPlaceholderText, getByText } = render(<Dashboard />);
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(getByText("value")).toBeInTheDocument();
        expect(getByText("ACTIVE")).toBeInTheDocument();
        expect(getByText("show urls")).toBeInTheDocument();
    });
});

test("expand to show urls correctly", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" } });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: {
                id: "mock",
                status: "active",
                urls: ["url.com", "url2.com"]
            }
        });
    });
    const { getByPlaceholderText, getByText } = render(<Dashboard />);
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(getByText("value")).toBeInTheDocument();
        expect(getByText("ACTIVE")).toBeInTheDocument();
        expect(getByText("show urls")).toBeInTheDocument();
    });

    // Click to expand to show URLS
    act(() => {
        fireEvent.click(screen.getByText(/show urls/i));
    });
    expect(getByText("hide urls")).toBeInTheDocument();
    expect(getByText("url.com")).toBeInTheDocument();
    expect(getByText("url2.com")).toBeInTheDocument();
});

test("expand to show empty urls correctly", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" } });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "active", urls: [] }
        });
    });
    const { getByPlaceholderText, getByText, queryByText } = render(
        <Dashboard />
    );
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(getByText("value")).toBeInTheDocument();
        expect(getByText("ACTIVE")).toBeInTheDocument();
        expect(getByText("show urls")).toBeInTheDocument();
    });

    // Click to expand to show URLS
    act(() => {
        fireEvent.click(screen.getByText(/show urls/i));
    });
    expect(getByText("hide urls")).toBeInTheDocument();
    expect(getByText("Searching for URLs...")).toBeInTheDocument();
    // Click to hide URLS

    act(() => {
        fireEvent.click(screen.getByText(/hide urls/i));
    });
    expect(getByText("show urls")).toBeInTheDocument();
    expect(queryByText("Searching for URLs...")).not.toBeInTheDocument();
});

test("click to render more urls", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" } });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "active", urls: [] },
            status: 200
        });
    });
    const { getByPlaceholderText, getByText, queryByText } = render(
        <Dashboard />
    );
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    expect(queryByText("Search")).not.toBeInTheDocument();
    expect(getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
        expect(getByText("Search")).toBeInTheDocument();
        expect(getByText("value")).toBeInTheDocument();
        expect(getByText("ACTIVE")).toBeInTheDocument();
        expect(getByText("show urls")).toBeInTheDocument();
    });

    // Click to expand to show URLS
    act(() => {
        fireEvent.click(screen.getByText(/show urls/i));
    });
    expect(getByText("hide urls")).toBeInTheDocument();
    expect(getByText("Searching for URLs...")).toBeInTheDocument();
    expect(getByText("Update")).toBeInTheDocument();
    // Click to hide URLS
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "active", urls: ["url.com"] },
            status: 200
        });
    });
    act(() => {
        fireEvent.click(screen.getByText(/Update/i));
    });
    expect(queryByText("Update")).not.toBeInTheDocument();
    expect(getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
        expect(getByText("url.com")).toBeInTheDocument();
        expect(getByText("Update")).toBeInTheDocument();
    });
});

test("status change to done as empty", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" } });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "active", urls: [] }
        });
    });
    const { getByPlaceholderText, getByText, queryByText } = render(
        <Dashboard />
    );
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(getByText("value")).toBeInTheDocument();
        expect(getByText("ACTIVE")).toBeInTheDocument();
        expect(getByText("show urls")).toBeInTheDocument();
    });

    // Click to expand to show URLS
    act(() => {
        fireEvent.click(screen.getByText(/show urls/i));
    });
    expect(getByText("hide urls")).toBeInTheDocument();
    expect(getByText("Searching for URLs...")).toBeInTheDocument();
    expect(getByText("Update")).toBeInTheDocument();
    // Click to hide URLS
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "done", urls: [] }
        });
    });
    act(() => {
        fireEvent.click(screen.getByText(/Update/i));
    });
    expect(getByText("Loading")).toBeInTheDocument();
    expect(queryByText("Update")).not.toBeInTheDocument();

    await waitFor(() => {
        expect(getByText("No result found.")).toBeInTheDocument();
        expect(queryByText("Update")).not.toBeInTheDocument();
        expect(queryByText("Loading")).not.toBeInTheDocument();
    });
});

test("status change to done with urls", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" } });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "active", urls: [] }
        });
    });
    const { getByPlaceholderText, getByText, queryByText } = render(
        <Dashboard />
    );
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(getByText("value")).toBeInTheDocument();
        expect(getByText("ACTIVE")).toBeInTheDocument();
        expect(getByText("show urls")).toBeInTheDocument();
    });

    // Click to expand to show URLS
    act(() => {
        fireEvent.click(screen.getByText(/show urls/i));
    });
    expect(getByText("hide urls")).toBeInTheDocument();
    expect(getByText("Searching for URLs...")).toBeInTheDocument();
    expect(getByText("Update")).toBeInTheDocument();
    // Click to hide URLS
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "done", urls: ["url.com"] }
        });
    });
    act(() => {
        fireEvent.click(screen.getByText(/Update/i));
    });
    await waitFor(() => {
        expect(getByText("url.com")).toBeInTheDocument();
        expect(queryByText("Update")).not.toBeInTheDocument();
    });
});

test("renders keyword correctly with status done", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock" }
        });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "done", urls: [] }
        });
    });

    const { getByPlaceholderText, getByText } = render(<Dashboard />);
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(getByText("value")).toBeInTheDocument();
        expect(getByText("DONE")).toBeInTheDocument();
        expect(getByText("show urls")).toBeInTheDocument();
    });
});

test("click to render more urls with status done", async () => {
    getIdMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({ data: { id: "mock" } });
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
        return Promise.resolve({
            data: { id: "mock", status: "done", urls: ["url.com"] }
        });
    });
    const { getByPlaceholderText, getByText, queryByText } = render(
        <Dashboard />
    );
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
        target: { value: "value" }
    });
    act(() => {
        fireEvent.click(screen.getByText(/Search/i));
    });
    await waitFor(() => {
        expect(getByText("value")).toBeInTheDocument();
        expect(getByText("DONE")).toBeInTheDocument();
        expect(getByText("show urls")).toBeInTheDocument();
    });

    // Click to expand to show URLS
    act(() => {
        fireEvent.click(screen.getByText(/show urls/i));
    });
    expect(getByText("hide urls")).toBeInTheDocument();
    expect(getByText("url.com")).toBeInTheDocument();

    // Update Button will not be displayed
    expect(queryByText("Update")).not.toBeInTheDocument();
});
