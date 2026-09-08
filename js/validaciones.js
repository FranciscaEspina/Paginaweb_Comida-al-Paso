function sembrarUsuarioAdmin() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const yaExisteAdmin = usuarios.some((u) => u.tipoUsuario === "Administrador");
    if (yaExisteAdmin) return;

    usuarios.push({
        run: "111111111",
        nombre: "Admin",
        apellidos: "Prueba",
        correo: "admin@duoc.cl",
        fechaNacimiento: "",
        region: "",
        comuna: "",
        direccion: "Sin dirección",
        tipoUsuario: "Administrador",
        contrasena: "admin123",
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}
sembrarUsuarioAdmin();

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("loginForm");
    if (formulario) {
        formulario.addEventListener("submit", (event) => {
            event.preventDefault();
            validarLogin();
        });
    }

    const registroForm = document.getElementById("registroForm");
    if (registroForm) {
        registroForm.addEventListener("submit", (event) => {
            event.preventDefault();
            validarRegistro();
        });
    }

    const contactoForm = document.getElementById("contactoForm");
    if(contactoForm){
        contactoForm.addEventListener("submit",
        (event)=>{
            event.preventDefault();
            validarContacto();
        });
    }

});

/*validaciones login */
function validarLogin() {

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();
    
    const errorCorreo = document.getElementById("errorCorreo");
    const errorPassword = document.getElementById("errorPassword");
    const grupoCorreo = errorCorreo.closest(".form-group");
    const grupoPassword = errorPassword.closest(".form-group");
    
    errorCorreo.textContent = "";
    errorPassword.textContent = "";
    grupoCorreo.classList.remove("invalid");
    grupoPassword.classList.remove("invalid");

    let formularioValido = true;

    /* validar correo */
    if (correo === "") {
        errorCorreo.textContent = "El correo es obligatorio";
        formularioValido = false;    
    } else if (correo.length > 100 ) {
        errorCorreo.textContent = "El correo no puede superar los 100 caracteres"
        formularioValido = false;
    } else {
        const dominiosPermitidos = [
            "@duoc.cl",
            "@profesor.duoc.cl",
            "@gmail.com"
        ];

        const dominioValido = 
            dominiosPermitidos.some(dominio=> 
                correo.endsWith(dominio)
            ) ;

        if (!dominioValido) {
            errorCorreo.textContent = "Dominio de correno no permitido"
            formularioValido = false;
        }
    }

    /* validar contrasena */
    if (password === "") {
        errorPassword.textContent = "La contraseña es obligatoria";
            formularioValido = false;
               
    } else if (
        password.length < 4 ||
        password.length > 10
    ) {
        errorPassword.textContent = 
            "La contraseña debe tener entre 4 y 10 caracteres";
        formularioValido = false;
    }

    grupoCorreo.classList.toggle("invalid", errorCorreo.textContent !== "");
    grupoPassword.classList.toggle("invalid", errorPassword.textContent !== "");

    /* resultado */
    if (formularioValido) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
        const usuarioEncontrado = usuarios.find(
            (u) => u.correo === correo && u.contrasena === password
        );

        if (!usuarioEncontrado) {
            errorPassword.textContent = "Correo o contraseña incorrectos";
            alert("Correo o contraseña incorrectos");
            return;
        }

        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

        if (
            usuarioEncontrado.tipoUsuario === "Administrador" ||
            usuarioEncontrado.tipoUsuario === "Vendedor"
        ) {
            window.location.href = "admin/home.html";
        } else {
            alert(`Bienvenido, ${usuarioEncontrado.nombre}`);
            window.location.href = "index.html";
        }
    }
        
}/*Termino validacion de login*/

