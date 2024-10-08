// Constantes para establecer los elementos del componente Modal.

const Cliente_api = "services/admin/cliente.php";
const Empresa_api = "services/admin/empresa.php";
const SAVE_MODAL = new bootstrap.Modal("#saveModal"),
  MODAL_TITLE = document.getElementById("modalTitle");

const TABLE_BODY = document.getElementById('tableBody')

const SEARCH_INPUT = document.getElementById("searchInput");

// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById("saveForm"),
  idCliente = document.getElementById("idCliente"),
  nombreCliente = document.getElementById("nombreCliente"),
  apellidoCliente = document.getElementById("apellidoCliente"),
  correoCliente = document.getElementById("correoCliente"),
  direccionCliente = document.getElementById("direccionCliente"),
  empresaCliente = document.getElementById("nombreEmpresa"),
  telefonoCliente = document.getElementById("telefonoCliente");

// Llamada a la función para establecer la mascara del campo teléfono.
vanillaTextMask.maskInput({
  inputElement: document.getElementById("telefonoCliente"),
  mask: [/\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
});

document.addEventListener('DOMContentLoaded', () => {
  // Llamada a la función para mostrar el encabezado y pie del documento.
  //loadTemplate();
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

SAVE_FORM.addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se verifica la acción a realizar.
  idCliente.value ? (action = "updateRow") : (action = "createRow");
  // Constante tipo objeto con los datos del formulario.
  const FORM = new FormData(SAVE_FORM);
  // Petición para guardar los datos del formulario.
  const DATA = await fetchData(Cliente_api, action, FORM);
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

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {

  TABLE_BODY.innerHTML = '';
  TABLE_BODY.innerHTML = '';
  // Se verifica la acción a realizar.
  let action;
  form ? (action = "searchRows") : (action = "readAll");
  // Petición para obtener los registros disponibles.
  const DATA = await fetchData(Cliente_api, action, form);
  // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
  if (DATA.status) {
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    DATA.dataset.forEach(row => {
      // Se crean y concatenan las filas de la tabla con los datos de cada registro.
      TABLE_BODY.innerHTML += `
              <tr>
                  <td>${row.id_cliente}</td>
                  <td>${row.nombre_cliente}</td>
                  <td>${row.apellido_cliente}</td>
                  <td>${row.correo_electronico_cliente}</td>
                  <td>${row.numero_telefono_cliente}</td>      
                  <td>${row.fecha_registro_cliente}</td>  
                  <td>${row.direccion_cliente}</td>
                  <td class="d-flex justify-content-center">
                     <button type="button" class="btn btn-info"onclick="openUpdate(${row.id_cliente})"">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_cliente})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
              </tr>
          `;
    });

  } else {
    sweetAlert(4, DATA.error, true);
  }
}

const openCreate = () => {
  // Se muestra la caja de diálogo con su título.
  SAVE_MODAL.show();
  MODAL_TITLE.textContent = "Crear cliente";
  // Se prepara el formulario.
  SAVE_FORM.reset();
  fillSelect(Empresa_api, 'readAll', 'nombreEmpresa');
};


/*
 *   Función asíncrona para eliminar un registro.
 *   Parámetros: id (identificador del registro seleccionado).
 *   Retorno: ninguno.
 */
const openDelete = async (id) => {
  const RESPONSE = await confirmAction('¿Desea eliminar al cliente de forma permanente?');
  try {
    if (RESPONSE) {
      const FORM = new FormData();
      FORM.append('idCliente', id);
      const DATA = await fetchData(Cliente_api, 'deleteRow', FORM);
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
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append("idCliente", id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(Cliente_api, "readOne", FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
      // Se muestra la caja de diálogo con su título.
      SAVE_MODAL.show();
      MODAL_TITLE.textContent = "Actualizar el usuario";
      // Se prepara el formulario.
      SAVE_FORM.reset();
      // Se inicializan los campos con los datos.
      const ROW = DATA.dataset;
      idCliente.value = ROW.id_cliente
      nombreCliente.value = ROW.nombre_cliente;
      apellidoCliente.value = ROW.apellido_cliente;
      correoCliente.value = ROW.correo_electronico_cliente;
      direccionCliente.value = ROW.direccion_cliente;
      telefonoCliente.value = ROW.numero_telefono_cliente;
      fillSelect(Empresa_api, 'readAll', 'nombreEmpresa', ROW.id_empresa);
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


const openPredicReport = () => {
  // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
  const PATH = new URL(`${SERVER_URL}reports/admin/clientes_predictivos.php`);
  // Se abre el reporte en una nueva pestaña.
  window.open(PATH.href);
}

const openReport = () => {

  const PATH = new URL(`${SERVER_URL}reports/admin/reporte_general_cliente.php`);

  window.open(PATH.href);
}
