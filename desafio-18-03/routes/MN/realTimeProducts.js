import express from 'express';
import { ProductManager } from '../../src/dao/fs/ProductManager.js';

const router = express.Router()

const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', {
        products
    });
});

export default router