import express from 'express';
import productManager from '../controllers/products.controllers.js';

const router = express.Router()

router.get('/', async (req, res) => {
    const products =  productManager.getProducts();
    res.render('realTimeProducts', {
        products
    });
});

export default router