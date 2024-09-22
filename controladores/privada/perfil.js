const USUARIO_API = 'services/admin/usuario.php';

// Inicializa los modales y elementos del formulario
const seeModal = new bootstrap.Modal("#seeModal"),
  passwordModal = new bootstrap.Modal("#passwordModal"),
  modalTitle2 = document.getElementById("modalTitle2"),
  passwordTitle = document.getElementById("passwordTitle2");

const profileForm = document.getElementById('seeForm'),
  passwordForm = document.getElementById('passwordForm'),
  idUsuario = document.getElementById("idUsuario"),
  nombreUsuario = document.getElementById("nombreUsuario"),
  apellidoUsuario = document.getElementById("apellidoUsuario"),
  emailUsuario = document.getElementById("correoUsuario"),
  telefonoUsuario = document.getElementById("telefonoUsuario"),
  imagenUsuario = document.getElementById("imagenUsuario"),
  idUsuario2 = document.getElementById("idUsuario2"),
  claveUsuario = document.getElementById("claveUsuario"),
  confirmarClave = document.getElementById("confirmarClave");

const profileCard = document.getElementById('usuarioCard'),
  cardImagen = document.getElementById('imagen'),
  cardNombre = document.getElementById('nombre'),
  cardApellido = document.getElementById('apellido'),
  cardTelefono = document.getElementById('telefono'),
  cardCorreo = document.getElementById('correo');

// Método del evento para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', async () => {
  fillCard();
});

// Método para llenar los datos del perfil
const fillCard = async () => {
  const FORM = new FormData();
  const DATA = await fetchData(USUARIO_API, 'readProfile', FORM);
  if (DATA.status) {
    const ROW = DATA.dataset;
    cardImagen.src = SERVER_URL.concat('images/usuarios/', ROW.imagen_usuario);
    cardNombre.textContent = ROW.nombre;
    cardApellido.textContent = ROW.apellido;
    cardCorreo.textContent = ROW.correo_electronico;
    cardTelefono.textContent = ROW.numero_telefono;
  } else {
    sweetAlert(2, DATA.error, null);
    document.getElementById('detalle').innerHTML = '';
  }
}

// Método del evento para cuando se envía el formulario de cambiar contraseña
passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita que se recargue la página
  console.log("Password form submitted"); // Verifica si el evento se está manejando

  const FORM = new FormData(passwordForm);
  const DATA = await fetchData(USUARIO_API, 'changePassword', FORM);
  
  if (DATA.status) {
    passwordModal.hide();
    sweetAlert(1, DATA.message, true);
    fillCard();
  } else {
    sweetAlert(2, DATA.error, false);
  }
});

// Método del evento para cuando se envía el formulario de editar perfil
profileForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita que se recargue la página
  console.log("Profile form submitted"); // Verifica si el evento se está manejando

  const FORM = new FormData(profileForm);
  const DATA = await fetchData(USUARIO_API, 'editProfile', FORM);
  
  if (DATA.status) {
    seeModal.hide();
    sweetAlert(1, DATA.message, true);
    fillCard();
  } else {
    sweetAlert(2, DATA.error, false);
  }
});

// Método para abrir el modal de cambiar contraseña
const openPassword = () => {
  passwordModal.show();
  passwordTitle.textContent = "Editar Contraseña";
  passwordForm.reset();
}

// Método para abrir el modal de edición de perfil
const openEdit = async (id) => {
  try {
    const FORM = new FormData();
    FORM.append("idCliente", id);
    const DATA = await fetchData(USUARIO_API, 'readProfile', FORM);
    
    if (DATA.status) {
      seeModal.show();
      modalTitle2.textContent = "Actualizar el usuario";
      profileForm.reset();
      const ROW = DATA.dataset;
      idUsuario.value = ROW.id_usuario;
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
