import productModel from "../models/product.model.js";

export class ProductManagerMN {
    constructor(){
        this.model = productModel
    }

    async getProducts(page, limit, sortOrder, category) {
        try {
            const categories = {
                page: page || 1,
                limit: limit || 10,
                sort: sortOrder ? { price: sortOrder === 'asc' ? 1 : -1 } : null
            }

            const query = category ? {category: category} : {};

            return await this.model.paginate({query}, categories);

        } catch (error) {
            console.error("Error al mostrar los productos, intentalo de nuevo", error);
        }
    }

    async getProduct(pid){
        return await this.model.findOne({_id: pid}).lean()
    }

    async addProduct(newProduct){
        return await this.model.create(newProduct)
    }

    async updateProduct(pid, updatedProduct){
        return await this.model.updateOne({_id: pid}, updatedProduct)
    }

    async deleteProduct(pid){
        return await this.model.deleteOne({_id: pid})
    }
}
