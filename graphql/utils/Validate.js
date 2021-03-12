let types = {
  email: str => {
    return str != "";
  },
  phone: str => {
    return str != "";
  }
}

module.exports = function (type, str) {
  return new new Promise(function(resolve, reject) {
    if (types[type] === 'undefined')
        reject("Undefined validation type: " + type);
    else if (str === null)
        resolve(false);
    else
        resolve(types[type](str));
  });
}
