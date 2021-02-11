let jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function checkToken(req, res, next) {
  // Gather the jwt access token from the request header
  const token = req.headers['authorization']

  let result = false

  if (token == null) result = false

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if(err) console.log(err)
    if (err) result = false
    else return result = true
  })
  return result
}