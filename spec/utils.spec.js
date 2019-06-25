const { expect } = require("chai");
const { formatDate, makeRefObj, formatComments } = require("../db/utils/utils");

describe("formatDate", () => {
  it("returns new empty array when given empty array", () => {
    const input = [];
    expect(formatDate(input)).to.eql([]);
  });
  it("returns single-element array of one object, with the value corrected at specific 'created_at' key", () => {
    const input = [{ created_at: 1542284514171 }];
    expect(formatDate(input)).to.eql([
      { created_at: "Thu, 15 Nov 2018 12:21:54 GMT" }
    ]);
  });
  it("returns multiple-element array, with the value corrected at specific 'created_at' key", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    expect(formatDate(input)).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "Thu, 15 Nov 2018 12:21:54 GMT",
        votes: 100
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "Wed, 17 Nov 2010 12:21:54 GMT"
      }
    ]);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when given an empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("When given a single element array of object (with keys of article_id & title); function returns a key of an item's title with the value being its article_id", () => {
    expect(makeRefObj([{ article_id: 1, title: "A" }])).to.eql({ A: 1 });
  });
  it("When given a multi-element array of objects (with keys of article_id & corresponding title); the function returns an object. The object has a keys of item(s) titles with the value being its associated article_id", () => {
    expect(
      makeRefObj([{ article_id: 1, title: "A" }, { article_id: 2, title: "B" }])
    ).to.eql({ A: 1, B: 2 });
  });
});

describe("formatComments", () => {
  it("returns an empty array when given an empty array of comment", () => {
    let comments = [];
    expect(formatComments(comments)).to.eql([]);
  });
  it("returns original array of objects with 2 key names changed. First key name to change: created_by to author. Second key name to change: belongs_to to article_id", () => {
    let comments = [
      {
        body: "The owls are not what they seem.",
        belongs_to: "B",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389
      }
    ];
    let articleRef = { B: 2 };
    expect(formatComments(comments, articleRef)).to.eql([
      {
        body: "The owls are not what they seem.",
        article_id: 2,
        author: "icellusedkars",
        votes: 20,
        created_at: "Mon, 26 Nov 2001 12:36:03 GMT"
      }
    ]);
  });
  it("value of article_id corresponds to original title value provided", () => {
    let comments = [
      {
        body: "The owls are not what they seem.",
        belongs_to: "B",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389
      }
    ];
    let articleRef = { B: 2 };
    expect(formatComments(comments, articleRef)).to.eql([
      {
        body: "The owls are not what they seem.",
        article_id: 2,
        author: "icellusedkars",
        votes: 20,
        created_at: "Mon, 26 Nov 2001 12:36:03 GMT"
      }
    ]);
  });
});
