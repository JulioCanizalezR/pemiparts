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
    // Constante tipo objeto con los datos del producto seleccionado.
    const FORM = new FormData();
    FORM.append('idUsuario', PARAMS.get('id'));
    // Petición para obtener los datos del usuario que ha iniciado sesión.
    const DATA = await fetchData(UsuarioApi, 'readProfile',FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
        document.getElementById('imagenUsuario').src = SERVER_URL.concat('images/usuarios/', DATA.dataset.imagen_usuario);
        document.getElementById('nombreUsuario').textContent = DATA.dataset.nombre;
        document.getElementById('apellidoUsuario').textContent = DATA.dataset.apellido;
        document.getElementById('emailUsuario').textContent = DATA.dataset.correo_electronico;
        document.getElementById('cargoUsuario').textContent = DATA.dataset.cargo;
        document.getElementById('telefonoUsuario').textContent = DATA.dataset.numero_telefono;
        document.getElementById('claveUsuario').textContent = DATA.dataset.contraseña;
        document.getElementById('idProducto').value = DATA.dataset.id_usuario;
    } else {
        sweetAlert(2, DATA.error, null);
        // Se limpia el contenido cuando no hay datos para mostrar.
        document.getElementById('detalle').innerHTML = '';
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

