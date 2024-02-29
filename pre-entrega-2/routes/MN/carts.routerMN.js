import { Router } from "express";
import { CartManagerMN } from "../../src/dao/MN/CartManagerMN";
import { ProductManagerMN } from "../../src/dao/MN/ProductManagerMN";
import productModel from "../../src/dao/models/product.model";

const cartRouter = Router();
const newCart = new CartManagerMN();

cartRouter.get ("/", async (req, res) => {
    try {
        let result = await newCart.getCarts()
        res.send ({result: "success", payload: result})
    } catch (error){
        console.error ("Error al cargar los carritos", error)
    }
})

cartRouter.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await newCart.getCart(cid);
        
        const productsDetails = [];

        for (const product of cart.products) {
            const productDetails = await productModel.findById(product.productId).lean();
            const productQuantity = { ...productDetails, quantity: product.quantity }; 
            productsDetails.push(productQuantity);
        }
        
        res.render("carts", { cart, productsDetails });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).send({ error: error.message });
    }
});

cartRouter.post ("/", async (req, res) => {
    let result = await newCart.addCart ()
    res.send ({result: "success", payload: result})
})

cartRouter.post ("/:cid/:pid", async (req, res) => {
    try {
        let { cid, pid } = req.params;
        let result = await newCart.addToCart (cid, pid)
        res.send ({result: "success", payload: result})
    } catch (error) {
        console.error("Error al agregar productos al carrito", error);
    }
    
})

cartRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const result = await newCart.updateProductQuantity(cid, pid, quantity);
        res.send({ result: "success", payload: result });

    } catch (error) {
        console.error("Error al actualizar la cantidad del producto", error);
        res.status(500).send({ error: error.message });
    }
});

cartRouter.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await newCart.updateCart(cid);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al actualizar el carrito", error);

        res.status(500).send({ error: error.message });
    }
});

cartRouter.delete("/:cid/products/:pid", async(req, res) => {
    let {cid, pid} = req.params 
    let result = await newCart.deleteProduct(pid, cid) 
    res.send ({result:"success", payload: result})
})

export default cartRouter