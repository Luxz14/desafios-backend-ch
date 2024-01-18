import fs from 'fs';


export class ProductManager {
    constructor() {
        this.products = []; //Inicializamos el array de productos vacio
        this.path = "products.json"; //Utilizaremos este archivo JSON para manejar los productos
    }

    //Agregamos un nuevo producto al carrito de productos (Se realizan diferentes validaciones y se escribe el archivo JSON).
    addProduct(product){
        this.getProducts();
        const { title, description, price, thumbnail, code, stock } = product;

        if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            return console.log('Debe completar todos los campos ya que son obligatorios.');
        }

        if(this.products.some((p) => p.code === product.code)) {
            return console.log('El codigo ya existe, no debe crearse uno nuevo.')
        }

        const newProduct = {
            id: this.products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct);

        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products))
            console.log("Los datos fueron escritos y guardados correctamente");

        } catch (error) {
            console.log("Error al escribir el archivo", error)
        }
    }

    //Leemos todos los productos que estan en el archivo
    getProducts() {
        try {
            const data = fs.readFileSync(this.path, "utf8")
    
            this.products = JSON.parse(data)
            console.log("Archivo leido");

        } catch (error) {
            console.error("Error al leer el archivo", error)
        }
        return this.products
    }

    //Buscamos productos a traves de su id, si no existen, devolvemos un console.log con "Not Found"
    getProductById(id) {
        this.getProducts()
        const productFind = this.products.find(product => product.id === id);

        if (productFind) {
            console.log(productFind);
        } else {
            console.log('Product not found');
        }
    }

    //Actualizamos el archivo con los productos (Validamos si el ID existe o no y luego volvemos a escribir el archivo actualizado)
    updateProduct(id, updateProduct) {
        this.getProducts();

        if(this.products.find((product) => product.id === id) === undefined) {
            console.error(`El id: ${id} no existe`);
            return
        }
        const index = this.products.findIndex((product) => product.id === id);
        this.products[index] = {id, ...updateProduct};

        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            console.log("Archivo de productos actualizado")
        } catch (error) {
            console.log("Error al actualizar el archivo de productos", error)
        }
    }

    //Eliminamos los productos del archivo en base a su ID (Volvemos a escribir el archivo con los nuevos productos)
    deleteProduct(id) {
        this.getProducts();

        if(this.products.find((product) => product.id === id) === undefined) {
            console.error(`El id: ${id} no existe`);
            return
        }

        const index = this.products.findIndex((product) => product.id === id);
        this.products.splice(index, 1);

        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            console.log("Producto eliminado exitosamente");

        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }

}


//Codigo de prueba
const productManager = new ProductManager();

const product5 = {
    id: 5,
    title: "Producto 5",
    description: "Este es el producto 5",
    price: 20.99,
    thumbnail: "/",
    code: "abcdefg1234567",
    stock: 2,
};

productManager.addProduct(product5)
let misProductos = productManager.getProducts();
console.log(misProductos);