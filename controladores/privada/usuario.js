//Usuario.js
const Usuario_api = "services/admin/usuario.php";

const SAVE_MODAL = new bootstrap.Modal("#saveModal"),
  MODAL_TITLE = document.getElementById("modalTitle");

const SEE_MODAL = new bootstrap.Modal("#seeModal"),
  MODAL_TITLE2 = document.getElementById("modalTitle2");

const SAVE_FORM = document.getElementById("saveForm"),
  ID_usuario = document.getElementById("idUsuario"),
  NOMBRES_usuario = document.getElementById("Nombres"),
  Apellidos_usuario = document.getElementById("Apellidos"),
  Cargo_usuario = document.getElementById("Cargo"),
  Email_usuario = document.getElementById("Email"),
  TELEFONO_Usuario = document.getElementById("Telefono"),
  IMAGEN_usuario = document.getElementById("imagen");

const nombres = document.getElementById('nombre'),
  apellidos = document.getElementById('apellido'),
  cargo = document.getElementById("cargo"),
  email = document.getElementById("email"),
  telefono = document.getElementById("telefono");

SAVE_FORM.addEventListener("submit", async (event) => {
  event.preventDefault();
  const action = ID_usuario.value ? "updateRow" : "createRow";
  const FORM = new FormData(SAVE_FORM);
  const DATA = await fetchData(Usuario_api, action, FORM);

  if (DATA.status) {
    SAVE_MODAL.hide();
    sweetAlert(1, DATA.message, true);
    fillTable();
  } else {
    sweetAlert(2, DATA.error, false);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fillCards();
});

const openCreate = () => {
  SAVE_MODAL.show();
  MODAL_TITLE.textContent = "Crear Usuario";
  SAVE_FORM.reset();
};

const readOne = async (id) => {
  const FORM = new FormData();
  FORM.append("idUsuario", id);
  const DATA = await fetchData(Usuario_api, "readOne", FORM);

  if (DATA.status) {
    SEE_MODAL.show();
    MODAL_TITLE2.textContent = "Información del Usuario";
    const ROW = DATA.dataset;
    nombres.textContent = ROW.nombre;
    apellidos.textContent = ROW.apellido;
    cargo.textContent = ROW.cargo;
    email.textContent = ROW.correo_electronico;
    telefono.textContent = ROW.numero_telefono;
    document.getElementById('Actualizar').onclick = () => openUpdate(id);
    document.getElementById('Eliminar').onclick = () => openDelete(id);
  }
};

const openDelete = async (id) => {
  const RESPONSE = await confirmAction('¿Desea eliminar al usuario de forma permanente?');
  if (RESPONSE) {
    const FORM = new FormData();
    FORM.append('idUsuario', id);
    const DATA = await fetchData(Usuario_api, 'deleteRow', FORM);

    if (DATA.status) {
      await sweetAlert(1, DATA.message, true);
      fillCards();
    } else {
      sweetAlert(2, DATA.error, false);
    }
  }
};

const openUpdate = async (id) => {
  SEE_MODAL.hide();
  const FORM = new FormData();
  FORM.append("idUsuario", id);
  const DATA = await fetchData(Usuario_api, "readOne", FORM);

  if (DATA.status) {
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = "Actualizar el usuario";
    SAVE_FORM.reset();
    const ROW = DATA.dataset;
    ID_usuario.value = ROW.id_usuario;
    NOMBRES_usuario.value = ROW.nombre;
    Apellidos_usuario.value = ROW.apellido;
    Cargo_usuario.value = ROW.cargo;
    Email_usuario.value = ROW.correo_electronico;
    TELEFONO_Usuario.value = ROW.numero_telefono;
  } else {
    sweetAlert(2, DATA.error, false);
  }
};

async function fillCards(form = null) {
  const cargarCartas = document.getElementById("cards");
  try {
    cargarCartas.innerHTML = "";
    const DATA = await fetchData(Usuario_api, "readAll");
    if (DATA.status) {
      DATA.dataset.forEach((row) => {
        cargoField = (row.cargo == 1) ? 'Empleado' : 'Gerente';
        const cardHtml = `
          <div class="col-md-5 col-sm-12 mb-4">
            <div class="tarjeta shadow d-flex align-items-center p-3">
              <div class="col-4 p-2 d-flex justify-content-center align-items-center">
                <img class="img-fluid" src="${SERVER_URL}images/usuarios/${row.imagen_usuario}" alt="${row.nombre}">
              </div>
              <div class="col-8 p-2 d-flex flex-column">
                <p class="text-secondary mb-1">Nombre: ${row.nombre} ${row.apellido}</p>
                <p class="text-secondary mb-1">Cargo: ${cargoField}</p>
                <p class="text-secondary mb-1">Correo: ${row.correo_electronico}</p>
                <p class="text-secondary mb-1">Teléfono: ${row.numero_telefono}</p>
                <div class="mt-auto d-flex justify-content-end">
                  <button class="btn btn-primary" onclick="readOne(${row.id_usuario})">Ver más</button>
                </div>
              </div>
            </div>
          </div>`;
        cargarCartas.innerHTML += cardHtml;
      });
    } else {
      console.log("Error al obtener los datos");
    }
  } catch (error) {
    console.error("Error al obtener datos de la API:", error);
  }
}
