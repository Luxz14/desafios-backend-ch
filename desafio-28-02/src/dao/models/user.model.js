import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
    first_name: { type: String, required: true, unique: true },
    last_name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
});

const userModel = mongoose.model(usersCollection, usersSchema);

export default userModel;