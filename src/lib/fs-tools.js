import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { readJSON, writeFile, writeJSON } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data')

const productJSONPath = join(dataFolderPath, 'products.json')
const reviewsJSONPath = join(dataFolderPath, 'reviews.json')

const productsPublicFodlerPath = join(process.cwd(), './public/img/products')
const reviewsPublicFodlerPath = join(process.cwd(), './public/img/reviews')

export const getProducts = () => {
  return readJSON(productJSONPath)
}
export const getReviews = () => {
  return readJSON(reviewsJSONPath)
}
export const writeProducts = (productsArray) => {
  return writeJSON(productJSONPath, productsArray)
}
export const writeReviews = (ReviewsArray) => {
  return writeJSON(productJSONPath, ReviewsArray)
}