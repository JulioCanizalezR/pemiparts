const COTIZACION_API = "services/admin/cotizacion.php";
const CLIENTE_API = "services/admin/cliente.php";
const ENTIDAD_API = "services/admin/entidades.php";

// Constante para establecer el formulario de buscar.
const SEARCH_INPUT = document.getElementById("searchInput");

// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#cotizacionModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_ENVIO = document.getElementById('idEnvio');


const DETALLE_MODAL = new bootstrap.Modal('#detalleModal'),
    DETALLE_TITLE = document.getElementById('detalleTitle');

// Constantes para establecer los elementos del modal envio.
const ENVIO_MODAL = new bootstrap.Modal('#envioModal'),
    ENVIO_TITLE = document.getElementById('envioTitle');

const ENVIO_FORM = document.getElementById('envioForm'),
    ID_ENVIO2 = document.getElementById('idEnvio2'),
    FECHA_ESTIMADA2 = document.getElementById('fechaEstimada2'),
    NUMERO_SEGUIMIENTO2 = document.getElementById('numeroSeguimiento2'),
    ETIQUETA_EDIFICACION2 = document.getElementById('etiquetaEdificacion2'),
NOMBRE_CLIENTE2 = document.getElementById('nombreCliente2');


const DETALLE_FORM = document.getElementById('detalleEnvioForm'),
    ID_DETALLE = document.getElementById('idDetalle2'),
    ID_ENVIO_DETALLE = document.getElementById('idEnvioD2'),
    MEDIO_ENVIO = document.getElementById('medioEnvio2'),
    COSTO_ENVIO = document.getElementById('costoEnvio2'),
    IMPUESTO_ENVIO = document.getElementById('impuestoEnvio2'),
    NOMBRE_ENTIDAD = document.getElementById('nombreEntidad2'),
    CANTIDAD_ENTIDAD = document.getElementById('cantidadEntidad2'),
DIRECCION_ENVIO = document.getElementById('direccionEnvio2');

const COTIZACIONES_POR_PAGINA = 2;
let paginaActual = 1;
let cotizaciones = [];


// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    fillTableDetalle();
});

$(document).ready(function () {
    document.getElementById('btnSiguienteCotizacion').addEventListener('click', function () {
        document.getElementById('cotizacionSection').classList.add('d-none');
        document.getElementById('detalleCotizacionSection').classList.remove('d-none');
    });

    document.getElementById('btnRegresarDetalleCotizacion').addEventListener('click', function () {
        document.getElementById('detalleCotizacionSection').classList.add('d-none');
        document.getElementById('cotizacionSection').classList.remove('d-none');
    });
});

// Función para obtener cotizaciones
async function obtenerCotizaciones(form = null) {
    try {
        let action = form ? 'searchRows' : 'readAllCoti';
        const DATA = await fetchData(COTIZACION_API, action, form);
        if (DATA.status) {
            return DATA.dataset;
        } else {
            console.log("No se encontraron coincidencias.");
            return [];
        }
    } catch (error) {
        console.error('Error al obtener cotizaciones de la API:', error);
        return [];
    }
}

// Función para obtener detalles de cotizaciones
async function obtenerDetallesCotizaciones(form = null) {
    try {
        const DATA = await fetchData(COTIZACION_API, 'readAllDetalle', form);
        if (DATA.status) {
            return DATA.dataset;
        } else {
            console.log("No se encontraron coincidencias.");
            return [];
        }
    } catch (error) {
        console.error('Error al obtener detalles de cotizaciones de la API:', error);
        return [];
    }
}
let detallesPorCotizacion = {};   

// Función para llenar la tabla con cotizaciones y detalles
async function fillTableDetalle(form = null) {
    try {
        cotizaciones = await obtenerCotizaciones(form);
        const detallesCotizaciones = await obtenerDetallesCotizaciones(form);

        // Agrupar detalles de cotización por ID de cotización
        detallesPorCotizacion = detallesCotizaciones.reduce((acc, detalle) => {
            if (!acc[detalle.id_envio]) {
                acc[detalle.id_envio] = [];
            }
            acc[detalle.id_envio].push(detalle);
            return acc;
        }, {});

        mostrarDetalleCotizacion();
        actualizarPaginacion();
    } catch (error) {
        console.error('Error al llenar la tabla:', error);
    }
}


