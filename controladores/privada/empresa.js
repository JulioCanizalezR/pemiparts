// Constantes para establecer los elementos del componente Modal.
const Empresa_api = "services/admin/empresa.php";

const SEARCH_INPUT = document.getElementById('searchInput');

const SAVE_MODAL = new bootstrap.Modal("#saveModal"),
  MODAL_TITLE = document.getElementById("modalTitle");

const TABLE_BODY = document.getElementById('tableBody'),
  ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById("saveForm"),
  idEmpresa = document.getElementById("idEmpresa"),
  nombreEmpresa = document.getElementById("nombreEmpresa");

const nombres = document.getElementById('nombre');

SAVE_FORM.addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se verifica la acción a realizar.
  idEmpresa.value ? (action = "updateRow") : (action = "createRow");
  // Constante tipo objeto con los datos del formulario.
  const FORM = new FormData(SAVE_FORM);
  // Petición para guardar los datos del formulario.
  const DATA = await fetchData(Empresa_api, action, FORM);
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

/*
 *   Función para preparar el formulario al momento de insertar un registro.
 *   Parámetros: ninguno.
 *   Retorno: ninguno.
 */

// Método del evento para cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", () => {
  // Llamada a la función para mostrar el encabezado y pie del documento.
  //   loadTemplate();
  fillTable();
});

const openCreate = () => {
  // Se muestra la caja de diálogo con su título.
  SAVE_MODAL.show();
  MODAL_TITLE.textContent = "Crear empresa";
  // Se prepara el formulario.
  SAVE_FORM.reset();
  //fillSelected(lista_datos_categorias, 'readAll', 'categoria');
};

/*
 * Función asíncrona para preparar el formulario al momento de actualizar un registro.
 * Parámetros: id (identificador del registro seleccionado).
 * Retorno: ninguno.
 */

const readOne = async (id) => {
  const FORM = new FormData();
  FORM.append("idEmpresa", id);
  const DATA = await fetchData(Empresa_api, "readOne", FORM);
  console.log('Id de la categoria : ' + id)
  if (DATA.status) {
    SEE_MODAL.show();
    MODAL_TITLE2.textContent = "Información de la empresa";
    // Se inicializan los campos con los datos.
    const ROW = DATA.dataset;
    nombres.textContent = ROW.nombre;
    // Asignar el id a los métodos openUpdate y openDelete
    document.getElementById('Actualizar').onclick = () => openUpdate(id);
    document.getElementById('Eliminar').onclick = () => openDelete(id);
  }
};

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {

  TABLE_BODY.innerHTML = '';
  // Se verifica la acción a realizar.
  let action;
  form ? (action = "searchRows") : (action = "readAll");
  // Petición para obtener los registros disponibles.
  const DATA = await fetchData(Empresa_api, action, form);
  // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
  if (DATA.status) {
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    DATA.dataset.forEach(row => {
      // Se crean y concatenan las filas de la tabla con los datos de cada registro.
      TABLE_BODY.innerHTML +=`
        <tr>
          <td>${row.id_empresa}</td>
          <td>${row.nombre_empresa}</td>
          <td class="d-flex justify-content-center">
            <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_empresa})">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn btn-danger" onclick="op
            enDelete(${row.id_empresa})">
              <i class="fa-solid fa-trash"></i>
            </button>
            <button type="button" class="btn btn-sm btn-warning" onclick="openReport(${row.id_empresa})">
              <i class="bi bi-filetype-pdf"></i>
            </button>
          </td>
        </tr>
      `;
    });

  } else {
    sweetAlert(4, DATA.error, true);
  }
}
/*
 *   Función asíncrona para eliminar un registro.
 *   Parámetros: id (identificador del registro seleccionado).
 *   Retorno: ninguno.
 */
const openDelete = async (id) => {
  const RESPONSE = await confirmAction('¿Desea eliminar la empresa de forma permanente?');
  try {
    if (RESPONSE) {
      const FORM = new FormData();
      FORM.append('idEmpresa', id);
      const DATA = await fetchData(Empresa_api, 'deleteRow', FORM);
      if (DATA.status) {
        await sweetAlert(1, DATA.message, true);
        fillTable();
      } else {
        sweetAlert(2, DATA.error, false);
      }
    }
  }

  catch (Error) {
    console.log(Error + ' Error al cargar el mensaje');
  }

}



const openUpdate = async (id) => {
  try {
    const FORM = new FormData();
    FORM.append("idEmpresa", id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(Empresa_api, "readOne", FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
      // Se muestra la caja de diálogo con su título.
      SAVE_MODAL.show();
      MODAL_TITLE.textContent = "Actualizar la empresa";
      // Se prepara el formulario.
      SAVE_FORM.reset();
      // Se inicializan los campos con los datos.
      const ROW = DATA.dataset;
      idEmpresa.value = ROW.id_empresa;
      nombreEmpresa.value = ROW.nombre_empresa
    } else {
      sweetAlert(2, DATA.error, false);
    }
  } catch (Error) {
    console.log(Error);
  }
};

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

const openReport = (id) => {
  // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
  const PATH = new URL(`${ SERVER_URL } reports / admin / clientes_empresa.php`);
  // Se agrega un parámetro a la ruta con el valor del registro seleccionado.
  PATH.searchParams.append('idEmpresa', id);
  // Se abre el reporte en una nueva pestaña.
  window.open(PATH.href);
}

const openReport2 = () => {
 
  const PATH = new URL(`${ SERVER_URL } reports/admin/reporte_general_empresa.php`);
 
  window.open(PATH.href);
}
