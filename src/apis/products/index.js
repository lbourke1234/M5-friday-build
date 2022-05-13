import express from "express";
import {
  getProducts,
  writeProducts,
  getReviews,
  writeReviews,
} from "../../lib/fs-tools.js";
import {
  checkProductsSchema,
  productsValidationResult,
  reviewsValidationResult,
  checkReviewsSchema,
} from "./validation.js";
import uniqid from "uniqid";

const productsRouter = express.Router();

productsRouter.post(
  "/",
  checkProductsSchema,
  productsValidationResult,
  async (req, res, next) => {
    try {
      console.log("req body: ", req.body);
      const newProduct = {
        ...req.body,
        createdAt: new Date(),
        id: uniqid(),
      };
      console.log("new product: ", newProduct);
      const products = await getProducts();
      products.push(newProduct);
      await writeProducts(products);
      res.status(201).send({ id: newProduct.id });
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();
    console.log("products: ", products);
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();
    const foundProduct = products.find(
      (product) => product.id === req.params.productId
    );
    res.send(foundProduct);
  } catch (error) {
    next(error);
  }
});

productsRouter.put(
  "/:productId",
  checkProductsSchema,
  productsValidationResult,
  async (req, res, next) => {
    try {
      const products = await getProducts();
      const index = products.findIndex(
        (product) => product.id === req.params.productId
      );
      if (index !== -1) {
        const oldProduct = products[index];
        const updatedProduct = {
          ...oldProduct,
          ...req.body,
          updatedAt: new Date(),
        };
        products[index] = updatedProduct;
        await writeProducts(products);
        res.send(updatedProduct);
      }
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();
    const keptProducts = products.filter(
      (product) => product.id !== req.params.productId
    );
    await writeProducts(keptProducts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// -----------REVIEW PRODUCTS CRUD ---------

productsRouter.post(
  "/:productId/reviews",
  /*   checkReviewsSchema,
  reviewsValidationResult, */
  async (req, res, next) => {
    try {
      const products = await getProducts();
      const newReview = {
        ...req.body,
        updatedAt: new Date(),
        reviewId: uniqid(),
      };

      const findProduct = products.find(
        (product) => product.id === req.params.productId
      );
      if (findProduct) {
        findProduct.reviews.push(newReview);
        await writeProducts(products);
        res.send(newReview);
      }
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const products = await getProducts();
    const findProduct = products.find(
      (product) => product.id === req.params.productId
    );
    res.send(findProduct.reviews);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const products = await getProducts();
    const findProduct = products.find(
      (product) => product.id === req.params.productId
    );
    const findReview = findProduct.reviews.find(
      (review) => review.reviewId === req.params.reviewId
    );
    console.log("This is the Review:", findReview);
    console.log("This is the Product: ", findProduct);

    if (findProduct && findReview) {
      res.send(findReview);
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