// Función para mostrar detalle de cotizaciones en la tabla
function mostrarDetalleCotizacion() {
    TABLE_BODY.innerHTML = '';
    const inicio = (paginaActual - 1) * COTIZACIONES_POR_PAGINA;
    const fin = inicio + COTIZACIONES_POR_PAGINA;
    const cotizacionesPagina = cotizaciones.slice(inicio, fin);

    for (const ROW of cotizacionesPagina) {
        const detalles = detallesPorCotizacion[ROW.id_envio] || [];
        const tablaHtml = `
            <div class="card mb-3">
                <div class="card-body ">
                    <h5 class="card-title">Información General de Envíos</h5>
                    <p class="card-text">Estado del Envío: ${ROW.estado_envio}</p>
                    <p class="card-text">Fecha Estimada: ${ROW.fecha_estimada}</p>
                    <p class="card-text">Número de Seguimiento: ${ROW.numero_seguimiento}</p>
                    <p class="card-text">Etiqueta Edificación: ${ROW.etiqueta_edificacion}</p>
                    <p class="card-text">Nombre Cliente: ${ROW.nombre_cliente}</p>

                    <div class="d-flex justify-content-end mb-3">
                        <button type="button" class="btn btn-info me-2" onclick="openUpdate(${ROW.id_envio})">
                            <i class="fa-solid fa-pen-to-square"></i> Editar
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${ROW.id_envio})">
                            <i class="fa-solid fa-trash"></i> Eliminar
                        </button>
                    </div>

                    <div class="accordion" id="accordionExample-${ROW.id_envio}">
                        ${detalles.map(detalle => `
                        <div class="accordion-item border-0">
                            <h2 class="accordion-header text-center" id="heading-${detalle.id_detalle_envio}">
                                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${detalle.id_detalle_envio}" aria-expanded="true" aria-controls="collapse-${detalle.id_detalle_envio}">
                                    Ver más
                                </button>
                            </h2>
                            <div id="collapse-${detalle.id_detalle_envio}" class="accordion-collapse collapse" aria-labelledby="heading-${detalle.id_detalle_envio}" data-bs-parent="#accordionExample-${ROW.id_envio}">
                                <div class="accordion-body">
                                    <table class="table table-striped rounded-3 overflow-hidden mt-5">
                                        <thead class="table-primary">
                                            <tr>
                                                <th scope="col">ID Detalle</th>
                                                <th scope="col">Medio de Envío</th>
                                                <th scope="col">Costo de Envío</th>
                                                <th scope="col">Impuesto de Envío</th>
                                                <th scope="col">Nombre de la Entidad</th>
                                                <th scope="col">Cantidad Entidad</th>
                                                <th scope="col">Dirección de Envío</th>
                                                <th scope="col">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>${detalle.id_detalle_envio}</td>
                                                <td>${detalle.medio_envio}</td>
                                                <td>${detalle.costo_envio}</td>
                                                <td>${detalle.impuesto_envio}</td>
                                                <td>${detalle.nombre_almacenamiento}</td>
                                                <td>${detalle.cantidad_entidad}</td>
                                                <td>${detalle.direccion_envio}</td>
                                                <td>
                                                    <button type="button" class="btn btn-info" onclick="openUpdateDetalle(${detalle.id_detalle_envio})">
                                                        <i class="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-danger" onclick="openDeleteDetalle(${detalle.id_detalle_envio})">
                                                        <i class="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        TABLE_BODY.innerHTML += tablaHtml;
    }
}


function actualizarPaginacion() {
    const totalPaginas = Math.ceil(cotizaciones.length / COTIZACIONES_POR_PAGINA);
    document.getElementById('pageInfo').textContent = `Página ${paginaActual} de ${totalPaginas}`;

    document.getElementById('prevPage').disabled = paginaActual === 1;
    document.getElementById('nextPage').disabled = paginaActual === totalPaginas;
}

function nextPage() {
    const totalPaginas = Math.ceil(cotizaciones.length / COTIZACIONES_POR_PAGINA);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        mostrarDetalleCotizacion();
        actualizarPaginacion();
    }
}

function prevPage() {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarDetalleCotizacion();
        actualizarPaginacion();
    }
}

