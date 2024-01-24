import  express from 'express';
import { productManager } from '../src/app.js';

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts();
        if (!isNaN(limit) && limit > 0) {
            const showProducts = products.slice(0, limit)
            res.json(showProducts)
        } else {
            res.json(products)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);
        res.json( { status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await productManager.addProduct(product);
        
        res.json( { status: 'success', payload: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = req.body;
        const updatedProduct = await productManager.updateProduct(id, product);
        res.json( { status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const deletedProduct = await productManager.deleteProduct(id);
        res.json( { status: 'success', payload: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router