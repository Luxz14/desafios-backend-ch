const socket = io();

document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const messageInput = document.getElementById("message");
    const message = messageInput.value;
    const username = document.getElementById("username").value;

    socket.emit("chatMessage", { username, message }); 
    messageInput.value = ""; 
})

socket.on("message", (msj) => {
    const chatMessages = document.getElementById("chat-messages")
    const messageElement = document.createElement("div")
    messageElement.innerHTML = `<strong>${msj.username}</strong> ${msj.message}`
    chatMessages.appendChild(messageElement)
})

document.getElementById("username-form").addEventListener("submit", (e)=>{
    e.preventDefault()
    const usernameInput = document.getElementById("username")
    const username = usernameInput.value

    socket.emit("newUser", username)

    Swal.fire({
        icon: "success",
        title: "Bienvenido al Chat",
        text: `Estas conectado como ${username}`
    })

    document.getElementById("username-form").style.display = "none"
    document.getElementById("chat-form").style.display = "block"
})