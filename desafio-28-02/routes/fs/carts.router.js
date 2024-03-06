import { Router } from "express";
import { CartManagerMN } from "../../src/dao/MN/CartManagerMN.js";

const cartsRouter = Router();
const cartMN = new CartManagerMN();

cartsRouter.get("/", async (req, res) => {
    try {
        let result = await cartMN.getCarts()
        res.send ({result: "success", payload: result})
    } catch (error){
        console.error ("Error en cargar los carritos, intentalo de nuevo", error)
    }
});

cartsRouter.get ('/:cid', async (req, res)=>{
    let {cid} = req.params
    let result = await cartMN.getCart(cid)
    res.send ({result: "success", payload: result})
})

cartsRouter.post ("/", async (req, res) => {
    let result = await cartMN.addCart ()
    res.send ({result: "success", payload: result})
})

cartsRouter.post ("/:cid/:pid", async (req, res) => {
    try {
        let { cid, pid } = req.params;
        
        let result = await cartMN.addToCart (cid, pid)
        
        res.send ({result: "success", payload: result})
    } catch (error) {
        console.error("Error al agregar un producto al carrito:", error);
    }
    
})

cartsRouter.delete("/:cid/:pid", async(req, res) => {
    let {cid, pid} = req.params 
    let result = await cartMN.deleteProduct(pid, cid) 
    res.send ({result:"success", payload: result})
})

export default cartsRouter;