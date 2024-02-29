//Importamos los archivos que vamos a utilizar
import fs from 'fs';
import {productManager} from '../../app.js';

//Creamos la clase, la exportamos para poder reutilizarla y colocamos diferentes metodos
export class CartManager {
    constructor() {
        this.path = "./data/carts.json";
    }

    //Obtenemos los productos que estan en el carrito, leemos el archivo y hacemos validaciones.
    getCarts() {
        try {
            const data = fs.readFileSync(this.path, "utf8");
            this.carts = JSON.parse(data);
            return this.carts;

        } catch (error) {
            console.log("Error al leer el archivo, intentalo de nuevo", error);
            return [];
        }
    }

    //Agregamos un nuevo carrito ya actualizado con los productos
    addCart() {
        this.getCarts()

        const newCart = {
            id: this.carts.length + 1,
            products: []
        };

        this.carts.push(newCart);

        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts));
            console.log("Archivo escrito correctamente");
            return newCart;

        } catch (error) {
            console.log("No ha sido posible escribir el archivo", error);
        }
    }

    //Obtenemos los productos en base a su id
    getCartById(cartId) {
        this.getCarts()
        const cart = this.carts.find(cart => cart.id === cartId);
        console.log(cart);

        if(cart) {
            return cart;
        } else {
            console.log("El carrito seleccionado no fue encontrado");
            return null;
        }
    }

    //Agregamos los productos al carrito y hacemos diferentes validaciones en base a sus id y las cantidades de los productos ya seleccionados.
    addProduct(cartId, productId) {
        try {
            this.getCarts();
            const cart = this.carts.find(cart => cart.id === cartId);

            if(!cart) {
                throw new Error(`No se encontro el producto con id ${productId}`);
            }

            const existingProduct = cart.products.find(product => product.id === parseInt(productId));

            if (!existingProduct) {
                const product = productManager.getProductById(productId);

                if (!product) {
                    throw new Error(`No se encontró el producto con id ${productId}`);
                }

                cart.products.push({
                    id: parseInt(productId),
                    quantity: 1
                });
            } else {
                existingProduct.quantity++;
            }

            fs.writeFileSync(this.path, JSON.stringify(this.carts));
            return cart;

        } catch (error) {
            console.log("Error al agregar producto al carrito", error);
            throw error;
        }
    }

    //Eliminamos los productos del carrito
    deleteProduct(cartId, productId) {

        try {
            this.getCarts();
            const cart = this.carts.find(cart => cart.id === cartId);

            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cartId}`);
            }

            const productIndex = cart.products.findIndex(product => product.id === parseInt(productId));

            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${productId} en el carrito con id ${cartId}`);
            }

            const product = cart.products[productIndex];

            if (product.quantity > 1) {
                product.quantity--;
            } else {
                cart.products.splice(productIndex, 1);
            }

            fs.writeFileSync(this.path, JSON.stringify(this.carts));
            return cart;
        } catch (error) {
            console.error("Error al eliminar producto del carrito", error);
            throw error;
        }
    }
}