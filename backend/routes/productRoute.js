import express from 'express';
import { getProducts, getFilteredProducts, updatePrice, addProduct, addFromJson, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get("/", getProducts);

router.get("/reset", addFromJson);

router.post("/", getFilteredProducts);

router.post("/addProduct", addProduct);

router.put("/", updatePrice);

router.delete("/:id", deleteProduct);

export default router;