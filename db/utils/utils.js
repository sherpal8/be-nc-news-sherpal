exports.formatDate = list => {
  return list.map(ele => {
    ele.created_at = new Date(ele.created_at).toUTCString();
    return ele;
  });
};

exports.makeRefObj = list => {
  let obj = {};
  for (let i = 0; i < list.length; i++) {
    let keyToBe = list[i].title;
    obj[keyToBe] = list[i].article_id;
  }
  return obj;
};

exports.formatComments = (comments, articleRef) => {
  // map through every element (object) in array
  return comments.map(comment => {
    return {
      body: comment.body,
      article_id: articleRef[comment.belongs_to],
      author: comment.created_by,
      votes: comment.votes,
      created_at: `${new Date(comment.created_at).toUTCString()}`
    };
  });
};
