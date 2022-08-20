const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

exports.nuevoUsuario = async(req, res) => {

  // Mensajes de error
  const errores = validationResult(req)
  if(!errores.isEmpty()){
    res.status(404).json({errores: errores.array()})
  }

  // Verificación de usuario registrado
  const { email, password } = req.body

  let usuarioEncontrado = await Usuario.findOne({email})

  if(usuarioEncontrado){
    return res.status(400).json({msg: 'El usuario ya está registrado'})
  }

  const usuario = new Usuario(req.body)
  
  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash(password, salt)
  try {
    await usuario.save()
  } catch (error) {
    console.error(error);
  }

  res.json({msg: 'Usuario creado correctamente'})
}