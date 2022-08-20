const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env'})

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')

  if(!authHeader){
    return next()
  }

  // Obtener token
  const token = authHeader.split(' ')[1]

  // Comprobar
  const usuario = jwt.verify(token, process.env.SECRETA)
  req.usuario = usuario
  
  return next()
}