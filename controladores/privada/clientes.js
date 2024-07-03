// Constantes para establecer los elementos del componente Modal.
const Cliente_api = "services/admin/cliente.php";

const SAVE_MODAL = new bootstrap.Modal("#saveModal"),
  MODAL_TITLE = document.getElementById("modalTitle");

  const TABLE_BODY = document.getElementById('tableBody')

// Constantes para establecer los elementos del formulario de guardar.
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

document.addEventListener('DOMContentLoaded', () => {
  // Llamada a la función para mostrar el encabezado y pie del documento.
  //loadTemplate();
});

SAVE_FORM.addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se verifica la acción a realizar.
  ID_usuario.value ? (action = "updateRow") : (action = "createRow");
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
  // Se verifica la acción a realizar.
  (form) ? action = 'searchRows' : action = 'readAll';
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
                  <td>${row.direccion_cliente}</td>  
                  <td>${row.nombre_empresa}</td>  
                  <td>${row.fecha_registro_cliente}</td>  
                  <td class="d-flex justify-content-center">
                    <img src="../recursos/img/Delete.svg" width="auto" height="auto" alt="Eliminar" onclick="openDelete(${row.id_cliente})" /> 
                   <img src="../recursos/img/Edit.svg" width="auto" height="auto" alt="Editar" onclick="openUpdate(${row.id_cliente})" />
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
  MODAL_TITLE.textContent = "Crear Usuario";
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
  FORM.append("idUsuario", id);
  const DATA = await fetchData(Cliente_api, "readOne", FORM);
  console.log('Id del usuario: ' + id)
  if (DATA.status) {
    SEE_MODAL.show();
    MODAL_TITLE2.textContent = "Información del Usuario";
    // Se inicializan los campos con los datos.
    const ROW = DATA.dataset;
    nombres.textContent = ROW.nombre;
    apellidos.textContent = ROW.apellido;
    cargo.textContent = ROW.cargo;
    email.textContent = ROW.correo_electronico;
    telefono.textContent = ROW.numero_telefono;
    // Asignar el id a los métodos openUpdate y openDelete
    document.getElementById('Actualizar').onclick = () => openUpdate(id);
    document.getElementById('Eliminar').onclick = () => openDelete(id);
  }
};
/*
 *   Función asíncrona para eliminar un registro.
 *   Parámetros: id (identificador del registro seleccionado).
 *   Retorno: ninguno.
 */
const openDelete = async (id) => {
  const RESPONSE = await confirmAction('¿Desea eliminar al usuario de forma permanente?');
  try {
    if (RESPONSE) {
      const FORM = new FormData();
      FORM.append('idUsuario', id);
      const DATA = await fetchData(Cliente_api, 'deleteRow', FORM);
      if (DATA.status) {
        await sweetAlert(1, DATA.message, true);
        //  fillTable();
        fillCards();
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
    SEE_MODAL.hide();
    console.log("Valor del id: ", id);
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append("idUsuario", id);
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
      ID_usuario.value = ROW.id_usuario;
      NOMBRES_usuario.value = ROW.nombre;
      Apellidos_usuario.value = ROW.apellido;
      Cargo_usuario.value = ROW.cargo;
      Email_usuario.value = ROW.correo_electronico;
      TELEFONO_Usuario.value = ROW.numero_telefono;
    } else {
      sweetAlert(2, DATA.error, false);
    }
  } catch (Error) {
    console.log(Error);
  }
};
