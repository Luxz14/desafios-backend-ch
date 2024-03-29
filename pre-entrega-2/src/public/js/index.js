const socket = io();

    socket.on ("products", products => {
        console.log(products)
        const productsContainter = document.getElementById("table")
        productsContainter.innerHTML = `
        <tr>
            <th>Id:</th>
            <th>Título:</th>
            <th>Descripción:</th>
            <th>Codigo:</th>
            <th>Precio:</th>
            <th>Stock:</th>
            <th>Imagenes:</th>
            <th>Categoria:</th>
        </tr>
        `
        products.forEach((product) => {
            productsContainter.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.code}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.thumbnail}</td>
                <td>${product.categoria}</td>
            </tr>
            `
        }) 
    })

    document.getElementById("addNewProduct").addEventListener("addToCartButton", (event) => {
    event.preventDefault()

    socket.emit("new-Product", {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            code: document.getElementById('code').value,
            price: document.getElementById('price').value,
            stock: document.getElementById('stock').value,
            thumbnail: document.getElementById('thumbnail').value,
            categoria: document.getElementById('categoria').value
        })
        event.target.reset();
    });

    document.getElementById("deleteProduct").addEventListener("submit", (event) => {
        event.preventDefault()
        const pId = document.querySelector("#id").value

        socket.emit("delete-product", pId )
        event.target.reset();
    })

    socket.on('response', (response) => {
        if(response.status === 'success') {
            document.getElementById('responseContainer').innerHTML = `<p class="success">${response.message}</p>`;
        } else {
            document.getElementById('responseContainer').innerHTML = `<p class="error">${response.message}</p>`;
        }
    });