import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"

export class CartManagerMN {
    constructor(){
        this.model = cartModel
    }
    
    async getCarts(){
        try {
            return await this.model.find({}).populate('products')   
        } catch (error) {
            console.error("Error al mostrar los carritos", error);
        }
    }
    
    async getCart(cid){
        try {
            return await this.model.findById(cid).populate('products')
        } catch (error) {
            console.log("Error al intentar obtener el carrito", error)
        }
    }
    
    async addCart(){
        const newCart = {
            products: []
        };
        return await this.model.create(newCart)
    }
    
    async addToCart(cid, pid) {
        try {
            const cartExists = await this.model.findOne({ _id: cid });
            const productExists = await productModel.findOne({ _id: pid });
            if (!cartExists) {
                throw new Error(`No se  ha encontrado el carrito con id ${cid}`);
            }

            if (!productExists) {
                throw new Error(`No se ha encontrado el producto con id ${pid}`);
            }


            const existingProduct = cartExists.products.find(product => product.productId.toString() === pid.toString());
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cartExists.products.push({
                    productId: pid,
                    product: productExists,
                    quantity: 1
                });
            }

            await cartExists.save(); 
            return "Producto agregado exitosamente!";
        } catch (error) {
            console.error("Error al agregar el producto al carrito", error);
            
        }
    }

    async deleteProduct(pid, cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }
    
            const productIndex = cart.products.findIndex(product => product.productId.toString() === pid.toString());
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${pid} en el carrito`);
            }
    
            cart.products.splice(productIndex, 1);
        
            await cart.save();
            return "Producto eliminado exitosamente del carrito";
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }

    async updateCart(cart) {
        try {
            await this.model.findByIdAndUpdate(cart._id, cart);
            return "Se actualizo el carrito correctamente";
        } catch (error) {
            console.error("No se pudo actualizar el carrito", error);
            throw error;
        }
    }    

    async updateCartTotal(cid, pid, quantity) {
        try {
            const cart = await this.model.findById(cid);

            if(!cart) {
                throw new Error(`No se encontro el carrito con el id: ${cid}`);
            }

            const productIndex = cart.products.findIndex(product => product.productId.toString() === pid.toString());
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id: ${pid} en este carrito`);
            }

            cart.products[productIndex].quantity = quantity;

            await this.updateCart(cart);

            return "Cantidad de producto actualizada";

        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito", error);
        }
    }

    async deleteAllProducts(cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontro el carrito con el id: ${cid}`);
            }
            cart.products = []; 
            await this.updateCart(cart);
    
            return "Todos los productos fueron eliminados exitosamente";
        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito", error);
        }
    }
}

    