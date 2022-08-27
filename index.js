const express = require('express')
const conectarDB = require('./config/db')
const cors = require('cors'
)
// Creación del servidor
const app = express()

// Conectar a base de datos
conectarDB()

// Habilitar cors
const opcionesCors = {
  origin: process.env.FRONT_END
}
app.use( cors(opcionesCors) )

// Puerto de la app
const port = process.env.PORT || 4000

// Habilitar lectura de valores
app.use(express.json())

// Definir carpeta publica
app.use(express.static('uploads'))

// Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/enlaces', require('./routes/enlaces'))
app.use('/api/archivos', require('./routes/archivos'))

// Arrancar la app
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port}`)
})