let jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async function checkToken(res, req) {
    
  let result = false

  const token = req.cookies.token

  if (token == null) result = false
  else{
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if(err) console.log(err)
      if (err) result = false
      else return result = true
    })
  }
  return result
}