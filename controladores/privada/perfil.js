//perfil.js
const USUARIO_API = 'services/admin/usuario.php'

const seeModal = new bootstrap.Modal("#seeModal"),
  modalTitle2 = document.getElementById("modalTitle2");

const SEARCH_INPUT = document.getElementById("searchInput");

// Constantes para establecer los elementos del formulario de editar perfil.
// Constantes para establecer los elementos del formulario de editar perfil.
const profileForm = document.getElementById('seeForm'),
  idUsuario = document.getElementById("idUsuario"),
  nombreUsuario = document.getElementById("nombreUsuario"),
  apellidoUsuario = document.getElementById("apellidoUsuario"),
  cargoUsuario = document.getElementById("cargoUsuario"),
  emailUsuario = document.getElementById("correoUsuario"),
  telefonoUsuario = document.getElementById("telefonoUsuario"),
  imagenUsuario = document.getElementById("imagenUsuario");

const passwordModal = new bootstrap.Modal("#passwordModal"),
  passwordTitle = document.getElementById("passwordTitle2");

const passwordForm = document.getElementById('passwordForm'),
  idUsuario2 = document.getElementById("idUsuario2"),
  claveUsuario = document.getElementById("claveUsuario"),
  confirmarClave = document.getElementById("confirmarClave");

const profileCard = document.getElementById('usuarioCard'),
  cardImagen = document.getElementById('imagen'),
  cardNombre = document.getElementById('nombre'),
  cardApellido = document.getElementById('apellido'),
  cardTelefono = document.getElementById('telefono'),
  cardCorreo = document.getElementById('correo');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
  fillCard();
});

const fillCard = async (form = null) => {
  // Constante tipo objeto con los datos del usuario seleccionado.
  const FORM = new FormData();

  // Petición para obtener los datos del usuario que ha iniciado sesión.
  const DATA = await fetchData(USUARIO_API, 'readProfile', FORM);
  // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
  if (DATA.status) {
    const ROW = DATA.dataset;
    cargo = (ROW.cargo == 0 ? 'Gerente' : 'Empleado')
    // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
    cardImagen.src = SERVER_URL.concat('images/usuarios/', ROW.imagen_usuario);
    cardNombre.textContent = ROW.nombre;
    cardApellido.textContent = ROW.apellido;
    cardCorreo.textContent = ROW.correo_electronico;
    cardTelefono.textContent = ROW.numero_telefono;
  } else {
    sweetAlert(2, DATA.error, null);
    // Se limpia el contenido cuando no hay datos para mostrar.
    document.getElementById('detalle').innerHTML = '';
  }
}

// Método del evento para cuando se envía el formulario de editar perfil.
passwordForm.addEventListener('submit', async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Constante tipo objeto con los datos del formulario.
  const FORM = new FormData(passwordForm);
  // Petición para actualizar los datos personales del usuario.
  const DATA = await fetchData(USUARIO_API, 'changePassword', FORM);
  // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
  if (DATA.status) {
    passwordModal.hide();
    sweetAlert(1, DATA.message, true);
    fillCard();

  } else {
    sweetAlert(2, DATA.error, false);
  }
});

vanillaTextMask.maskInput({
  inputElement: document.getElementById("telefonoUsuario"),
  mask: [/\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
});

profileForm.addEventListener('submit', async (event) => {

});
/*
SEARCH_INPUT.addEventListener("input", (event) => {
  // Constante tipo objeto con los datos del formulario.
  event.preventDefault();
  const FORM = new FormData();
  FORM.append("search", SEARCH_INPUT.value);
  if (SEARCH_INPUT.value == "") {
    fillCards();
  }
  // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
  fillCards(FORM);
});
*/
const openPassword = () => {
  // Se abre la caja de diálogo que contiene el formulario.
  passwordModal.show();
  passwordTitle.textContent = "Editar Contraseña";
  // Se restauran los elementos del formulario.
  passwordForm.reset();
}

const openEdit = async (id) => {
  try {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append("idCliente", id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(USUARIO_API, 'readProfile', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
      // Se muestra la caja de diálogo con su título.
      seeModal.show();
      modalTitle2.textContent = "Actualizar el usuario";
      // Se prepara el formulario.
      profileForm.reset();
      // Se inicializan los campos con los datos.
      const ROW = DATA.dataset;
      idUsuario.value = ROW.id_usuario
      nombreUsuario.value = ROW.nombre;
      apellidoUsuario.value = ROW.apellido;
      emailUsuario.value = ROW.correo_electronico;
      telefonoUsuario.value = ROW.numero_telefono;

    } else {
      sweetAlert(2, DATA.error, false);
    }
  } catch (Error) {
    console.log(Error);
  }
};