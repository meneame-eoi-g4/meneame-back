'use strict'

const express = require('express')
const nunjucks = require('nunjucks')
const database = require('./modules/database')
const bearerToken = require('express-bearer-token');
const cors = require("cors");

//middlewares con las rutas
const indexController = require('./controllers/IndexController')
const productController = require('./controllers/ProductsController')
const articleController = require('./controllers/ArticlesController')
const messagesController = require('./controllers/MessagesController')
const usersController = require('./controllers/UsersController')
const ordersController = require('./controllers/OrdersController')
const authController = require('./controllers/AuthController')

//server instance
const app = express()

app.use(bearerToken())
app.use(cors())

//configuramos nunjucks para renderizar las plantillas de email únicamente
nunjucks.configure('views', {
  autoescape: true,
  express: app
})

//middleware para parsear los cuerpos tipo application/JSON en el cuerpo
app.use(express.json())

//enganchamos los controladores de los diferentes recursos
app.use(indexController)
app.use(productController)
app.use(articleController)
app.use(messagesController)
app.use(usersController)
app.use(ordersController)
app.use(authController)

database.connect()

module.exports = app
