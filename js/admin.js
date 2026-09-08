const CLAVE_USUARIOS = "usuarios";
const CLAVE_SESION = "usuarioActivo";

function protegerRutaAdmin() {
    const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");

    if (!sesion) {
        window.location.href = "../login.html";
        return null;
    }

    if (sesion.tipoUsuario === "Cliente") {
        alert("No tienes permisos para acceder al panel de administración.");
        window.location.href = "../index.html";
        return null;
    }

    return sesion;
}

function esAdministrador(sesion) {
    return sesion && sesion.tipoUsuario === "Administrador";
}

function obtenerUsuarios() {
    const guardado = localStorage.getItem(CLAVE_USUARIOS);
    return guardado ? JSON.parse(guardado) : [];
}

function guardarUsuarios(listaUsuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(listaUsuarios));
}

function renderTablaUsuarios() {
    const cuerpoTabla = document.getElementById("tabla-usuarios-body");
    if (!cuerpoTabla) return;

    const usuarios = obtenerUsuarios();
    cuerpoTabla.innerHTML = "";

    if (usuarios.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="5">Aún no hay usuarios registrados.</td></tr>`;
        return;
    }

    usuarios.forEach((usuario, indice) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
      <td>${usuario.run}</td>
      <td>${usuario.nombre} ${usuario.apellidos}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.tipoUsuario || "Cliente"}</td>
      <td>
        <button class="btn btn-danger btn-small btn-eliminar-usuario" data-index="${indice}">Eliminar</button>
      </td>
    `;
        cuerpoTabla.appendChild(fila);
    });

    cuerpoTabla.querySelectorAll(".btn-eliminar-usuario").forEach((boton) => {
        boton.addEventListener("click", () => {
            const indice = Number(boton.getAttribute("data-index"));
            const usuarios = obtenerUsuarios();
            usuarios.splice(indice, 1);
            guardarUsuarios(usuarios);
            renderTablaUsuarios();
        });
    });
}

function crearUsuarioDesdeAdmin(nuevoUsuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
}

function renderTablaProductosAdmin() {
    const cuerpoTabla = document.getElementById("tabla-productos-body");
    if (!cuerpoTabla) return;

    const productos = obtenerProductos();
    cuerpoTabla.innerHTML = "";

    productos.forEach((producto) => {
        let rutaImagen = producto.imagen || "";
        if (rutaImagen && !rutaImagen.startsWith("http") && !rutaImagen.startsWith("../")) {
            rutaImagen = "../" + rutaImagen;
        }

        const fila = document.createElement("tr");
        fila.innerHTML = `
      <td>
        <img src="${rutaImagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
      </td>
      <td>${producto.codigo}</td>
      <td>${producto.nombre}</td>
      <td>$${producto.precio.toLocaleString("es-CL")}</td>
      <td>${producto.stock}</td>
      <td>${producto.categoria}</td>
      <td>
        <button class="btn btn-secondary btn-small btn-editar-producto" data-id="${producto.id}">Editar</button>
        <button class="btn btn-danger btn-small btn-eliminar-producto" data-id="${producto.id}">Eliminar</button>
      </td>
    `;
        cuerpoTabla.appendChild(fila);
    });

    cuerpoTabla.querySelectorAll(".btn-editar-producto").forEach((boton) => {
        boton.addEventListener("click", () => {
            localStorage.setItem("productoAEditarId", boton.getAttribute("data-id"));
            window.location.href = "producto-form.html";
        });
    });

    cuerpoTabla.querySelectorAll(".btn-eliminar-producto").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = Number(boton.getAttribute("data-id"));
            const productos = obtenerProductos().filter((p) => p.id !== id);
            guardarProductos(productos);
            renderTablaProductosAdmin();
        });
    });
}

function guardarProductoDesdeForm(datosProducto, idAEditar) {
    const productos = obtenerProductos();

    if (idAEditar) {
        const indice = productos.findIndex((p) => p.id === Number(idAEditar));
        if (indice !== -1) {
            productos[indice] = { ...productos[indice], ...datosProducto };
        }
    } else {
        const nuevoId = productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
        productos.push({ id: nuevoId, ...datosProducto });
    }

    guardarProductos(productos);
}

function precargarFormularioProducto() {
    const idAEditar = localStorage.getItem("productoAEditarId");
    if (!idAEditar) return;

    const producto = obtenerProductos().find((p) => p.id === Number(idAEditar));
    if (!producto) return;

    document.getElementById("codigo").value = producto.codigo;
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion || "";
    document.getElementById("precio").value = producto.precio;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("stockCritico").value = producto.stockCritico || "";
    document.getElementById("categoria").value = producto.categoria;
    document.getElementById("imagen").value = producto.imagen || "";

    const inputImagen = document.getElementById("imagen");
    if (inputImagen) {
        inputImagen.value = producto.imagen || "";
    }
}

function limpiarEdicionProducto() {
    localStorage.removeItem("productoAEditarId");
}