const regexValidity = require('./regexValidity');

module.exports = function verifyPassword(password, min, max) {

  if (min > password.length || password.length > max) {
    return {
      type: 'INPUT',
      inputs: ['password'],
      alert: {
        type: 'error',
        text: `Mot de passe invalide. (min: ${min} - max: ${max})`
      }
    };
  }

  return null;
};
