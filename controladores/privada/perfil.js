//perfil.js

const UsuarioApi = "services/admin/usuario.php";

const saveModal = new bootstrap.Modal("#saveModal"),
  modalTitle = document.getElementById("modalTitle");
const seeModal = new bootstrap.Modal("#seeModal"),
  modalTitle2 = document.getElementById("modalTitle2");


// Constantes para establecer los elementos del formulario de editar perfil.
const profileForm = document.getElementById('profileForm'),
idUsuario = document.getElementById("idUsuario"),
Nombre = document.getElementById("nombreUsuario"),
Apellido = document.getElementById("apellidoUsuario"),
Cargo = document.getElementById("cargoUsuario"),
Email = document.getElementById("correoUsuario"),
Telefono = document.getElementById("telefonoUsuario"),
Imagen = document.getElementById("imagenUsuario"),
Clave = document.getElementById("claveUsuario"),
ConfirmarClave = document.getElementById("confirmarClave");

  


// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Petición para obtener los datos del usuario que ha iniciado sesión.
    const DATA = await fetchData(UsuarioApi, 'readProfile');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
        const ROW = DATA.dataset;
        Nombre.value = ROW.id_usuario;
        Apellido.value = ROW.apellido;
        Email.value = ROW.correo_electronico;
        Telefono.value = ROW.numero_telefono;
        Cargo.value = ROW.cargo;
        Image.value = ROW.imagen_usuario;
        Clave.value = ROW.correo_electronico;
    } else {
        sweetAlert(2, DATA.error, null);
    }
});


// Método del evento para cuando se envía el formulario de editar perfil.
profileForm.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(profileForm);
    // Petición para actualizar los datos personales del usuario.
    const DATA = await fetchData(UsuarioApi, 'editProfile', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

