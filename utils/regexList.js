const emailRegex = new RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

const onlyLetters = new RegExp('^[A-Za-z]+$');

module.exports = {
  emailRegex,
  onlyLetters
};
