function isContainUndefined(array) {
  return array.findIndex(value => !value) !== -1;
}

module.exports = {
  isContainUndefined,
};
