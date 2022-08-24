const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')

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
    console.log(req.file)
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