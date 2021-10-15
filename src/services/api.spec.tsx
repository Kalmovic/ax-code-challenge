import * as api from './api';

jest.mock("./api")

const getKeywordResultMock = require("./api").getKeywordResult;
const getIdMock = require("./api").getId;

test("call getId", async () => {
  getIdMock.mockImplementation((): Promise<any> => {
    return Promise.resolve(
      {data: {id: 'mock'}}
    );
  });

  const response = await api.getId("mock");

  expect(response).toEqual({"data": {"id": "mock"}});
});

test("call getKeywordResult", async () => {
  getKeywordResultMock.mockImplementation((): Promise<any> => {
    return Promise.resolve({id: 'mock', status: 'active', urls: []}
  )});

  const response = await api.getKeywordResult("mock");

  expect(response).toEqual({id: 'mock', status: 'active', urls: []});
});
