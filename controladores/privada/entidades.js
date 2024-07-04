// Constantes para establecer los elementos del componente Modal.
const entidad_api = "services/admin/entidades.php";
const producto_api = "services/admin/producto.php";
const contenedor_api = "services/admin/contenedor.php";

// Constante para establecer el formulario de buscar.
const SEARCH_INPUT = document.getElementById("searchInput");

// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById("tableBody"),
  ROWS_FOUND = document.getElementById("rowsFound");

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal("#saveModal"),
  MODAL_TITLE = document.getElementById("modalTitle");

// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById("saveForm"),
  ID_ENTIDAD = document.getElementById("idEntidad"),
  ID_ALMACENAMIENTO = document.getElementById("almacenamiento"),
  ID_PRODUCTO = document.getElementById("producto"),
  EXISTENCIAS = document.getElementById("existencia"),
  AUMENTAR_EXISTENCIAS = document.getElementById("aumentarExistencias"),
  ESTADO = document.getElementById("estado");

/*
 *   Función asíncrona para llenar la tabla con los registros disponibles.
 *   Parámetros: form (objeto opcional con los datos de búsqueda).
 *   Retorno: ninguno.
 */

const fillTable = async (form = null) => {
  // Se inicializa el contenido de la tabla.
  ROWS_FOUND.textContent = "";
  TABLE_BODY.innerHTML = "";
  // Se verifica la acción a realizar.
  let action;
  form ? (action = "searchRows") : (action = "readAll");
  // Petición para obtener los registros disponibles.
  const DATA = await fetchData(entidad_api, action, form);
  // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
  if (DATA.status) {
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    DATA.dataset.forEach((row) => {
      // Se crean y concatenan las filas de la tabla con los datos de cada registro.
      TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.id_entidad}</td>
                    <td>${row.nombre_almacenamiento}</td>
                    <td>${row.nombre_producto}</td>
                    <td>${row.existencias}</td>
                    <td>${row.estado}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_entidad})">
                        <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_entidad})">
                        <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
    });
    // Se muestra un mensaje de acuerdo con el resultado.
    ROWS_FOUND.textContent = DATA.message;
  } else {
    sweetAlert(4, DATA.error, true);
  }
};

/*
 * Función asíncrona para preparar el formulario al momento de actualizar un registro.
 * Parámetros: id (identificador del registro seleccionado).
 * Retorno: ninguno.
 */
const openUpdate = async (id) => {
  // Se define un objeto con los datos del registro seleccionado.
  const FORM = new FormData();
  FORM.append("idEntidad", id);
  // Petición para obtener los datos del registro solicitado.
  const DATA = await fetchData(entidad_api, "readOne", FORM);
  // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
  if (DATA.status) {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = "Actualizar contenedor";
    // Se prepara el formulario.
    SAVE_FORM.reset();
    EXISTENCIAS.disabled = true;
    AUMENTAR_EXISTENCIAS.disabled = false;
    document.getElementById('modificar').classList.remove('d-none');
    // Se inicializan los campos con los datos.
    const ROW = DATA.dataset;
    ID_ENTIDAD.value = ROW.id_entidad;
    fillSelect(producto_api, 'readAll', 'producto', ROW.id_producto);
    fillSelect(contenedor_api, 'readAll', 'almacenamiento',ROW.id_almacenamiento);
    ESTADO.value = ROW.estado;
    EXISTENCIAS.value = ROW.existencias;
  } else {
    sweetAlert(2, DATA.error, false);
  }
};

const openCreate = () => {
  // Se muestra la caja de diálogo con su título.
  SAVE_MODAL.show();
  MODAL_TITLE.textContent = "Crear contenedor";
  // Se prepara el formulario.
  SAVE_FORM.reset();
  fillSelect(producto_api, 'readAll', 'producto' );
  fillSelect(contenedor_api, 'readAll', 'almacenamiento');
  EXISTENCIAS.disabled = false;
  AUMENTAR_EXISTENCIAS.disabled = true;
  document.getElementById('modificar').classList.add('d-none');
};

/*
 *   Función asíncrona para eliminar un registro.
 *   Parámetros: id (identificador del registro seleccionado).
 *   Retorno: ninguno.
 */
const openDelete = async (id) => {
  // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
  const RESPONSE = await confirmAction(
    "¿Desea eliminar el contenedor de forma permanente?"
  );
  // Se verifica la respuesta del mensaje.
  if (RESPONSE) {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append("idEntidad", id);
    // Petición para eliminar el registro seleccionado.
    const DATA = await fetchData(entidad_api, "deleteRow", FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
      // Se muestra un mensaje de éxito.
      await sweetAlert(1, DATA.message, true);
      // Se carga nuevamente la tabla para visualizar los cambios.
      fillTable();
    } else {
      sweetAlert(2, DATA.error, false);
    }
  }
};

// Método del evento para cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", () => {
  fillTable();
});

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_INPUT.addEventListener("input", (event) => {
  // Constante tipo objeto con los datos del formulario.
  event.preventDefault();
  const FORM = new FormData();
  FORM.append("search", SEARCH_INPUT.value);
  if (SEARCH_INPUT.value == "") {
    fillTable();
  }
  // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
  fillTable(FORM);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se verifica la acción a realizar.
  ID_ENTIDAD.value ? (action = "updateRow") : (action = "createRow");
  // Constante tipo objeto con los datos del formulario.
  const FORM = new FormData(SAVE_FORM);
  // Petición para guardar los datos del formulario.
  const DATA = await fetchData(entidad_api, action, FORM);
  // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
  if (DATA.status) {
    // Se cierra la caja de diálogo.
    SAVE_MODAL.hide();
    // Se muestra un mensaje de éxito.
    sweetAlert(1, DATA.message, true);
    // Se carga nuevamente la tabla para visualizar los cambios.
    fillTable();
  } else {
    sweetAlert(2, DATA.error, false);
  }
});

var popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
);
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});
