const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
  email: {
    type: String,
    requiere: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  nombre: {
    type: String,
    require: true,
    trim: true
  },
  password: {
    type: String,
    require: true,
    trim: true
  }
})

module.exports = mongoose.model('Usuarios', usuariosSchema)