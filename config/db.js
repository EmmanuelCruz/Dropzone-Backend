const mongoose = require('mongoose')
require('dotenv').config({ path: 'variables.env' })

const conectarDB = async () => {
  try {
    console.log("URL DB",process.env.DB_URL )
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('Conectado a la base de datos')
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
}

module.exports = conectarDB