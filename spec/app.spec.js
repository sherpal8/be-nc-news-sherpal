process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const { app } = require("../app.js");
const request = require("supertest")(app);
const connection = require("../connection");
chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  describe("GET: /api/topics", () => {
    it("GET responds with 200", () => {
      return request.get("/api/topics").expect(200);
    });
  });
});
