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

  const { password, nombre_archivo } = req.body

  const enlace = new Enlaces()
  enlace.url = shortid.generate()
  enlace.nombre = shortid.generate()
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

// Obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {

  // Verificar si existe
  const enlaces = await Enlaces.findOne({url: req.params.url})

  if(!enlaces){
    res.status(404).json({msg:'Este enlace no existe'})
    return next()
  }

  // Si existe

  res.json({archivo: enlaces.nombre})

  // si las descargas son igual a 1, se borra la entrada y se borra el archivo
  const { descargas, nombre } = enlaces

  if(descargas === 1){
    req.archivo = nombre

    // Eliminar el archivo de la base
    await Enlaces.findOneAndRemove(req.params.url)

    next()
  } else{
    enlaces.descargas--
    await enlaces.save()
  }

  // Si es distinto de 1. Se disminiye la cantidad de descargas
}