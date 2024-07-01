//Usuario.js

const UsuarioApi = "services/admin/usuario.php";

const saveModal = new bootstrap.Modal("#saveModal"),
  modalTitle = document.getElementById("modalTitle");
const seeModal = new bootstrap.Modal("#seeModal"),
  modalTitle2 = document.getElementById("modalTitle2");

const saveForm = document.getElementById("saveForm"),
  sidUsuario = document.getElementById("idUsuario"),
  sNombre = document.getElementById("nombreUsuario"),
  sApellido = document.getElementById("apellidoUsuario"),
  sCargo = document.getElementById("cargoUsuario"),
  sEmail = document.getElementById("correoUsuario"),
  sTelefono = document.getElementById("telefonoUsuario"),
  sImagen = document.getElementById("imagenUsuario"),
  sClave = document.getElementById("claveUsuario"),
sConfirmarClave = document.getElementById("confirmarClave");

const seeForm = document.getElementById("seeForm"),
  idUsuario = document.getElementById("idUsuario"),
  nombreUsuario = document.getElementById("nombre"),
  apellidoUsuario = document.getElementById("apellido"),
  cargoUsuario = document.getElementById("cargo"),
  emailUsuario = document.getElementById("email"),
  telefonoUsuario = document.getElementById("telefono"),
  imagenUsuario = document.getElementById("imagen");



document.addEventListener("DOMContentLoaded", () => {
  fillCards();
});

saveForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveOrUpdateUser();
});


seeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveOrUpdateUser();
});

const saveOrUpdateUser = async () => {
  const action = idUsuario.value ? "updateRow" : "createRow";
  const formData = new FormData(saveForm);
  const data = await fetchData(UsuarioApi, action, formData);

  if (data.status) {
    saveModal.hide();
    sweetAlert(1, data.message, true);
    fillCards();
  } else {
    sweetAlert(4, data.error, true);
  }
};

const openCreate = () => {
  saveModal.show();
  modalTitle.textContent = "Crear Usuario";
  saveForm.reset();
};

const readOne = async (id) => {
  const formData = new FormData();
  formData.append("idUsuario", id);
  const data = await fetchData(UsuarioApi, "readOne", formData);

  if (data.status) {
    populateUserModal(data.dataset);
  } else {
    sweetAlert(4, data.error, true);
  }
};

const populateUserModal = (userData) => {
  seeModal.show();
  modalTitle2.value = "Información del Usuario";
  nombreUsuario.textContent = userData.nombre;
  apellidoUsuario.textContent = userData.apellido;
  cargoUsuario.value = userData.cargo == 1 ? 'Empleado' : 'Gerente';
  imagenUsuario.src = `${SERVER_URL}images/usuarios/${userData.imagen_usuario}`;
  emailUsuario.textContent = userData.correo_electronico;
  telefonoUsuario.textContent = userData.numero_telefono;
  document.getElementById('Actualizar').onclick = () => openUpdate(userData.id_usuario);
  document.getElementById('Eliminar').onclick = () => openDelete(userData.id_usuario);
};

const openDelete = async (id) => {
  const response = await confirmAction('¿Desea eliminar al usuario de forma permanente?');
  if (response) {
    const formData = new FormData();
    formData.append('idUsuario', id);
    const data = await fetchData(UsuarioApi, 'deleteRow', formData);

    if (data.status) {
      await sweetAlert(1, data.message, true);
      fillCards();
    } else {
      sweetAlert(2, data.error, false);
    }
  }
};

const openUpdate = async (id) => {
  seeModal.hide();
  const formData = new FormData();
  formData.append("idUsuario", id);
  const data = await fetchData(UsuarioApi, "readOne", formData);

  if (data.status) {
    populateUpdateForm(data.dataset);
  } else {
    sweetAlert(2, data.error, false);
  }
};

const populateUpdateForm = (userData) => {
  saveModal.show();
  modalTitle.textContent = "Actualizar el usuario";
  saveForm.reset();
  sidUsuario.value = userData.id_usuario;
  sNombre.value = userData.nombre;
  sApellido.value = userData.apellido;
  sCargo.value = userData.cargo;
  sEmail.value = userData.correo_electronico;
  sTelefono.value = userData.numero_telefono;
  sClave.value = userData.contraseña;
  sConfirmarClave.value = userData.contraseña;
};

const fillCards = async () => {
  const cardsContainer = document.getElementById("cards");
  try {
    cardsContainer.innerHTML = "";
    const data = await fetchData(UsuarioApi, "readAll");
    if (data.status) {
      data.dataset.forEach(user => {
        const userCard = createUserCard(user);
        cardsContainer.innerHTML += userCard;
      });
    } else {
      console.error("Error al obtener los datos:", data.error);
    }
  } catch (error) {
    console.error("Error al obtener datos de la API:", error);
  }
};

const createUserCard = (user) => {
  const cargoField = user.cargo == 1 ? 'Empleado' : 'Gerente';
  return `
    <div class="col-md-5 col-sm-12 mb-4">
      <div class="tarjeta shadow d-flex align-items-center p-3">
        <div class="col-4 p-2 d-flex justify-content-center align-items-center">
          <img class="img-fluid rounded" src="${SERVER_URL}images/usuarios/${user.imagen_usuario}" alt="${user.nombre}">
        </div>
        <div class="col-8 p-2 d-flex flex-column">
          <p class="text-secondary mb-1">Nombre: ${user.nombre} ${user.apellido}</p>
          <p class="text-secondary mb-1">Cargo: ${cargoField}</p>
          <p class="text-secondary mb-1">Correo: ${user.correo_electronico}</p>
          <p class="text-secondary mb-1">Teléfono: ${user.numero_telefono}</p>
          <div class="mt-auto d-flex justify-content-end">
            <button class="btn btn-primary" onclick="readOne(${user.id_usuario})">Ver más</button>
          </div>
        </div>
      </div>
    </div>`;
};

