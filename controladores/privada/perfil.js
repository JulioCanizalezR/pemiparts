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


document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
});