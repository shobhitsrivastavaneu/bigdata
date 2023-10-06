const ajvErrorParser = async (validationErrors) => {
  const errors = [];
  if (validationErrors) {
    validationErrors.forEach(({ params, keyword, message }) => {
      errors.push({
        param: params.missingProperty,
        key: keyword,
        message,
      });
    });
  }

  return errors;
};

module.exports = {
  ajvErrorParser,
};
