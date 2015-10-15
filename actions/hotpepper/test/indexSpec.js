import assert        from "power-assert";
import nock          from "nock";
import mockContext   from "aws-lambda-mock-context";

import handler        from "../src/index";
import mockEvent      from "./fixtures/event";
import mockResponse1  from "./fixtures/response1";
import mockResponse2  from "./fixtures/response2";
import mockResponse3  from "./fixtures/response3";
import mockResponse4  from "./fixtures/response4";
import mockResponse5  from "./fixtures/response5";
import mockResponseRange2Limit20  from "./fixtures/response2-20";

import {HOST, PATH, API_KEY} from "../src/constants";

const LAT = 35.7126775;
const LNG = 139.7598003;

describe("Hotpepper API wrapper", () => {

  beforeEach(() => {
    nock.disableNetConnect();
    const defaultParams = {
      key: API_KEY,
      format: "json",
      datum: "world",
      lat: LAT,
      lng: LNG,
      limit: 10,
      offset: 0
    };

    [mockResponse1, mockResponse2, mockResponse3, mockResponse4, mockResponse5].forEach((res, i) => {
      nock(HOST)
        .get(PATH.gourmet)
        .query(Object.assign({}, defaultParams, {range: i + 1}))
        .reply(200, res);
    });

    nock(HOST)
      .get(PATH.gourmet)
      .query(Object.assign({}, defaultParams, {range: 2, limit: 20, offset: 0}))
      .reply(200, mockResponseRange2Limit20);
  });

  it("requests with range=300", (done) => {
    const query = {
      lat: LAT,
      lng: LNG,
      range: 300,
      limit: 10,
      offset: 0
    }

    handler(mockEvent(query), mockContext());
    const mockShops = mockResponse1.results.shop;

    mockContext.Promise
      .then((result) => {
        assert(result.length === 3);
        assert(result[0].name       === mockShops[0].name);
        assert(result[0].lat        === mockShops[0].lat);
        assert(result[0].lng        === mockShops[0].lng);
        assert(result[0].hours      === mockShops[0].open);
        assert(result[0].closed     === mockShops[0].close);
        assert(result[0].budget     === mockShops[0].budget.name);
        assert(result[0].categories.toString() === [mockShops[0].food.name].toString());
        assert(result[2].categories.toString() === [mockShops[2].food.name, mockShops[2].sub_food.name].toString());
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("requests with range=500", (done) => {
    const query = {
      lat: LAT,
      lng: LNG,
      range: 500,
      limit: 10,
      offset: 0
    };

    handler(mockEvent(query), mockContext());

    mockContext.Promise
      .then((result) => {
        assert(result.length === 10);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("requests with range=500 and limit=20", (done) => {
    const query = {
      lat: LAT,
      lng: LNG,
      range: 500,
      limit: 20,
      offset: 0
    }

    handler(mockEvent(query), mockContext());

    mockContext.Promise
      .then((result) => {
        assert(result.length === 20);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("requests with range=450 and limit=20", (done) => {
    const query = {
      lat: LAT,
      lng: LNG,
      range: 450,
      limit: 20,
      offset: 0
    }

    handler(mockEvent(query), mockContext());

    mockContext.Promise
      .then((result) => {
        assert(result.length === 12);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
