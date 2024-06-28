// Constantes para establecer los elementos del componente Modal.
const Empresa_api= "services/admin/empresa.php";

const SAVE_MODAL = new bootstrap.Modal("#saveModal"),
  MODAL_TITLE = document.getElementById("modalTitle");

const SEE_MODAL = new bootstrap.Modal("#seeModal"),
  MODAL_TITLE2 = document.getElementById("modalTitle2");


// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById("saveForm"),
    ID_empresa = document.getElementById("id_empresa"),
    Nombre_empresa= document.getElementById("Nombre_empresa");

const nombres = document.getElementById('nombre');

document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    //loadTemplate();
});

SAVE_FORM.addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se verifica la acción a realizar.
  ID_empresa.value ? (action = "updateRow") : (action = "createRow");
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
  FORM.append("id_empresa", id);
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
 *   Función asíncrona para eliminar un registro.
 *   Parámetros: id (identificador del registro seleccionado).
 *   Retorno: ninguno.
 */
const openDelete = async (id) => {
    const RESPONSE = await confirmAction('¿Desea eliminar la empresa de forma permanente?');
    try {
        if (RESPONSE) {
            const FORM = new FormData();
            FORM.append('id_empresa', id);
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


async function fillTable(form = null) {
    const CargarEmpresas = document.getElementById("cards");
    // Mostrar materiales de respaldo
    try {
      cargarTabla.innerHTML = "";
  
      const DATA = await fetchData(Empresa_api, "readAll");
      console.log(DATA);
      if (DATA.status) {
        DATA.dataset.forEach((row) => {
          const cardsHtml = ` 
          <div class="col-md-5 col-sm-12">
                      <div class="tarjetas shadow d-flex align-items-center">
                          <!-- Imagen a la izquierda -->
                          <div class="col-6 bg-white tarjetas">
                              <img class="img-fluid imagen"
                                  src="${SERVER_URL}images/usuarios/${row.imagen_usuario}"
                                  alt="...">
                          </div>
                          <!-- Textos a la derecha -->
                          <div class="col-6">
                              <p>Teléfono: <span>${row.numero_telefono}</span></p>
                              <p>Nombre: <span>${row.nombre} ${row.apellido}</span></p>
                              <p>Cargo: <span>${row.cargo}</span></p>
                              <p>Email: <span>${row.correo_electronico}</span></p>
                              <button class="btn botones azul rounded-5" onclick="readOne(${row.id_usuario})">Ver mas...</button>
                          </div>
                      </div>
                  </div>
          `;
          cargarCartas.innerHTML += cardsHtml;
        });
      } else {
        console.log("Error al obtener los datos");
      }
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  }
const openUpdate = async (id) => {
  try {
    SEE_MODAL.hide();
    console.log("Valor del id: ", id);
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append("id_empresa", id);
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
      ID_empresa.value = ROW.id_empresa;
      Nombre_empresa.value = ROW.Nombre_empresa
    } else {
      sweetAlert(2, DATA.error, false);
    }
  } catch (Error) {
    console.log(Error);
  }
};
