import mongoose from "mongoose";

const messagesCollection = "chat";

const messagesSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    messages: [messagesSchema] 
});


const messagesModel = mongoose.model(messagesCollection, chatSchema);

export default messagesModel;