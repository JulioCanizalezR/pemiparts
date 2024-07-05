const COTIZACION_API = "services/admin/cotizacion.php";
const CLIENTE_API = "services/admin/cliente.php"
// Constante para establecer el formulario de buscar.
const SEARCH_INPUT = document.getElementById("searchInput");

// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

//Constante para cotizacion
/*
const PRIMER_MODAL = new boostrap.Modal('#ModalPrimario'),
    MODAL_LABEL = document.getElementById('ModalFormLabel');
/*
const COTIZACION_FORM = document.getElementById('cotizacionForm'),
    ID_COTIZACION = document.getElementById();

*/
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_ENVIO = document.getElementById('idEnvio'),
    ESTADO_ENVIO = document.getElementById('estado_envio'),
    FECHA_ESTIMADA = document.getElementById('fecha_estimada'),
    NUMERO_SEGUIMIENTO = document.getElementById('numero_seguimiento');
NOMBRE_CLIENTE = document.getElementById('nombre_cliente');
APELLIDO_CLIENTE = document.getElementById('apellido_cliente');

const CotizacionesPorPagina = 10;
let paginaActual = 1;
let Cotizaciones = [];


// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    fillTable();
});

/*
*   Función asíncrona para llenar la tabla con los registros disponibles, utilizando paginación.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
async function fillTable(form = null) {
    try {
        TABLE_BODY.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAllCoti';
        const DATA = await fetchData(COTIZACION_API, action, form);

        if (DATA.status) {
            Cotizaciones = DATA.dataset;
            mostrarCotizaciones(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = "Crear cotizaciones";
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(CLIENTE_API, "readClientes", "nombreCliente")
};

// Función para mostrar contenedores en una página específica
async function mostrarCotizaciones(pagina) {
    const inicio = (pagina - 1) * CotizacionesPorPagina;
    const fin = inicio + CotizacionesPorPagina;
    const CotizacionesPagina = Cotizaciones.slice(inicio, fin);

    TABLE_BODY.innerHTML = '';

    for (const row of CotizacionesPagina) {
        const tablaHtml = `
      <div class="card">
      <div class="card-body">
          <h5 class="card-title">Información General de Envíos</h5>
          <p class="card-text">Estado del Envío: ${row.estado_envio}</p>
          <p class="card-text">Fecha Estimada: ${row.fecha_estimada}</p>
          <p class="card-text">Número de Seguimiento: ${row.numero_seguimiento}</p>
          <p class="card-text">Etiqueta Edificación: ${row.etiqueta_edificacion}</p>
          <p class="card-text">ID Cliente: ${row.id_cliente}</p>
          <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#envioModal">Ver más</a>
      </div>
  </div>
      `;
        TABLE_BODY.innerHTML += tablaHtml;
        await cargarCarrouselParaCotizacion(row.id_envio);
    }

    // actualizarPaginacion();

    // Función para cargar el carrusel para un contenedor específico
    async function cargarCarrouselParaCotizacion(id) {
        try {
            // Petición para obtener los items del contenedor
            const form = new FormData();
            form.append('idCotizacion', id);
            //   const itemsResponse = await fetchData(entidad_api, 'getItems', form);
            const items = itemsResponse.dataset;

            const carouselInner = document.querySelector(`#carousel-container-${id} .carousel-inner`);
            carouselInner.innerHTML = '';

            if (Array.isArray(items) && items.length > 0) {
                // Agrupar los items en pares para mostrar 2 items por pestaña
                for (let i = 0; i < items.length; i += 2) {
                    const activeClass = i === 0 ? 'active' : '';
                    const item1 = items[i];
                    const item2 = items[i + 1];

                    let itemHtml = `
                    <div class="carousel-item ${activeClass}">
                        <div class="row">
                `;

                    // Agregar primer item
                    if (item1) {
                        itemHtml += `
                        <div class="col-md-6 col-sm-12 mt-4 mb-4">
                            <div class="tarjeta shadow d-flex align-items-center p-3">
                                <div class="col-4 p-2 d-flex justify-content-center align-items-center">
                                    <img class="img-fluid rounded" src="${SERVER_URL}images/productos/${item1.imagen_producto}" alt="${item1.nombre_producto}">
                                </div>
                                <div class="col-8 p-2 d-flex flex-column">
                                    <p class="text-secondary mb-1">Nombre: ${item1.nombre_producto}</p>
                                    <p class="text-secondary mb-1">Código del producto: ${item1.codigo_producto}</p>
                                    <p class="text-secondary mb-1">Cantidad: ${item1.existencias}</p>
                                    <p class="text-secondary mb-1">Precio: $${item1.precio_producto}</p>
                                    <p class="text-secondary mb-1">Categoría: ${item1.nombre}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    }

                    // Agregar segundo item si existe
                    if (item2) {
                        itemHtml += `
                        <div class="col-md-6 col-sm-12 mt-4 mb-4">
                            <div class="tarjeta shadow d-flex align-items-center p-3">
                                <div class="col-4 p-2 d-flex justify-content-center align-items-center">
                                </div>
                                <div class="col-8 p-2 d-flex flex-column">
                                    <p class="text-secondary mb-1">Nombre: ${item2.nombre_almacenamiento}</p>
                                    <p class="text-secondary mb-1">Código del producto: ${item2.codigo_producto}</p>
                                    <p class="text-secondary mb-1">Cantidad: ${item2.existencias}</p>
                                    <p class="text-secondary mb-1">Precio: $${item2.precio_producto}</p>
                                    <p class="text-secondary mb-1">Categoría: ${item2.nombre}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    }

                    itemHtml += `
                        </div>
                    </div>
                `;

                    carouselInner.innerHTML += itemHtml;
                }

                // Mostrar controles de carrusel solo si hay más de un item
                if (items.length <= 2) {
                    const carouselPrev = document.querySelector(`#carousel-container-${id} .carousel-control-prev`);
                    const carouselNext = document.querySelector(`#carousel-container-${id} .carousel-control-next`);
                    if (carouselPrev && carouselNext) {
                        carouselPrev.style.display = 'none';
                        carouselNext.style.display = 'none';
                    }
                }
            } else {
                carouselInner.innerHTML = `<div class="carousel-item"><p class="text-center">No hay items disponibles para este contenedor.</p></div>`;

                // Ocultar controles de carrusel si no hay items
                const carouselPrev = document.querySelector(`#carousel-container-${id} .carousel-control-prev`);
                const carouselNext = document.querySelector(`#carousel-container-${id} .carousel-control-next`);
                if (carouselPrev && carouselNext) {
                    carouselPrev.style.display = 'none';
                    carouselNext.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error en la API:', error);
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    fillTable();
});
