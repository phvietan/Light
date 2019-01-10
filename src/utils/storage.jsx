function getFromStorage(key) {
  if (!key) return null;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    return null;
  }
}

function deleteFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {}
}

function setToStorage(key, obj) {
  if (!key) return null;
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  setToStorage,
  getFromStorage,
  deleteFromStorage,
};
