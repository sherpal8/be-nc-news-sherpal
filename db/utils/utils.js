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

exports.formatComments = (comments, articleRef) => {};
