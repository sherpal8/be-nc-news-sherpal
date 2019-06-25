exports.formatDate = list => {
  if (list.length === 0) return [];
  return list.map(ele => {
    ele.created_at = new Date(ele.created_at).toUTCString();
    return ele;
  });
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
