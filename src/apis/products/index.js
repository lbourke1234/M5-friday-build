import express from 'express'
import { getProducts, writeProducts } from '../../lib/fs-tools.js'
import { checkProductsSchema, productsValidationResult } from './validation.js'
import uniqid from 'uniqid'

const productsRouter = express.Router()

productsRouter.post(
  '/',
  checkProductsSchema,
  productsValidationResult,
  async (req, res, next) => {
    try {
      console.log('req body: ', req.body)
      const newProduct = {
        ...req.body,
        createdAt: new Date(),
        id: uniqid()
      }
      console.log('new product: ', newProduct)
      const products = await getProducts()
      products.push(newProduct)
      await writeProducts(products)
      res.status(201).send({ id: newProduct.id })
    } catch (error) {
      next(error)
    }
  }
)

productsRouter.get('/', async (req, res, next) => {
  try {
    const products = await getProducts()
    console.log('products: ', products)
    res.send(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.get('/:productId', async (req, res, next) => {
  try {
    const products = await getProducts()
    const foundProduct = products.find(
      (product) => product.id === req.params.productId
    )
    res.send(foundProduct)
  } catch (error) {
    next(error)
  }
})

productsRouter.put(
  '/:productId',
  checkProductsSchema,
  productsValidationResult,
  async (req, res, next) => {
    try {
      const products = await getProducts()
      const index = products.findIndex(
        (product) => product.id === req.params.productId
      )
      if (index !== -1) {
        const oldProduct = products[index]
        const updatedProduct = {
          ...oldProduct,
          ...req.body,
          updatedAt: new Date()
        }
        products[index] = updatedProduct
        await writeProducts(products)
        res.send(updatedProduct)
      }
    } catch (error) {
      next(error)
    }
  }
)

productsRouter.delete('/:productId', async (req, res, next) => {
  try {
    const products = await getProducts()
    const keptProducts = products.filter(
      (product) => product.id !== req.params.productId
    )
    await writeProducts(keptProducts)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default productsRouter