/*validar registro*/
function validarRegistro() {
    const rut = document.getElementById("rut").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const password = document.getElementById("passwordRegistro").value.trim();
    const confirmarPassword =
        document.getElementById("confirmarPassword").value.trim();
    const errorRut =
        document.getElementById("errorRut");
    const errorNombre =
        document.getElementById("errorNombre");
    const errorApellidos =
        document.getElementById("errorApellidos");
    const errorCorreo =
        document.getElementById("errorCorreoRegistro");
    const errorDireccion =
        document.getElementById("errorDireccion");
    const errorPassword =
        document.getElementById("errorPasswordRegistro");
    const errorConfirmarPassword =
        document.getElementById("errorConfirmarPassword");
    const gruposRegistro = [
        errorRut,
        errorNombre,
        errorApellidos,
        errorCorreo,
        errorDireccion,
        errorPassword,
        errorConfirmarPassword,
    ].map((mensaje) => mensaje.closest(".form-group"));
    
    errorRut.textContent = "";
    errorNombre.textContent = "";
    errorApellidos.textContent = "";
    errorCorreo.textContent = "";
    errorDireccion.textContent = "";
    errorPassword.textContent = "";
    errorConfirmarPassword.textContent = "";
    gruposRegistro.forEach((grupo) => grupo.classList.remove("invalid"));
    
    let formularioValido = true;

    /*validar rut*/
    if (rut === "") {
        errorRut.textContent ="El RUT es obligatorio";
        formularioValido = false;
    } else if (rut.includes(".") || rut.includes("-")) {
        errorRut.textContent ="Ingrese el RUT sin puntos ni guión";
        formularioValido = false;
    } else if (rut.length < 8 || rut.length > 9) {
        errorRut.textContent ="El RUT debe tener entre 8 y 9 caracteres";
        formularioValido = false;
    }

    /*validar nombre*/
    if (nombre === "") {
        errorNombre.textContent ="El nombre es obligatorio";
        formularioValido = false;
    } else if (nombre.length > 50) {
        errorNombre.textContent ="Máximo 50 caracteres";
        formularioValido = false;
    }

    /*validar apellido */
    if (apellidos === "") {
        errorApellidos.textContent ="Los apellidos son obligatorios";
        formularioValido = false;
    } else if (apellidos.length > 100) {
        errorApellidos.textContent ="Máximo 100 caracteres";
        formularioValido = false;
    }

    /*validar correo*/
    const dominiosPermitidos = [
        "@duoc.cl",
        "@profesor.duoc.cl",
        "@gmail.com"
    ];
    if (correo === "") {
        errorCorreo.textContent ="El correo es obligatorio";
        formularioValido = false;
    } else {
        const dominioValido =
            dominiosPermitidos.some(
                dominio => correo.endsWith(dominio)
            );
        if (!dominioValido) {
            errorCorreo.textContent ="Correo no permitido";
            formularioValido = false;
        }
    }

    /*validar direccion*/
    if (direccion === "") {
        errorDireccion.textContent ="La dirección es obligatoria";
        formularioValido = false;
    } else if (direccion.length > 300) {
        errorDireccion.textContent = "Máximo 300 caracteres";
        formularioValido = false;
    }

    /*validar contraseña */
    if (
        password.length < 4 ||
        password.length > 10
    ) {
        errorPassword.textContent = "Debe tener entre 4 y 10 caracteres";
        formularioValido = false;
    }

    /*confirmar contraseña*/
    if (confirmarPassword !== password) {
        errorConfirmarPassword.textContent ="Las contraseñas no coinciden";
        formularioValido = false;
    }

    const mensajesRegistro = [
        errorRut,
        errorNombre,
        errorApellidos,
        errorCorreo,
        errorDireccion,
        errorPassword,
        errorConfirmarPassword,
    ];
    mensajesRegistro.forEach((mensaje, indice) => {
        gruposRegistro[indice].classList.toggle(
            "invalid",
            mensaje.textContent !== ""
        );
    });

    /*resultado registro*/

    if (formularioValido) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

        if (usuarios.some((u) => u.correo === correo)) {
            errorCorreo.textContent = "Ese correo ya está registrado";
            gruposRegistro[3].classList.add("invalid");
            return;
        }

        usuarios.push({
            run: rut,
            nombre,
            apellidos,
            correo,
            fechaNacimiento: document.getElementById("fechaNacimiento").value,
            region: document.getElementById("region").value,
            comuna: document.getElementById("comuna").value,
            direccion,
            tipoUsuario: "Cliente",
            contrasena: password,
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert("Registro válido. Ahora puedes iniciar sesión.");
        window.location.href = "login.html";
    }
}/*Termino validacion de registro*/


/*validacion de contacto*/
function validarContacto(){
    const nombre =
        document.getElementById("nombreContacto")
        .value.trim();

    const correo =
        document.getElementById("correoContacto")
        .value.trim();

    const comentario =
        document.getElementById("comentario")
        .value.trim();

    const errorNombre =
        document.getElementById("errorNombreContacto");
    
    const errorCorreo =
        document.getElementById("errorCorreoContacto");

    const errorComentario =
        document.getElementById("errorComentario");
    const gruposContacto = [
        errorNombre,
        errorCorreo,
        errorComentario,
    ].map((mensaje) => mensaje.closest(".form-group"));

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorComentario.textContent = "";
    gruposContacto.forEach((grupo) => grupo.classList.remove("invalid"));

    let formularioValido = true;

    /* nombre */
    if(nombre === ""){
        errorNombre.textContent =
            "El nombre es obligatorio";
        formularioValido = false;
    
    }else if(nombre.length > 100){
        errorNombre.textContent =
            "Máximo 100 caracteres";
        formularioValido = false;
    }

    /* correo */
    const dominiosPermitidos = [
        "@duoc.cl",
        "@profesor.duoc.cl",
        "@gmail.com"
    ];

    if(correo === ""){
        errorCorreo.textContent =
            "El correo es obligatorio";
        formularioValido = false;
    }else{
        const dominioValido =
            dominiosPermitidos.some(
                dominio =>
                correo.endsWith(dominio)
            );
        if(!dominioValido){
            errorCorreo.textContent =
                "Correo no permitido";
            formularioValido = false;
        }
    }

    /* comentario */
    if(comentario === ""){
        errorComentario.textContent =
            "El comentario es obligatorio";
        formularioValido = false;
    }else if(comentario.length > 500){
        errorComentario.textContent =
            "Máximo 500 caracteres";
        formularioValido = false;
    }

    const mensajesContacto = [
        errorNombre,
        errorCorreo,
        errorComentario,
    ];
    mensajesContacto.forEach((mensaje, indice) => {
        gruposContacto[indice].classList.toggle(
            "invalid",
            mensaje.textContent !== ""
        );
    });

    /* resultado */
    if(formularioValido){
        alert(
            "Mensaje enviado correctamente"
        );
    }
}/*Termino validacion de contacto*/





