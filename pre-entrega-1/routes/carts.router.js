import express from 'express';
import {cartManager} from '../src/app.js';

const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.json( { status: 'Success', payload: newCart } );

    } catch (error) {
        res.status(500).json( { error: error.message } );
    }
})

router.get("/:cid", async(req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(id);
        res.json( { status: 'Success', payload: cart } );

    } catch (error) {
        res.status(500).json( {error: error.message} );
    }
})

router.post('/:cid/product/:pid', async(req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const cart = await cartManager.addProduct(cartId, productId);
        res.json( {status: 'Success', payload: cart} );

    } catch (error) {
        res.status(500).json( {error: error.message} );
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const cart = await cartManager.deleteProduct(cartId, productId);
        res.json( { status: 'Success', payload: cart });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router