const openUpdate = async (id) => {
    // Aqui defini un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idEnvio', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(COTIZACION_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Mostrar la caja de diálogo con su título.
        ENVIO_MODAL.show();
        ENVIO_TITLE.textContent = 'Actualizar la cotización';
        // Preparar el formulario.
        ENVIO_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        fillSelect(COTIZACION_API, 'getEstados', 'estadoEnvio2', ROW.estado_envio);
        ID_ENVIO2.value = ROW.id_envio;
        FECHA_ESTIMADA2.value = ROW.fecha_estimada;
        NUMERO_SEGUIMIENTO2.value = ROW.numero_seguimiento;
        ETIQUETA_EDIFICACION2.value = ROW.etiqueta_edificacion;
        fillSelect(CLIENTE_API, 'readAll', 'nombreCliente2', ROW.id_cliente);
    } else {
        sweetAlert(2, DATA.error, false);
    }
}


const openUpdateDetalle = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idDetalle', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(COTIZACION_API, 'readOneDetalle', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        DETALLE_MODAL.show();
        DETALLE_TITLE.textContent = 'Actualizar detalle de la cotización';
        // Se prepara el formulario.
        DETALLE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_DETALLE.value = ROW.id_detalle_envio;
        ID_ENVIO_DETALLE.value = ROW.id_envio;
        MEDIO_ENVIO.value = ROW.medio_envio;
        COSTO_ENVIO.value = ROW.costo_envio;
        IMPUESTO_ENVIO.value = ROW.impuesto_envio;
        fillSelect(ENTIDAD_API, 'readEntidades', 'nombreEntidad2', ROW.id_entidad);
        CANTIDAD_ENTIDAD.value = ROW.cantidad_entidad;
        DIRECCION_ENVIO.value = ROW.direccion_envio;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const openDelete = async (id) => {
    const response = await confirmAction('¿Desea eliminar la cotización de forma permanente?');
    if (response) {
        const formData = new FormData();
        formData.append('idEnvio', id);
        const data = await fetchData(COTIZACION_API, 'deleteRow', formData);
        if (data.status) {
            ENVIO_MODAL.hide();
            await sweetAlert(1, data.message, true);
            fillTableDetalle();
        } else {
            sweetAlert(2, data.error, false);
        }
    }
};

const openDeleteDetalle = async (id) => {
    const response = await confirmAction('¿Desea eliminar el detalle de la cotización de forma permanente?');
    if (response) {
        const formData = new FormData();
        formData.append('idDetalle', id);
        const data = await fetchData(COTIZACION_API, 'deleteRowDetalle', formData);
        if (data.status) {
            SAVE_MODAL.hide();
            await sweetAlert(1, data.message, true);
            fillTableDetalle();
        } else {
            sweetAlert(2, data.error, false);
        }
    }
};

// Función para manejar el guardado de cotizaciones
const openCreate = () => {
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = "Crear cotizaciones";
    SAVE_FORM.reset();
    fillSelect(COTIZACION_API, 'getEstados', 'estadoEnvio');
    fillSelect(CLIENTE_API, "readAll", "nombreCliente");
    fillSelect(ENTIDAD_API, "readEntidades", "nombreEntidad");
};

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    const action = (ID_ENVIO.value) ? 'updateRow' : 'createRow';
    const FORM = new FormData(SAVE_FORM);
    const DATA = await fetchData(COTIZACION_API, action, FORM);
    if (DATA.status) {
        SAVE_MODAL.hide();
        sweetAlert(1, DATA.message, true);
        fillTableDetalle();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// Método del evento para cuando se envía el formulario de guardar.
ENVIO_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    const action = (ID_ENVIO2.value) ? 'updateRow' : 'createRow';
    const FORM = new FormData(ENVIO_FORM);
    const DATA = await fetchData(COTIZACION_API, action, FORM);
    if (DATA.status) {
        ENVIO_MODAL.hide();
        sweetAlert(1, DATA.message, true);
        fillTableDetalle();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});


// Método del evento para cuando se envía el formulario de guardar.
DETALLE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    const action = (ID_ENVIO_DETALLE.value) ? 'updateRowDetalle' : 'createRowDetalle';
    const FORM = new FormData(DETALLE_FORM);
    const DATA = await fetchData(COTIZACION_API, action, FORM);
    if (DATA.status) {
        DETALLE_MODAL.hide();
        sweetAlert(1, DATA.message, true);
        fillTableDetalle();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});
