
import express from "express";

import {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
} from "../controllers/productController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminauth.js";

const productRouter = express.Router();


// ==========================================
// ADD PRODUCT
// POST /api/product/add
// ==========================================
productRouter.post(
  "/add",
  adminAuth,
  upload,
  addProduct
);


// ==========================================
// REMOVE PRODUCT
// POST /api/product/remove
// ==========================================
productRouter.post(
  "/remove",
  adminAuth,
  removeProduct
);


// ==========================================
// GET SINGLE PRODUCT
// GET /api/product/single/:productId
// ==========================================
productRouter.get(
  "/single/:productId",
  singleProduct
);


// ==========================================
// GET ALL PRODUCTS
// GET /api/product/list
// ==========================================
productRouter.get(
  "/list",
  listProduct
);


export default productRouter;

