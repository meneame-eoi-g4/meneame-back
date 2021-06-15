'use strict'

const express = require('express')
const router = express.Router()
const authMiddleware = require('../modules/authenticator')
const onlyRegisteredAccess = authMiddleware(true, ['user', 'admin'])
const onlyUserAccess = authMiddleware(true, ['user'])
const onlyAdminAccess = authMiddleware(true, ['admin'])

const valorationModel = require('../models/ComentsModel')

const userModel = require('../models/UserModel')


router.route('/valorations')
  .get(async (req, res) => {
    try {
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 50
      const filterParams = {}

    
      const valorationList = await valorationModel.find(filterParams).sort({ created_at: 'DESC' }).limit(limit).exec()

      res.json(valorationList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .post( async (req, res) => {
    try {
      let newArticle = req.body

      

      newArticle = await new valorationModel(newArticle).save()

      res.status(201).json(newArticle)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
 

router.route('/orders/:orderId')
  .get(onlyRegisteredAccess, async (req, res) => {
    try {
      const orderId = req.params.orderId
      const filterParams = {_id: orderId}

      //sólo permitimos obtener el pedido al usuario
      if(req.tokenData.profile === 'user'){
        filterParams['user._id'] = req.tokenData._id
      }

      //const foundOrder = await orderModel.findById(orderId).exec()
      const foundOrder = await orderModel.findOne(filterParams).exec()

      if (!foundOrder) {
        res.status(404).json({ message: `Pedido con id ${orderId} no encontrado.` })
        return
      }

      res.json(foundOrder)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .put(onlyAdminAccess, async (req, res) => {
    const orderData = req.body
    const orderId = req.params.orderId

    let foundOrder = await orderModel.findById(orderId)

    if (!foundOrder) {
      res.status(404).json({ message: `Pedido con id ${orderId} no encontrado.` })
      return
    }

    if (foundOrder.status !== 'pending') {
      res.status(409).json({ message: `Pedido con id ${orderId} ya no puede ser editado.` })
      return
    }

    //array temporal para almacenar los productos que estoy preparando para su guardado
    let preparedProducts = []
    foundOrder.total = 0

    //hemos simplificado el map con un for...in con los siguientes objetivos:
    //1. Poder cortar la ejecución del middleware inmediatamente
    //2. Evitar complicar mucho el código por consideraciones en el código cuando usamos map (await dentro de un map es un code smelt)
    for (const key in orderData.products) {
      const product = orderData.products[key]

      //comprobamos que el id coincide con el producto que nos quieren comprar y que está activo en nuestra db
      const foundProduct = await productModel.findOne({ _id: product.id, enabled: true }).exec()

      //si no se encuentra devolvemos inmediatamente error
      if (!foundProduct) {
        res.status(404).json({ message: `Producto con id ${product.id} no encontrado.` })
        return
      }

      //incrementamos el total para sumar los subtotales de los productos
      foundOrder.total += (foundProduct.price * product.qty)

      //preparamos el objeto según nuestro schema de pedidos
      // he agregado la categoría por si en un futuro quisieramos sacar estadísticas de pedidos por categoría
      preparedProducts.push({
        _id: foundProduct._id,
        title: foundProduct.title,
        price: foundProduct.price,
        image: foundProduct.image,
        category: foundProduct.category,
        qty: product.qty,
        subtotal: (foundProduct.price * product.qty)
      })
    }

    //sustituyo productos recibidos por la información ya preparada (como hemos definido en nuestro schema)
    foundOrder.products = preparedProducts

    //4. calcular subtotales y totales del pedido

    if (foundOrder.total === 0) {
      res.status(409).json('El pedido no puede tener de total 0.')
      return
    }

    //registra nuevamente el estado pending para que quede constancia de un cambio del pedido (aunque no haya cambiado el estado)
    foundOrder.tracking.push(
      {
        status: 'pending'
      }
    )

    //actualizo el elemento (se que ya existe previamente)
    const updatedItem = await orderModel.updateOne({ _id: orderId }, foundOrder, { new: true })

    res.json(foundOrder)
  })

router.route('/orders/:orderId/states')
  .put(onlyAdminAccess, async (req, res) => {
    const statusData = req.body
    const orderId = req.params.orderId

    //validamos mínimamente que lleguen los datos que necesidamos en el cuerpo (propiedad status)
    if (!statusData.hasOwnProperty('status')) {
      res.status(400).json({ message: `No se ha especificado el nuevo estado del pedido.` })
      return
    }

    //buscamos el pedido
    let foundOrder = await orderModel.findById(orderId).exec()

    if (!foundOrder) {
      res.status(404).json({ message: `Pedido con id ${orderId} no encontrado.` })
      return
    }

    //no permitimos que se hagan cambios de estado sobre pedidos ya entregados o cancelados
    if (foundOrder.status === 'canceled' || foundOrder.status === 'delivered') {
      res.status(400).json({ message: `Pedido con id ${orderId} no puede cambiarse de estado ya que está marcado como ${foundOrder.status}.` })
      return
    }

    //cambiamos estado del pedido
    foundOrder.status = statusData.status

    //creamos nuevo estado para tracking (fecha se asigna automáticamente según schema)
    //si nos pasaron un valor no permitido en status lo valida aquí
    const newStatus = {
      status: statusData.status,
      created_at: new Date()
    }

    //añadimos el estado a tracking
    foundOrder.tracking.push(newStatus)

    //actualizamos pedido en mongo
    const updatedItem = orderModel.updateOne({ _id: orderId }, foundOrder).exec()

    res.json(newStatus)
  })

module.exports = router