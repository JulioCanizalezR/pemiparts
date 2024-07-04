//Usuario.js

const UsuarioApi = "services/admin/usuario.php";

const saveModal = new bootstrap.Modal("#saveModal"),
  modalTitle = document.getElementById("modalTitle");
const seeModal = new bootstrap.Modal("#seeModal"),
  modalTitle2 = document.getElementById("modalTitle2");


  const seeForm = document.getElementById("seeForm"),
  idUsuario = document.getElementById("idUsuario"),
  nombreUsuario = document.getElementById("nombre"),
  apellidoUsuario = document.getElementById("apellido"),
  cargoUsuario = document.getElementById("cargo"),
  emailUsuario = document.getElementById("email"),
  telefonoUsuario = document.getElementById("telefono"),
  imagenUsuario = document.getElementById("imagen");

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    modalTitle.textContent = "Actualizar el usuario";
    // Petición para obtener los datos del usuario que ha iniciado sesión.
    const DATA = await fetchData(UsuarioApi, 'readProfile');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
        const ROW = DATA.dataset;
        idUsuario.value = ROW.id_usuario;
        nombreUsuario.value =  ROW.nombre;
        sApellido.value = ROW.apellido;
        sCargo.value = ROW.cargo;
        sEmail.value = ROW.correo_electronico;
        sTelefono.value = ROW.numero_telefono;
        sClave.disabled = true;
        sConfirmarClave.disabled = true;
    } else {
        sweetAlert(2, DATA.error, null);
    }
});

const populateUpdateForm = (userData) => {
    saveModal.show();
    
    saveForm.reset();
  };


document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
});