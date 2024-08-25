// Constantes para establecer los elementos del componente Modal.
const Contenedor_api = "services/admin/contenedor.php";
const entidad_api = "services/admin/entidades.php";


// Constante para establecer el formulario de buscar.
const SEARCH_INPUT = document.getElementById("searchInput");

// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');



// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_CONTENEDOR = document.getElementById('idContenedor'),
    NOMBRE_CONTENEDOR = document.getElementById('contenedor'),
    FECHA_INICIAL = document.getElementById('fecha_inicial'),
    TIEMPO_FINAL = document.getElementById('tiempo_final');





// Variables y constantes para la paginación
const ContenedoresPorPagina = 10;
let paginaActual = 1;
let Contenedores = [];

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
        form ? action = 'searchRows' : action = 'readAll';
        const DATA = await fetchData(Contenedor_api, action, form);

        if (DATA.status) {
            Contenedores = DATA.dataset;
            mostrarContenedores(paginaActual);
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

// Función para mostrar contenedores en una página específica
async function mostrarContenedores(pagina) {
    const inicio = (pagina - 1) * ContenedoresPorPagina;
    const fin = inicio + ContenedoresPorPagina;
    const ContenedoresPagina = Contenedores.slice(inicio, fin);

    TABLE_BODY.innerHTML = '';

    for (const row of ContenedoresPagina) {
        const tablaHtml = `
            <tr>
                <td>${row.id_almacenamiento}</td>
                <td>${row.nombre_almacenamiento}</td>
                <td>${row.tiempo_inicial}</td>
                <td>${row.tiempo_final}</td>
                <td>
                    <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_almacenamiento})">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_almacenamiento})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button type="button" class="btn btn-warning" data-bs-toggle="collapse" data-bs-target="#collapse-${row.id_almacenamiento}" aria-expanded="false" aria-controls="collapse-${row.id_almacenamiento}">
                        Ver almacen
                    </button>
                    <button type="button" class="btn btn-sm btn-primary" onclick="openReport(${row.id_almacenamiento})">
                         <i class="bi bi-filetype-pdf"></i>
                    </button>
                </td>
            </tr>
            <tr>
                <td colspan="5">
                    <div class="accordion-item">
                        <div id="collapse-${row.id_almacenamiento}" class="accordion-collapse collapse" aria-labelledby="heading-${row.id_almacenamiento}" data-bs-parent="#tableBody">
                            <div class="accordion-body">
                                <div id="carousel-container-${row.id_almacenamiento}" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-inner text-center justify-content-center"></div>
                                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel-container-${row.id_almacenamiento}" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Anterior</span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#carousel-container-${row.id_almacenamiento}" data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Siguiente</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
        TABLE_BODY.innerHTML += tablaHtml;
        await cargarCarrouselParaContenedor(row.id_almacenamiento);
    }

    actualizarPaginacion();
}

// Función para cargar el carrusel para un contenedor específico
async function cargarCarrouselParaContenedor(id) {
    try {
        // Petición para obtener los items del contenedor
        const form = new FormData();
        form.append('idContenedor', id);
        const itemsResponse = await fetchData(entidad_api, 'getItems', form);
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
                                    <img class="img-fluid rounded" src="${SERVER_URL}images/productos/${item2.imagen_producto}" alt="${item2.nombre_producto}">
                                </div>
                                <div class="col-8 p-2 d-flex flex-column">
                                    <p class="text-secondary mb-1">Nombre: ${item2.nombre_producto}</p>
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



// Función para cargar el carrusel para un contenedor específico con la librería de owl
// async function cargarCarrouselParaContenedor(id) {
//     try {
//         // Petición para obtener los items del contenedor
//         const form = new FormData();
//         form.append('idContenedor', id);
//         const itemsResponse = await fetchData(entidad_api, 'getItems', form);
//         const items = itemsResponse.dataset;

//         const carouselContainer = document.getElementById(`carousel-container-${id}`);
//         carouselContainer.innerHTML = '';

//         if (Array.isArray(items) && items.length > 0) {
//             items.forEach(item => {
//                 const itemHtml = `
//                     <div class="text-center pb-4">
//                         <img class="img-fluid mx-auto" src="${SERVER_URL}images/productos/${item.imagen_producto}" style="width: 100px; height: 100px;">
//                         <div class="testimonial-text bg-white p-4 mt-n5">
//                             <p class="mt-5">${item.precio_producto}</p>
//                             <h5 class="text-truncate">${item.nombre_producto}</h5>
//                             <span>${item.nombre}</span>
//                         </div>
//                     </div>
//                 `;
//                 carouselContainer.innerHTML += itemHtml;
//             });

//             // Iniciar Owl Carousel
//             $(`#carousel-container-${id}`).owlCarousel({
//                 loop: true,
//                 margin: 10,
//                 nav: true,
//                 items: 1
//             });
//         } else {
//             carouselContainer.innerHTML = `<p>No hay items disponibles para este contenedor.</p>`;
//         }
//     } catch (error) {
//         console.error('Error en la API:', error);
//     }
// }
// Llama a la función cargarCarrouselParaContenedor cuando se expande el acordeón
// document.addEventListener('click', function (e) {
//     if (e.target && e.target.classList.contains('btn-warning')) {
//         const contenedorId = e.target.getAttribute('data-bs-target').split('-')[1];
//         // Espera a que el colapso se complete antes de cargar el carrusel
//         $(`#collapse-${contenedorId}`).on('shown.bs.collapse', function () {
//             cargarCarrouselParaContenedor(contenedorId);
//         });
//     }
// });


// Función para actualizar los Contenedores de paginación
function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(Contenedores.length / ContenedoresPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarContenedores(paginaActual);
}


/*
* Función asíncrona para preparar el formulario al momento de actualizar un registro.
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idContenedor', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(Contenedor_api, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar contenedor';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_CONTENEDOR.value = ROW.id_almacenamiento;
        NOMBRE_CONTENEDOR.value = ROW.nombre_almacenamiento;
        FECHA_INICIAL.value = ROW.tiempo_inicial;
        TIEMPO_FINAL.value = ROW.tiempo_final;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}



const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear contenedor';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}



/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el contenedor de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idContenedor', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(Contenedor_api, 'deleteRow', FORM);
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
}

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
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
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_CONTENEDOR.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(Contenedor_api, action, FORM);
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


document.addEventListener('DOMContentLoaded', function () {
    var fechaInicial = document.getElementById('fecha_inicial');
    var fechaFinal = document.getElementById('fecha_final');

    var today = new Date().toISOString().split('T')[0];
    var tenYearsLater = new Date();
    tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);
    var maxDate = tenYearsLater.toISOString().split('T')[0];
    /*
        // Establecer la fecha mínima para la fecha inicial como la fecha actual
        fechaInicial.setAttribute('min', today);
    
        // Establecer la fecha mínima para la fecha final como la fecha actual
        fechaFinal.setAttribute('min', today);
        // Establecer la fecha máxima para la fecha final como 10 años después de la fecha actual
        fechaFinal.setAttribute('max', maxDate);
    
        fechaInicial.addEventListener('change', function() {
            var selectedDate = new Date(this.value);
            selectedDate.setDate(selectedDate.getDate() + 1);
            var minFinalDate = selectedDate.toISOString().split('T')[0];
    
            fechaFinal.value = ''; // Limpiar el valor de fecha final
            fechaFinal.setAttribute('min', minFinalDate);
        });
    */
    /*
        fechaFinal.addEventListener('change', function() {
            if (fechaFinal.value === fechaInicial.value) {
                alert('La fecha final no puede ser la misma que la fecha inicial.');
                fechaFinal.value = '';
            }
        });
        */
});


var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

const openReport = (id) => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/productos_almacen.php`);
    // Se agrega un parámetro a la ruta con el valor del registro seleccionado.
    PATH.searchParams.append('idContenedor', id);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
  }
