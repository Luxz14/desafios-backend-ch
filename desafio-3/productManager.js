//Importamos FileSystem para utilizarlo en el archivo
import fs from 'fs';

//Creamos una clase que se puede exportar llamada Product Manager
export class ProductManager {

    constructor(path) {
        this.products = []; //Inicializamos el array de productos vacio
        this.path = path; //Creamos el constructor con el this.path correspondiente
    }

    //Agregamos un nuevo producto al carrito de productos (Se realizan diferentes validaciones y se escribe el archivo JSON).
    addProduct(product){
                this.getProducts();
                const { title, description, price, thumbnail, code, stock } = product;
        
                if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                    return console.log('Debe completar todos los campos ya que son obligatorios.');
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

                const repeatedCode = this.products.findIndex(product => product.code === code);
                if(repeatedCode === -1) {
                    this.products.push(newProduct);

                    let newProductStr = JSON.stringify(this.products, null, 2)
                    fs.writeFileSync(this.path, newProductStr)
                    return 'Producto agregado al archivo'
                } else {
                    return('El codigo ya existe, no debe crearse uno nuevo.')
                }
            }

    //Obtenemos los productos y leemos el archivo con el fs. Verificamos si los productos existen y sino lanzamos un error
    async getProducts(limit) {
        try {
            const responseProduct = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(responseProduct);
    
            if (limit) {
                return products.slice(0, limit);
            }
            return products;
        } catch (error) {
            console.log('Ha ocurrido un error al leer o analizar el archivo JSON', error);
            throw error;
        }
    }

    //Buscamos y obtenemos los productos en base a su id. Verificamos si existen, si es asi los mostramos y sino lanzamos un error.
    async getProductById(id) {
        try {
            const responseProductId = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(responseProductId);

            const product = products.find(product => product.id == id);
            if (!product) {
                return `No se encontró el producto con id: ${id}`;
            }
            return product;
        } catch (error) {
            console.log('Ha ocurrido un error', error);
            throw error;
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