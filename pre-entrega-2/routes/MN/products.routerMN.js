import express from "express";
import { ProductManagerMN } from '../../src/dao/MN/ProductManagerMN.js';

const routerProducts = express.Router()

const productManager = new ProductManagerMN();

routerProducts.get('/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sortOrder = req.query.sort ? req.query.sort : null;
        const category = req.query.category ? req.query.category : null;

        
        const result = await productManager.getProducts(page, limit, sortOrder, category);

        res.render('products', {
            products: result.docs.map(product => product.toObject()),
            totalPages: result.totalPages,
            currentPage: result.page,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage
        });

    } catch (error) {
        console.error("No se pudo actualizar el producto", error);
        res.status(500).send({ error: error.message });
    }
});

routerProducts.get('/details/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProduct(pid);
        if (product) {
            res.render('product_details', { product });
        } else {
            res.status(404).send('Producto no encontrado, intentalo de nuevo');
        }
    } catch (error) {
        console.error("Error al obtener el detalle del producto", error);
        res.status(500).send({ error: error.message });
    }
});

routerProducts.get('/:pid', async (req, res) => {
    let { pid } = req.params;
    let result = await productManager.getProduct(pid);
    res.send({ result: "success", payload: result });
});

routerProducts.post("/", async (req, res) => {
    let { title, description, price, thumbnail, code, stock, category } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        res.status(400).send({ status: "error", error: "Todos los campos son obligatorios" });
        return;
    }
    let result = await productManager.addProduct({ title, description, price, thumbnail, code, stock, category });
    res.send({ result: "success", payload: result });
});

routerProducts.put("/:pid", async (req, res) => {
    try {
        let { pid } = req.params;
        let updatedProduct = req.body;
        let result = await productManager.updateProduct(pid, updatedProduct);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("No se pudo actualizar el producto", error);
        res.status(500).send({ error: error.message });
    }
});

routerProducts.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await productManager.deleteProduct(pid);
    res.send({ result: "success", payload: result });
});

export default routerProducts;