//Usuario.js

const UsuarioApi = "services/admin/cotizacion.php";

const saveModal = new bootstrap.Modal("#saveModal"),
  modalTitle = document.getElementById("modalTitle");
const seeModal = new bootstrap.Modal("#seeModal"),
  modalTitle2 = document.getElementById("modalTitle2");

const SEARCH_INPUT = document.getElementById("searchInput");

const saveForm = document.getElementById("saveForm"),
  sidCotizacion = document.getElementById("idCotizacion"),
  sNombre = document.getElementById("nombreCliente"),
  sApellido = document.getElementById("apellidoCliente"),
  sTipoEnvio = document.getElementById("tipoEnvio"),
  sTotal = document.getElementById("total"),
  sNombreAlmacen = document.getElementById("nombreContenedor"),
  sTiempo_inicial = document.getElementById("tiempoInicial"),
  sTiempo_final = document.getElementById("tiempoFinal"),
  sidContenedor = document.getElementById("idContenedor");
const seeForm = document.getElementById("seeForm"),
  idCotizacion = document.getElementById("idCotizacion"),
  nombre = document.getElementById("nombre_cliente"),
  apellido = document.getElementById("apellido_cliente"),
  TipoEnvio = document.getElementById("tipoEnvio"),
  Total = document.getElementById("Total"),
  NombreAlmacen = document.getElementById("nombre_contenedor"),
  Tiempo_inicial = document.getElementById("tiempo_inicial"),
  Tiempo_final = document.getElementById("tiempo_final"),
  idContenedor = document.getElementById("id_contenedor");

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
  const action = sidCotizacion ? "updateRow" : "createRow";
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
  modalTitle.textContent = "Crear cotizacion";
  saveForm.reset();
  sConfirmarClave.disabled = false;
  sClave.disabled = false;
};

const readOne = async (id) => {
  const formData = new FormData();
  formData.append("idCotizacion", id);
  const data = await fetchData(UsuarioApi, "readOne", formData);

  if (data.status) {
    populateUserModal(data.dataset);
  } else {
    sweetAlert(4, data.error, true);
  }
};

const populateUserModal = (userData) => {
  seeModal.show();
  modalTitle2.value = "Información de la cotizacion";
  NombreAlmacen.textContent=userData.
  Tiempo_inicial.textContent= userData.tiempo_inicial;
  Tiempo_final.textContent= userData.tiempo_final;
  document.getElementById("Actualizar").onclick = () =>
    openUpdate(userData.id_usuario);
  document.getElementById("Eliminar").onclick = () =>
    openDelete(userData.id_usuario);
};

const openDelete = async (id) => {
  const response = await confirmAction(
    "¿Desea eliminar al usuario de forma permanente?"
  );
  if (response) {
    const formData = new FormData();
    formData.append("idUsuario", id);
    const data = await fetchData(UsuarioApi, "deleteRow", formData);

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
  sClave.disabled = true;
  sConfirmarClave.disabled = true;
};

const fillCards = async (form = null) => {
  const cardsContainer = document.getElementById("cards");
  try {
    cardsContainer.innerHTML = "";
    cardsContainer.innerHTML = "";
    let action;
    form ? (action = "searchRows") : (action = "readAll");
    const data = await fetchData(UsuarioApi, action, form);
    if (data.status) {
      data.dataset.forEach((user) => {
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
  const envio = user.estado_envio == 1 ? "Entregado" : "Finalizado";
  return `
    <div class="container mt-5">
                    <div class="p-5 custom-rounded">
                        <div class="row w-100">
                            <div class="col">
                                <h3>${user.id_envio}</h3>
                                <h4>${user.nombre_cliente}</h4>
                                <h4>Envio: ${envio}</h4>
                            </div>
                            <div class="col">
                                <h3 class="text-end">Activa</h3>
                            </div>
                        </div>
                        <div class="row w-100 mt-auto">
                            <div class="col">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4>${user.fecha_estimada}</h4>
                                    <button class="btn btn-secondary">Ver más</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
`;
};


var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})