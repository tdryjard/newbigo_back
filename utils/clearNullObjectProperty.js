module.exports = function clearAllObjectPropertiesThatAreNull(obj) {
  const objectToCheck = obj;
  Object.entries(objectToCheck).forEach(property => {
    const [key, value] = property;
    if (value === null) delete objectToCheck[key];
  });
  return obj;
};
