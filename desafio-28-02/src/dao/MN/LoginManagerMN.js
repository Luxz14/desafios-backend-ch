import userModel from "../models/user.model.js";

export class LoginManagerMN {
    constructor() {
        this.model = userModel;
    }

    async byId(id) {
        const user = await this.model.findById(id);
        return user;
    }

    async byEmail(email) {
        const user = await this.model.findOne({ email });
        if (!user) {
            throw new console.error("El usuario no existe, intentalo de nuevo");
        } 
        return user;
    }

    async newUser(userData) {
        const newUser = await this.model.create(userData);
        return newUser;
    }
}