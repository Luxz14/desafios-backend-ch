//Importamos FileSystem para utilizarlo en el archivo
import fs from 'fs';

//Creamos una clase que se puede exportar llamada Product Manager
export class ProductManager {

    constructor(path) {
        this.path = path; //Creamos el constructor con el this.path correspondiente
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