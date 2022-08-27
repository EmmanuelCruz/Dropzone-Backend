const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
const Enlaces = require('../models/Enlace')

exports.subirArchivo = async(req, res, next) => {

  const configMulter = {
    limits : { fileSize :req.usuario === true ? 1024*1024*10 : 1024*1024 },
    storage: fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname='./uploads')
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
        cb(null, `${shortid.generate()}${extension}`)
      },
  
    })
  }

  const upload = multer(configMulter).single('archivo')

  upload(req, res, async (error) => {
    if(!error){
      res.json({archivo: req.file.filename})
    } else {
      console.error(error);
      return next()
    }
  })
}

exports.eliminarArchivo = async(req, res) => {
  try {
    fs.unlinkSync(__dirname=`./uploads/${req.archivo}`)
  } catch (error) {
    console.error(error )
  }
}

exports.descargar = async (req, res, next) => {

  const enlaces = await Enlaces.findOne({ nombre: req.params.archivo})

  const archivo = __dirname=`./uploads/${req.params.archivo}`
  res.download(archivo)

  // si las descargas son igual a 1, se borra la entrada y se borra el archivo
  const { descargas, nombre } = enlaces

  if(descargas === 1){
    req.archivo = nombre

    // Eliminar el archivo de la base
    await Enlaces.findOneAndRemove(enlaces.id)

    next()
  } else{
    enlaces.descargas--
    await enlaces.save()
  }

  // Si es distinto de 1. Se disminiye la cantidad de descargas
}