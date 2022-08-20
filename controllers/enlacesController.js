const Enlaces = require('../models/Enlace')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

exports.nuevoEnlace = async (req, res, next) => {

  // Mensajes de error
  const errores = validationResult(req)
  if(!errores.isEmpty()){
    res.status(404).json({errores: errores.array()})
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