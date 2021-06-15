
const express = require('express')
const database = require('./modules/database')
const bearerToken = require('express-bearer-token');
const cors = require("cors");

//middlewares con las rutas
const indexController = require('./controllers/IndexController')
const jobController = require('./controllers/JobsController')
const messagesController = require('./controllers/MessagesController')
const usersController = require('./controllers/UsersController')
const authController = require('./controllers/AuthController')
const valorationsController= require('./controllers/ValorationsController')

//server instance
const app = express() 

app.use(bearerToken())
app.use(cors())

//middleware para parsear los cuerpos tipo application/JSON en el cuerpo
app.use(express.json())

//enganchamos los controladores de los diferentes recursos
app.use(indexController)
app.use(jobController)
app.use(messagesController)
app.use(usersController)
app.use(authController)
app.use(valorationsController)

database.connect()

module.exports = app
