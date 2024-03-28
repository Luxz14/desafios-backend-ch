import userModel from "../models/user.model.js";

const adminUser = {
    first_name: "Administrador",
    last_name: "Administrador Last Name",
    email: "admin123@email.com",
    password: "admin1234",
    role: "admin"
}

export class LoginManagerMN {
    constructor() {
        this.model = userModel;
    }

    async byId(id) {
        const user = await this.model.findById(id);
        return user;
    }

    async byEmail(email) {
        if (email === adminUser.email) {
            return adminUser;
        } else {
            const user = await this.model.findOne({ email });
            if (!user) {
                throw new Error("El usuario no existe, intentalo de nuevo");
            } 
            return user;
        }
    }

    async newUser(userData) {
        const newUser = await this.model.create(userData);
        return newUser;
    }
}