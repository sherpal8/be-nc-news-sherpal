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
  // end-point: /api/topics
  describe("End-point: /api/topics", () => {
    // GET
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
      // 405 error handling for this particular end-point
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
  });
  // end-point: /api/users/:username
  describe("End-point: /api/users/:username", () => {
    // GET
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
      // 405 error handling for this particular end-point
      it("Error 405: Invalid methods", () => {
        const invalidMethods = ["put", "patch", "post", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/users/rogersop")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  // end-point: /api/articles/:article_id
  describe("End-point: /api/articles/:article_id", () => {
    // GET
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
      it("404 returned when parametric value entered does not exist in data to allow for page retrieval", () => {
        return request
          .get("/api/articles/300")
          .expect(404)
          .then(({ body: { msg } }) =>
            expect(msg).to.equal("Page does not exist")
          );
      });
    });
    // PATCH
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
      it("Status 400 for posting invalid value in the body", () => {
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
    // 405 error handling - invalid methods
    describe("Invalid methods", () => {
      it("405 returned for invalid methods for this end-point", () => {
        const invalidMethods = ["put", "post", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/articles/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  // end-point: /api/articles/:article_id/comments
  describe("End-point: /api/articles/:article_id/comments", () => {
    // POST for /api/articles/:article_id/comments
    describe("POST at /api/articles/:article_id/comments", () => {
      it("201 status when successful POST made", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: "rogersop", body: "Hey ya'll" })
          .expect(201);
      });
      it("201 returns an object with key and values of updated comment entry", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: "rogersop", body: "Hey ya'll" })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).to.eql({
              comment_id: 2,
              author: "rogersop",
              article_id: 1,
              votes: 14,
              created_at: "2016-11-22T12:36:03.000Z",
              body: "Hey ya'll"
            });
          });
      });
      // error handling
      it("400 error if article id is not a number", () => {
        return request
          .post("/api/articles/b/comments")
          .send({ username: "rogersop", body: "hey" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("404 returned if article_id does not exist", () => {
        return request
          .post("/api/articles/100/comments")
          .send({ username: "rogersop", body: "Hey ya'll" })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Page does not exist");
          });
      });
      xit("422 error if request body object contains unknown alien keys", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ unknownKey1: "rogersop", unknownKey2: "Hey" })
          .expect(422)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Unprocessable entity");
          });
      });
    });
    // GET method for /api/articles/:article_id/comments
    describe("GET at /api/articles/:article_id/comments", () => {
      it("GET returns a 200", () => {
        return request.get("/api/articles/1/comments").expect(200);
      });
      it("GET returns an array of articles", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(Array.isArray(comments)).is.equal(true);
          });
      });
      it("GET returns an array of articles, of which each commment/object should have following properties", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments[0]).has.keys(
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body"
            );
          });
      });
      // Queries for end-point /api/articles/:article_id/comments?sort_by=""&order=""
      describe("Query and relevant tests", () => {
        // Query 1: sort_by
        it("GET accepts sort_by query, which sorts articles by any valid column. Order defaults to descending. For ease of this test, ascending order given", () => {
          const columnOptions = [
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          ];
          const columnMethods = columnOptions.map(column => {
            return request
              .get(`/api/articles/1/comments?sort_by=${column}&order=asc`)
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.sortedBy(`${column}`);
              });
          });
          return Promise.all(columnMethods);
        });
        // Query 2: order
        it("GET accepts order query. sort_by defaults to created_at", () => {
          return request
            .get(`/api/articles/1/comments?order=asc`)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("created_at");
            });
        });
        // Use * to.not.be.sortedBy * when order left to default to descending
        it("Test order defaults to descending", () => {
          return request
            .get(`/api/articles/1/comments?sort_by=""&order=""`)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.not.be.sortedBy("created_at");
            });
        });
        // error handling for bad queries
        it("When unknown alien query key inserted i.e. undefined, sort_by defaults to column of created_at", () => {
          return request
            .get(`/api/articles/1/comments?sortBubbles=yoyo&order=asc`)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("created_at");
            });
        });
      });
    });
    // 405: invalid methods for /api/articles/:article_id/comments
    describe("405 for /api/articles/:article_id/comments", () => {
      it("Returns error 405 if invalid method requested", () => {
        const invalidMethods = ["put", "patch", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/articles/1/comments")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  // end-point: /api/articles
  describe("End-point: /api/articles", () => {
    it("GET with 200", () => {
      return request.get("/api/articles").expect(200);
    });
    it("GET returns an array of article objects", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).to.equal(true);
        });
    });
    it("GET accepts queries", () => {
      const queryList = ["author", "topic", "sort_by", "order"];
      const queryPromises = queryList.map(query => {
        return request
          .get(`/api/articles?${query}`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(Array.isArray(articles)).to.equal(true);
          });
      });
      return Promise.all(queryPromises);
    });
    // error 405 handler
    it("405 for invalid methods for end-point /api/articles", () => {
      const invalidMethodList = ["delete", "patch", "put", "post"];
      const methodPromises = invalidMethodList.map(method => {
        return request[method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
});
