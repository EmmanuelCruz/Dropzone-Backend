const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env'})
const { validationResult } = require('express-validator')

exports.autenticarUsuario = async (req, res, next) => {

  // Mensajes de error
  const errores = validationResult(req)
  if(!errores.isEmpty()){
    res.status(404).json({errores: errores.errors[0]})
  }

  // Buscar usuario
  const {email, password} = req.body
  const usuario = await Usuario.findOne({email})

  if(!usuario){
    res.status(404).json({msg: 'El usuario no existe'})
    return next()
  }

  // Verificar usuario
  if(!bcrypt.compareSync(password, usuario.password)){
    res.status(401).json({msg: 'La contraseña es incorrecta'})
    return next()
  }

  // Se crea un JWToken
  const token = jwt.sign({
    id: usuario._id,
    nombre: usuario.nombre,
  }, process.env.SECRETA, {
    expiresIn: '8h'
  })

  return res.status(200).json({token})

}

exports.usuarioAutenticado = async (req, res, next) => {
  res.json({usuario: req.usuario})
}