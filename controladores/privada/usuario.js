// Constantes para establecer los elementos del componente Modal.
const Usuario_api = "services/admin/usuario.php";

const SAVE_MODAL = new bootstrap.Modal("#saveModal"),
  MODAL_TITLE = document.getElementById("modalTitle");

const SEE_MODAL = new bootstrap.Modal("#seeModal"),
  MODAL_TITLE2 = document.getElementById("modalTitle2");

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

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se verifica la acción a realizar.
  ID_usuario.value ? (action = "updateRow") : (action = "createRow");
  // Constante tipo objeto con los datos del formulario.
  const FORM = new FormData(SAVE_FORM);
  // Petición para guardar los datos del formulario.
  const DATA = await fetchData(Usuario_api, action, FORM);
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
  fillCards();
});

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
  const DATA = await fetchData(Usuario_api, "readOne", FORM);
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
            const DATA = await fetchData(Usuario_api, 'deleteRow', FORM);
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
    const DATA = await fetchData(Usuario_api, "readOne", FORM);
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

/*const lista_datos = [
    {
        imagen: 'https://www.arideocean.com/wp-content/themes/arkahost/assets/images/default.png',
        Dui: '12345678-9',
        Nombre: 'Juan Torres',
        cargo: 'Empleado',
        Email: 'Juan@gmail.com'
    }
];

/*
* Función asíncrona para llenar las cartas con los registros disponibles.
* Parámetros: form (formulario de búsqueda).
* Retorno: ninguno.
*/

  async function fillCards(form = null) {
    const cargarCartas = document.getElementById("cards");
    // Mostrar materiales de respaldo
    try {
      cargarCartas.innerHTML = "";

      const DATA = await fetchData(Usuario_api, "readAll");
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

async function fillCards(form = null) {
  const cargarCartas = document.getElementById("cards");
  // Mostrar materiales de respaldo
  try {
    cargarCartas.innerHTML = "";

    const DATA = await fetchData(Usuario_api, "readAll");
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
