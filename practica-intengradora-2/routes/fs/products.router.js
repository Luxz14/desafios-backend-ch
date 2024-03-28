import { Router } from "express";
import { ProductManagerMN } from "../../src/dao/MN/ProductManagerMN.js";

const productRouter = Router();
const productsMN = new ProductManagerMN();

productRouter.get ("/", async (req, res) => {
    try {
        let result = await productsMN.getProducts()
        res.send ({result: "success", payload: result})
    } catch (error){
        console.error("Error al mostrar los productos, intentalo de nuevo", error);
    }
});

productRouter.get ('/:pid', async (req, res)=>{
    let {pid} = req.params
    let result = await productsMN.getProduct(pid)
    res.send ({result: "success", payload: result})
})

productRouter.post ("/", async (req, res) => {
    let {title, description, price, thumbnail, code, stock, category} = req.body
    if (!title || !description || !price || !thumbnail || !code || !stock || !category){
        res.send ({status: "error", error: "Todos los campos son obligatorios"})
    }
    let result = await productsMN.addProduct ({
        title, description, price, thumbnail, code, stock, category
    })
    res.send ({result: "success", payload: result})
})

productRouter.put ("/:pid", async (req, res) => {
    try {
        let { pid } = req.params;
        let updatedProduct = req.body; 
        let result = await productsMN.updateProduct(pid, updatedProduct);
        res.send({ result: "success", payload: result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

productRouter.delete ("/:pid", async(req, res) => {
    let {pid} = req.params
    let result = await productsMN.deleteProduct ({
        _id: pid
    })
    res.send ({result:"success", payload: result})
});

export default productRouter;