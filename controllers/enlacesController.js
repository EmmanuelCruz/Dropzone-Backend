const Enlaces = require('../models/Enlace')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const Enlace = require('../models/Enlace')

exports.nuevoEnlace = async (req, res, next) => {

  // Mensajes de error
  const errores = validationResult(req)
  if(!errores.isEmpty()){
    return res.status(404).json({errores: errores.array()})
  }

  const { password, nombre_archivo, nombre } = req.body

  const enlace = new Enlaces()
  enlace.url = shortid.generate()
  enlace.nombre = nombre
  enlace.nombre_archivo = nombre_archivo

  // Si el usuario está identificado
  if(req.usuario){
    const { descargas } = req.body
    
    if(descargas){
      enlace.descargas = descargas
    }
    if(password){
      const salt = await bcrypt.genSalt(10)
      enlace.password = await bcrypt.hash(password, salt)
    }

    enlace.autor = req.usuario.id
  }

  try {
    await enlace.save()
    return res.status(200).json({msg: `${enlace.url}`})
  } catch (error) {
    console.error(error);
  }

}

exports.todosEnlaces = async (req, res, next) => {
  try {
    const enlaces = await Enlaces.find({}).select('url')
    res.json({enlaces})
  } catch (error) {
    console.error(error);
  }
}

// Obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {

  // Verificar si existe
  const enlaces = await Enlaces.findOne({url: req.params.url})

  if(!enlaces){
    res.status(404).json({msg:'Este enlace no existe'})
    return next()
  }

  // Si existe

  res.json({archivo: enlaces.nombre, password: false})

  next()
}

// Verificar si hay password
exports.tienePassword = async (req, res, next) => {
  // Verificar si existe
  const enlaces = await Enlaces.findOne({url: req.params.url})

  if(!enlaces){
    res.status(404).json({msg:'Este enlace no existe'})
    return next()
  }

  if(enlaces.password){
    res.json({password: true, enlace: enlaces.url})
  }

  next()
}

exports.verificarPassword = async (req, res, next) => {

  console.log(req.params)
  const { url } = req.params
  
  const enlace = await Enlaces.findOne({url})

  // Verificar el password
  
  const { password } = req.body
  if(bcrypt.compareSync(password, enlace.password)){
    next()
  } else {
    return res.status(401).json({msg: 'Password incorrecto'})
  }

  
}