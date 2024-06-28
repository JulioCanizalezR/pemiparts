// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

const SEE_MODAL = new bootstrap.Modal('#seeModal'),
    MODAL_TITLE2 = document.getElementById('modalTitle2');


// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_PRODUCTO = document.getElementById('idProducto'),
    NOMBRE_PRODUCTO = document.getElementById('producto'),
    DESCRIPCION_PRODUCTO = document.getElementById('descripcion'),
    CANTIDAD_PRODUCTO = document.getElementById('cantidad'),
    PRECIO_PRODUCTO = document.getElementById('precio'),
    CATEGORIA_PRODUCTO = document.getElementById('categoria'),
    IMAGEN_PRODUCTO = document.getElementById('imagen');



/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear producto';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelected(lista_datos_categorias, 'readAll', 'categoria');
}

/*
* Función asíncrona para preparar el formulario al momento de actualizar un registro.
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openUpdate = () => {
    // Se muestra la caja de diálogo con su título.
    SEE_MODAL.hide();
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Actualizar el producto';
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea cancelar el registro de datos?');
    console.log('Resultado de la confirmación:', RESPONSE);
    if (RESPONSE === true) {
        SEE_MODAL.hide();
    }
}

const openInfo = () => {
    // Se muestra la caja de diálogo con su título.
    SEE_MODAL.show();
    MODAL_TITLE2.textContent = 'Información del producto';
}

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    fillCards();
});


const lista_datos_categorias = [
    {
        categoria: "Ligera",
        id: 1,
    },
    {
        categoria: 'Pesada',
        id: 2,
    },
    {
        categoria: 'Muy pesada',
        id: 3,
    }
];

const lista_datos = [
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 1
    },
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 2
    },
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 3
    },
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 4
    },
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 5
    },
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 6
    },
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 7
    },
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 8
    },
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 9
    },
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 10
    },
    {
        imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/68/HwacheonCentreLathe_460x1000.jpg',
        producto: 'Torno pesado',
        tipo: 'Pesado',
        precio: '$ 2000.00',
        id: 11
    },
];

/*
* Función asíncrona para llenar las cartas con los registros disponibles.
* Parámetros: form (formulario de búsqueda).
* Retorno: ninguno.
*/
async function fillCards(form = null) {
    const cargarCartas = document.getElementById('cards');
    // Mostrar materiales de respaldo
    lista_datos.forEach(row => {
        const cardsHtml = `
        <div class="col-md-5 col-sm-12">
            <div class="tarjetas shadow d-flex align-items-center">
                <!-- Imagen a la izquierda -->
                <div class="col-6 bg-white tarjetas">
                    <img class="img-fluid imagen"
                        src="${row.imagen}"
                        alt="...">
                </div>
                <!-- Textos a la derecha -->
                <div class="col-6">
                    <h3>${row.producto}</h3>
                    <p>Tipo: <span>${row.tipo}</span></p>
                    <p>Precio: <span>${row.precio}</span></p>
                    <button class="btn botones-azul rounded-5" onclick="openInfo()">Ver mas...</button>
                </div>
            </div>
        </div>
        `;
        cargarCartas.innerHTML += cardsHtml;
    })
}


// Función para poblar un combobox (select) con opciones
const fillSelected = (data, action, selectId, selectedValue = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';

    // Crear opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona la categoría';
    selectElement.appendChild(defaultOption);

    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.categoria;
        selectElement.appendChild(option);
    });

    // Seleccionar el valor especificado si se proporciona
    if (selectedValue !== null) {
        selectElement.value = selectedValue;
    }
};