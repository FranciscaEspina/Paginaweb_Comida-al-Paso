const CLAVE_CARRITO = "carrito";

function obtenerCarrito() {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(idProducto, cantidad) {
    const carrito = obtenerCarrito();
    const existente = carrito.find((item) => item.idProducto === idProducto);

    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ idProducto, cantidad });
    }
    guardarCarrito(carrito);
}

function quitarDelCarrito(idProducto) {
    const carrito = obtenerCarrito().filter((item) => item.idProducto !== idProducto);
    guardarCarrito(carrito);
    renderCarrito();
    actualizarContadorCarrito();
}

function cambiarCantidad(idProducto, nuevaCantidad) {
    const carrito = obtenerCarrito();
    const item = carrito.find((i) => i.idProducto === idProducto);
    if (!item) return;

    if (nuevaCantidad <= 0) {
        quitarDelCarrito(idProducto);
        return;
    }
    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    renderCarrito();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const total = obtenerCarrito().reduce((acumulado, item) => acumulado + item.cantidad, 0);
    badge.textContent = total;
}

function formatoCLPCarrito(numero) {
    return "$" + Number(numero).toLocaleString("es-CL");
}

function renderCarrito() {
    const contenedor = document.getElementById("carrito-items");
    const totalElemento = document.getElementById("carrito-total");
    if (!contenedor) return;

    const carrito = obtenerCarrito();
    const productos = typeof obtenerProductos === "function" ? obtenerProductos() : [];

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
        if (totalElemento) totalElemento.textContent = formatoCLPCarrito(0);
        return;
    }

    contenedor.innerHTML = "";
    let total = 0;

    carrito.forEach((item) => {
        const producto = productos.find((p) => p.id === item.idProducto);
        if (!producto) return;

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        let rutaImagen = producto.imagen || '';
        if (rutaImagen.startsWith('../')) {
            rutaImagen = rutaImagen.replace('../', '');
        }

        const fila = document.createElement("div");
        fila.className = "cart-item";
        fila.style.display = "flex";
        fila.style.alignItems = "center";
        fila.style.gap = "1rem";
        fila.style.marginBottom = "1rem";

        fila.innerHTML = `
      <img src="${rutaImagen}" alt="${producto.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;">
      <div style="flex-grow:1;">
        <strong>${producto.nombre}</strong>
        <p>${formatoCLPCarrito(producto.precio)} c/u</p>
      </div>
      <div class="qty-controls">
        <button class="btn-restar" data-id="${producto.id}">-</button>
        <input type="number" min="1" value="${item.cantidad}" data-id="${producto.id}" class="input-cantidad" style="width: 50px; text-align: center;">
        <button class="btn-sumar" data-id="${producto.id}">+</button>
      </div>
      <p style="font-weight: bold; min-width: 70px; text-align: right;">${formatoCLPCarrito(subtotal)}</p>
      <button class="btn btn-danger btn-small btn-quitar" data-id="${producto.id}">Quitar</button>
    `;
        contenedor.appendChild(fila);
    });

    if (totalElemento) totalElemento.textContent = formatoCLPCarrito(total);

    contenedor.querySelectorAll(".btn-sumar").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.getAttribute("data-id"));
            const item = obtenerCarrito().find((i) => i.idProducto === id);
            cambiarCantidad(id, item.cantidad + 1);
        });
    });

    contenedor.querySelectorAll(".btn-restar").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.getAttribute("data-id"));
            const item = obtenerCarrito().find((i) => i.idProducto === id);
            cambiarCantidad(id, item.cantidad - 1);
        });
    });

    contenedor.querySelectorAll(".input-cantidad").forEach((input) => {
        input.addEventListener("change", () => {
            const id = Number(input.getAttribute("data-id"));
            cambiarCantidad(id, Number(input.value));
        });
    });

    contenedor.querySelectorAll(".btn-quitar").forEach((btn) => {
        btn.addEventListener("click", () => {
            quitarDelCarrito(Number(btn.getAttribute("data-id")));
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCarrito();
    actualizarContadorCarrito();

    document.querySelectorAll(".add-btn[data-id]:not(.btn-ver)").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = Number(boton.getAttribute("data-id"));
            agregarAlCarrito(id, 1);
            actualizarContadorCarrito();

            const textoOriginal = boton.textContent;
            boton.textContent = "Añadido ✓";
            boton.disabled = true;
            setTimeout(() => {
                boton.textContent = textoOriginal;
                boton.disabled = false;
            }, 1000);
        });
    });

    const botonPagar = document.getElementById("btn-pagar");
    if (botonPagar) {
        botonPagar.addEventListener("click", () => {
            if (obtenerCarrito().length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }
            alert("¡Gracias por tu compra!");
            guardarCarrito([]);
            renderCarrito();
            actualizarContadorCarrito();
        });
    }
});