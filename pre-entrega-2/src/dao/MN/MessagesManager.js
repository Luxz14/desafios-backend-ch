import messagesModel from "../models/messages.model.js"

export default class MessagesManagerMN {
    constructor(){
        this.model = messagesModel
    }

    async addChat(username, message){
        try {
            const chat = await this.model.findOne({}); 
            if (chat) {
                chat.messages.push({ username, message }); 
                await chat.save(); 
                return chat;
            } else {
                
                return await this.model.create({ messages: [{ username, message }] });
            }
        } catch (error) {
            console.error("Error al añadir mensaje al chat, intentalo de nuevo", error);
            throw error;
        }
    }
}