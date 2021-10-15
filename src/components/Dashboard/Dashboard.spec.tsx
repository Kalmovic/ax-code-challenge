import {render, screen, fireEvent, act, waitFor} from '@testing-library/react'
import Dashboard from "."
import "@testing-library/jest-dom/extend-expect";

jest.mock("../../services/api")

const getKeywordResultMock = require("../../services/api").getKeywordResult;
const getIdMock = require("../../services/api").getId;

test('dashboard renders correctly', () => {
  render(<Dashboard />);
});

test('input keyword incorrectly with less than 4 characters', async () => {
  const { getByPlaceholderText, getByText, queryByText } = render(<Dashboard />);
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
      target: { value: "val" }
    });
    act(() => {
    fireEvent.click(screen.getByText(/Search/i));
  });
    await waitFor(() => {
      expect(getByText("Keyword must have more than 3 characters")).toBeInTheDocument();
    }) 
})

test('input keyword incorrectly with more than 32 characters', async () => {
  const { getByPlaceholderText, getByText, queryByText } = render(<Dashboard />);
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
      target: { value: "valuewaaaaaaaaaytoobigtobeaccepted" }
    });
    act(() => {
    fireEvent.click(screen.getByText(/Search/i));
  });
    await waitFor(() => {
      expect(getByText("Keyword must have less than 33 characters")).toBeInTheDocument();
    }) 
})

test('remove error from screen after correct input', async () => {
  getIdMock.mockImplementation((): Promise<any> => {
    return Promise.resolve(
      {data: {id: 'mock'}}
    );
  });
  getKeywordResultMock.mockImplementation((): Promise<any> => {
    return Promise.resolve({
      data: {id: 'mock', status: 'active', urls: []}
    });
  });
  
  const { getByPlaceholderText, getByText, queryByText } = render(<Dashboard />);
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
      target: { value: "valuewaaaaaaaaaytoobigtobeaccepted" }
    });
    act(() => {
    fireEvent.click(screen.getByText(/Search/i));
  });
    await waitFor(() => {
      expect(getByText("Keyword must have less than 33 characters")).toBeInTheDocument();
    }) 
    fireEvent.change(getByPlaceholderText("Search for keywords"), {
      target: { value: "value" }
    });
    act(() => {
    fireEvent.click(screen.getByText(/Search/i));
  });
  await waitFor(() => {
    expect(queryByText("Keyword must have less than 33 characters")).not.toBeInTheDocument();
  }) 
})

  test('renders keyword correctly', async () => {
    getIdMock.mockImplementation((): Promise<any> => {
      return Promise.resolve(
        {data: {id: 'mock'}}
      );
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
      return Promise.resolve({
        data: {id: 'mock', status: 'active', urls: []}
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
    }) 
  });

  test('expand to show urls correctly', async () => {
    getIdMock.mockImplementation((): Promise<any> => {
      return Promise.resolve(
        {data: {id: 'mock'}}
      );
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
      return Promise.resolve({
        data: {id: 'mock', status: 'active', urls: ["url.com", "url2.com"]}
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
    }) ;

    // Click to expand to show URLS
    act(() => {
      fireEvent.click(screen.getByText(/show urls/i));
    });
    expect(getByText("hide urls")).toBeInTheDocument();
    expect(getByText("url.com")).toBeInTheDocument();
    expect(getByText("url2.com")).toBeInTheDocument();
  });

  test('expand to show empty urls correctly', async () => {
    getIdMock.mockImplementation((): Promise<any> => {
      return Promise.resolve(
        {data: {id: 'mock'}}
      );
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
      return Promise.resolve({
        data: {id: 'mock', status: 'active', urls: []}
      });
    });
    const { getByPlaceholderText, getByText, queryByText } = render(<Dashboard />);
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
    }) ;

    // Click to expand to show URLS
    act(() => {
      fireEvent.click(screen.getByText(/show urls/i));
    });
    expect(getByText("hide urls")).toBeInTheDocument();
    expect(getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
    // Click to hide URLS

    act(() => {
      fireEvent.click(screen.getByText(/hide urls/i));
      
    });
    expect(getByText("show urls")).toBeInTheDocument();
    expect(queryByText("Nenhum resultado encontrado.")).not.toBeInTheDocument();
  });

  test('click to render more urls', async () => {
    getIdMock.mockImplementation((): Promise<any> => {
      return Promise.resolve(
        {data: {id: 'mock'}}
      );
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
      return Promise.resolve({
        data: {id: 'mock', status: 'active', urls: []}
      });
    });
    const { getByPlaceholderText, getByText, queryByText } = render(<Dashboard />);
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
    }) ;

    // Click to expand to show URLS
    act(() => {
      fireEvent.click(screen.getByText(/show urls/i));
    });
    expect(getByText("hide urls")).toBeInTheDocument();
    expect(getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
    expect(getByText("Check Again")).toBeInTheDocument();
    // Click to hide URLS
    getKeywordResultMock.mockImplementation((): Promise<any> => {
      return Promise.resolve({
        data: {id: 'mock', status: 'active', urls: ["url.com"]}
      });
    });
    act(() => {
      fireEvent.click(screen.getByText(/Check Again/i));
    });
    await waitFor(() => {
      expect(getByText("url.com")).toBeInTheDocument();
    });
  });

  test('status change to done', async () => {
    getIdMock.mockImplementation((): Promise<any> => {
      return Promise.resolve(
        {data: {id: 'mock'}}
      );
    });
    getKeywordResultMock.mockImplementation((): Promise<any> => {
      return Promise.resolve({
        data: {id: 'mock', status: 'active', urls: []}
      });
    });
    const { getByPlaceholderText, getByText, queryByText } = render(<Dashboard />);
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
    }) ;

    // Click to expand to show URLS
    act(() => {
      fireEvent.click(screen.getByText(/show urls/i));
    });
    expect(getByText("hide urls")).toBeInTheDocument();
    expect(getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
    expect(getByText("Check Again")).toBeInTheDocument();
    // Click to hide URLS
    getKeywordResultMock.mockImplementation((): Promise<any> => {
      return Promise.resolve({
        data: {id: 'mock', status: 'done', urls: ["url.com"]}
      });
    });
    act(() => {
      fireEvent.click(screen.getByText(/Check Again/i));
    });
    await waitFor(() => {
      expect(getByText("url.com")).toBeInTheDocument();
    expect(queryByText("Check Again")).not.toBeInTheDocument();

    });
  });

test('renders keyword correctly with status done', async () => {
  getIdMock.mockImplementation((): Promise<any> => {
    return Promise.resolve({
      data: {id: 'mock'}
    });
  });
  getKeywordResultMock.mockImplementation((): Promise<any> => {
    return Promise.resolve({
      data: {id: 'mock', status: 'done', urls: []}
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
  }) 
});

test('click to render more urls with status done', async () => {
  getIdMock.mockImplementation((): Promise<any> => {
    return Promise.resolve(
      {data: {id: 'mock'}}
    );
  });
  getKeywordResultMock.mockImplementation((): Promise<any> => {
    return Promise.resolve({
      data: {id: 'mock', status: 'done', urls: ["url.com"]}
    });
  });
  const { getByPlaceholderText, getByText, queryByText } = render(<Dashboard />);
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
  }) ;

  // Click to expand to show URLS
  act(() => {
    fireEvent.click(screen.getByText(/show urls/i));
  });
  expect(getByText("hide urls")).toBeInTheDocument();
  expect(getByText("url.com")).toBeInTheDocument();

  // Check Again Button will not be displayed
  expect(queryByText("Check Again")).not.toBeInTheDocument();
});