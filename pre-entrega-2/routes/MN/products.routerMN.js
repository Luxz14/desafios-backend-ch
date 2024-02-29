import { Router } from 'express';
import { ProductManagerMN } from '../../src/dao/MN/ProductManagerMN.js';

const routerProducts = Router();

const newProduct = new ProductManagerMN();

routerProducts.get('/', (req, res) => {
    res.redirect('/products?page=1');
});

routerProducts.get('/products', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sortOrder = req.query.sort ? req.query.sort : null;
        const category = req.query.category ? req.query.category : null;

        const result = await newProduct.getProducts(page, limit, sortOrder, category);

        result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)

        res.render('products', { products: result.docs, ...result });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
});

routerProducts.get('/:pid', async (req, res) => {
    let { pid } = req.params;
    let result = await newProduct.getProduct(pid);
    res.send({ result: "success", payload: result });
});

routerProducts.post("/", async (req, res) => {
    let { title, description, price, thumbnail, code, stock, category } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        res.status(400).send({ status: "error", error: "Todos los campos son obligatorios" });
        return;
    }

    let result = await newProduct.addProduct({ title, description, price, thumbnail, code, stock, category });
    res.send({ result: "success", payload: result });
});

routerProducts.put("/:pid", async (req, res) => {
    try {
        let { pid } = req.params;
        let updatedProduct = req.body;
        let result = await newProduct.updateProduct(pid, updatedProduct);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al actualizar el producto, intentalo de nuevo", error);
        res.status(500).send({ error: error.message });
    }
});

routerProducts.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await newProduct.deleteProduct(pid);
    res.send({ result: "success", payload: result });
});

export default routerProducts;