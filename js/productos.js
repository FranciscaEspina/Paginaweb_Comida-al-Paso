const CLAVE_PRODUCTOS = "productos";

const productosIniciales = [
    {
        id: 1,
        codigo: "COMP-001",
        nombre: "Completo italiano",
        descripcion: "Vienesa, palta fresca, tomate picado y mayonesa casera.",
        precio: 2200,
        stock: 40,
        stockCritico: 5,
        categoria: "Completos",
        imagen: "img/completo-italiano.PNG",
    },
    {
        id: 2,
        codigo: "CHU-001",
        nombre: "Churrasco Al Toque",
        descripcion: "Churrasco de carne con nuestros aliños de la casa.",
        precio: 3500,
        stock: 25,
        stockCritico: 5,
        categoria: "Sándwiches",
        imagen: "img/churrasco-italiano.jpg",
    },
    {
        id: 3,
        codigo: "PAP-001",
        nombre: "Papas rústicas",
        descripcion: "Doble cocción, corte grueso y reposo justo para quedar crujientes.",
        precio: 2800,
        stock: 30,
        stockCritico: 6,
        categoria: "Papas Fritas",
        imagen: "img/papas-rusticas.PNG",
    },
    {
        id: 4,
        codigo: "EMP-001",
        nombre: "Empanada de pino",
        descripcion: "Empanada horneada rellena de pino tradicional.",
        precio: 1900,
        stock: 45,
        stockCritico: 8,
        categoria: "Sándwiches",
        imagen: "img/empanadas-de-pino.jpg",
    },
    {
        id: 5,
        codigo: "BEB-001",
        nombre: "Bebida 350ml",
        descripcion: "Bebida a elección, lata de 350ml bien fría.",
        precio: 1200,
        stock: 60,
        stockCritico: 10,
        categoria: "Bebidas",
        imagen: "img/bebidas.PNG",
    },
];

function obtenerProductos() {
    const guardado = localStorage.getItem(CLAVE_PRODUCTOS);
    if (!guardado) {
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productosIniciales));
        return productosIniciales;
    }
    return JSON.parse(guardado);
}

function guardarProductos(listaProductos) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(listaProductos));
}

function formatoCLP(numero) {
    return "$" + Number(numero).toLocaleString("es-CL");
}

function renderProductos() {
    const contenedor = document.getElementById("productos-container");
    if (!contenedor) return;

    const productos = obtenerProductos();
    contenedor.innerHTML = "";

    productos.forEach((producto) => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" width="200" height="150">
      <p class="product-name">${producto.nombre}</p>
      ${
            producto.stock <= producto.stockCritico
                ? `<p style="color:var(--paprika); font-weight:700; font-size:.85rem;">¡Quedan pocas unidades!</p>`
                : ""
        }
      <div class="product-row">
        <span class="product-price">${formatoCLP(producto.precio)}</span>
        <button class="add-btn btn-ver" type="button" data-id="${producto.id}">Ver detalle</button>
      </div>
    `;
        contenedor.appendChild(card);
    });

    contenedor.querySelectorAll(".btn-ver").forEach((boton) => {
        boton.addEventListener("click", (evento) => {
            const id = evento.target.getAttribute("data-id");
            localStorage.setItem("productoSeleccionadoId", id);
            window.location.href = "detalle-producto.html";
        });
    });
}

function renderDetalleProducto() {
    const contenedor = document.getElementById("detalle-container");
    if (!contenedor) return;

    const id = Number(localStorage.getItem("productoSeleccionadoId"));
    const productos = obtenerProductos();
    const producto = productos.find((p) => p.id === id);

    if (!producto) {
        contenedor.innerHTML = "<p>Producto no encontrado.</p>";
        return;
    }

    contenedor.innerHTML = `
    <div class="post-hero">
      <img src="${producto.imagen}" alt="${producto.nombre}">
    </div>
    <h1>${producto.nombre}</h1>
    <p>${producto.descripcion}</p>
    <p class="product-price" style="font-size:1.6rem;">${formatoCLP(producto.precio)}</p>
    <div class="form-group" style="max-width:140px;">
      <label for="cantidad">Cantidad</label>
      <input type="number" id="cantidad" min="1" max="${producto.stock}" value="1">
    </div>
    <button id="btn-agregar-carrito" class="btn">Añadir al carrito</button>
  `;

    document.getElementById("btn-agregar-carrito").addEventListener("click", () => {
        const cantidad = Number(document.getElementById("cantidad").value) || 1;
        agregarAlCarrito(producto.id, cantidad);
        alert("Producto añadido al carrito");
        actualizarContadorCarrito();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderProductos();
    renderDetalleProducto();
    if (typeof actualizarContadorCarrito === "function") {
        actualizarContadorCarrito();
    }
});