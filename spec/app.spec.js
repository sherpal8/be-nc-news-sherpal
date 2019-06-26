process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const { app } = require("../app.js");
const request = require("supertest")(app);
const connection = require("../connection");
chai.use(chaiSorted);

describe("/api", () => {
  // 404 when no route found
  it("Error 404 when no route found", () => {
    return request
      .get("/api/bananas")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).to.equal("Page does not exist");
      });
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  // GET:  /api/topics
  describe("GET: /api/topics", () => {
    it("GET responds with 200", () => {
      return request.get("/api/topics").expect(200);
    });
    it("GET returns an object with the key of 'topics' containing a value of an array of objects", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body: { endObject: { topics } } }) => {
          expect(topics).to.be.an("array");
        });
    });
    it("Test that element of array contains specified keys", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body: { endObject: { topics } } }) => {
          expect(topics[0]).to.contain.keys("slug", "description");
          expect(topics[0].slug).to.equal("mitch");
        });
    });
    it("Test specific key value", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body: { endObject: { topics } } }) => {
          expect(topics[0].slug).to.equal("mitch");
        });
    });
    // 405 error handling for this end-point
    it("Error 405: Invalid methods", () => {
      const invalidMethods = ["put", "patch", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  // GET: /api/users/:username
  describe("GET: /api/users/:username", () => {
    it("GET responds with 200", () => {
      return request.get("/api/users/rogersop").expect(200);
    });
    it("GET returns an object", () => {
      return request
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.be.an("object");
        });
    });
    it("Test that element of array contains specified keys", () => {
      return request
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.contain.keys("username", "avatar_url", "name");
          expect(user.name).to.equal("paul");
        });
    });
    // error 404
    it("404 returned when parametric value does not match data", () => {
      return request.get("/api/users/ballerina").expect(404);
    });
  });
  // GET: /api/articles/:article_id
  describe("GET: /api/articles/:article_id", () => {
    it("GET responds with a 200", () => {
      return request.get("/api/articles/1").expect(200);
    });
    it("GET returns an object", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.be.an("object");
        });
    });
    it("Test that returned object of the single-element array contains specified keys", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    // error handling 400 for GET: /api/articles/:article_id
    it("400 returned when non-compatible parametric value entered e.g. string instead of a number", () => {
      return request
        .get("/api/articles/bubba")
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).to.equal("Bad request"));
    });
    // error handling 404 for GET: /api/articles/:article_id
    it("404 returned when parametric value enter does not contain data", () => {
      return request
        .get("/api/articles/300")
        .expect(404)
        .then(({ body: { msg } }) =>
          expect(msg).to.equal("Page does not exist")
        );
    });
  });
  // PATCH: /api/articles/:article_id
  describe("PATCH: /api/articles/:article_id", () => {
    it("PATCH responds with status 200 & data is updated", () => {
      const newVote = 11;
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: newVote })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(111);
        });
    });
    // error handling for PATCH above: /api/articles/:article_id
    it.only("Status 400 for posting invalid value in the body", () => {
      const newVote = "number";
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: newVote })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad request");
        });
    });
  });
});
