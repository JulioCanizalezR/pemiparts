const CLIENTE_API = 'services/admin/cliente.php';
const EMPRESA_API = 'services/admin/empresa.php';
const PRODUCTO_API = 'services/admin/producto.php';
const CATEGORIA_API = 'services/admin/categoria.php';

document.addEventListener('DOMContentLoaded', async () => {
    // Seleccionar los campos de entrada
    const idInput = document.getElementById('chartMediosDstCliente-id');
    const idCompExstInput = document.getElementById('chartCompExstProductos-id');
    const idDisponibilidadInput = document.getElementById('chartDisponibilidadXcategoria-id');
    const idEvoCostoEnvioClienteInput = document.getElementById('chartEvoCostoEnvioCliente-id');

    // Establecer valores por defecto
    const defaultIdMediosDstCliente = '1'; // Cambia estos valores según tus necesidades
    const defaultIdCompExstProductos = '1';
    const defaultIdDisponibilidad = '1';
    const defaultIdEvoCostoEnvioCliente = '1';

    idInput.value = defaultIdMediosDstCliente;
    idCompExstInput.value = defaultIdCompExstProductos;
    idDisponibilidadInput.value = defaultIdDisponibilidad;
    idEvoCostoEnvioClienteInput.value = defaultIdEvoCostoEnvioCliente;


    // Cargar los gráficos con los valores por defecto
    if (defaultIdMediosDstCliente) {
        fillSelect(CLIENTE_API, 'clientesCantPedidos', 'chartMediosDstCliente-id');
        await graficoMediosDstCliente(defaultIdMediosDstCliente);
    }

    if (defaultIdCompExstProductos) {
        fillSelect(CATEGORIA_API, 'checkEntidadesDisponibles', 'chartDisponibilidadXcategoria-id');
        await graficoCompExstProductos(defaultIdCompExstProductos);
    }

    if (defaultIdDisponibilidad) {
        fillSelect(EMPRESA_API, 'existenciasSegunIdCategoria', 'chartCompExstProductos-id')
        await graficoDisponibilidadXcategoria(defaultIdDisponibilidad);
    }

    if (defaultIdEvoCostoEnvioCliente) {
        fillSelect(EMPRESA_API, 'clientesCompras', 'chartEvoCostoEnvioCliente-id')
        await graficoEvoCostoEnvioCliente(defaultIdEvoCostoEnvioCliente);
    }

    // Agregar eventos de cambio
    idEvoCostoEnvioClienteInput.addEventListener('change', async (event) => {
        const idCliente = event.target.value.trim();
        if (idCliente) {
            await graficoEvoCostoEnvioCliente(idCliente);
        } else {
            console.error('ID de Cliente no válido.');
        }
    });

    idDisponibilidadInput.addEventListener('change', async (event) => {
        const idCategoria = event.target.value.trim();
        if (idCategoria) {
            await graficoDisponibilidadXcategoria(idCategoria);
        } else {
            console.error('ID de Categoría no válido.');
        }
    });

    idInput.addEventListener('change', async (event) => {
        const idCliente = event.target.value.trim();
        if (idCliente) {
            await graficoMediosDstCliente(idCliente);
        } else {
            console.error('ID de Cliente no válido.');
        }
    });

    idCompExstInput.addEventListener('change', async (event) => {
        const idCategoria = event.target.value.trim();
        if (idCategoria) {
            await graficoCompExstProductos(idCategoria);
        } else {
            console.error('ID de Categoría no válido.');
        }
    });
});


const graficoMediosDstCliente = async (idCliente) => {
    if (!idCliente) {
        console.error('ID de Cliente no válido.');
        return;
    }

    const FORM = new FormData();
    FORM.append('idCliente', idCliente);

    try {
        const DATA = await fetchData(CLIENTE_API, 'graficoDistrubcionCliente', FORM);

        if (DATA && DATA.status && Array.isArray(DATA.dataset)) {
            let medios = [];
            let totales = [];

            DATA.dataset.forEach(row => {
                medios.push(row.medio_envio);
                totales.push(row.total_envios);
            });

            const canvasElement = document.getElementById('chartMediosDstCliente');
            if (canvasElement) {
                pieGraphCustom('chartMediosDstCliente', medios, totales, 'Distribución por Medios de Envío', 'Total de envíos por cada medio');
            } else {
                console.error('No se encontró el elemento canvas con ID chartMediosDstCliente');
            }
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud: ', error);
        await sweetAlert(2, 'Error al realizar la solicitud', false);
    }
};

const graficoCompExstProductos = async (idCategoria) => {
    if (!idCategoria) {
        return;
    }

    const FORM = new FormData();
    FORM.append('idCategoria', idCategoria);

    try {
        const DATA = await fetchData(EMPRESA_API, 'compExistenciasProductos', FORM);

        if (DATA && DATA.status && Array.isArray(DATA.dataset)) {
            let almacenamientos = [];
            let existencias = [];
            let labels = [];

            DATA.dataset.forEach(row => {
                almacenamientos.push(row.total_existencias);
                labels.push(row.almacenamiento);
                existencias.push(row.total_existencias); // Burbuja tamaño
            });

            const canvasElement = document.getElementById('chartCompExstProductos');
            if (canvasElement) {
                bubbleGraphCustom('chartCompExstProductos', labels, almacenamientos, existencias, 'Existencias de Productos por Almacenamiento', 'Total de existencias en cada almacenamiento');
            } else {
                console.error('No se encontró el elemento canvas con ID chartCompExstProductos');
            }
        } else {
            await sweetAlert(2, 'Categoría inexistente', false);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud: ', error);
        await sweetAlert(2, 'Error al realizar la solicitud', false);
    }
};

const graficoDisponibilidadXcategoria = async (idCategoria) => {
    if (!idCategoria) {
        return;
    }

    const FORM = new FormData();
    FORM.append('idCategoria', idCategoria);

    try {
        const DATA = await fetchData(PRODUCTO_API, 'disponiblidadXcategoria', FORM);

        if (DATA && DATA.status && Array.isArray(DATA.dataset)) {
            let categories = [];
            let barData = [];
            let lineData = [];

            DATA.dataset.forEach(row => {
                categories.push(row.categoria);
                barData.push(row.cantidad_productos);
                lineData.push(row.cantidad_productos * 0.5);  
            });

            // Llamar a mixedChart con los datos obtenidos
            mixedChart('chartDisponibilidadXcategoria', categories, barData, lineData, 'Disponibilidad de Productos por Categoría', 'Cantidad de productos y promedio de ventas por categoría');
        } else {
            await sweetAlert(2, 'Categoría inexistente', false);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud: ', error);
        await sweetAlert(2, 'Error al realizar la solicitud', false);
    }
};

async function graficoEvoCostoEnvioCliente(idCliente) {
    if (!idCliente) {
        console.error('ID de Cliente no válido.');
        return;
    }

    const FORM = new FormData();
    FORM.append('idCliente', idCliente);

    try {
        const DATA = await fetchData(EMPRESA_API, 'evoCostoEnvioCliente', FORM);

        if (DATA && DATA.status && Array.isArray(DATA.dataset)) {
            let fechas = [];
            let costosTotales = [];
            let costosPromedios = [];

            DATA.dataset.forEach(row => {
                fechas.push(row.fecha);
                costosTotales.push(row.total_costo);
                costosPromedios.push(row.total_costo / row.numero_envios); // Ejemplo de cálculo de promedio
            });

            const canvasElement = document.getElementById('chartEvoCostoEnvioCliente');
            if (canvasElement) {
                mixedChartEvoCosto('chartEvoCostoEnvioCliente', fechas, costosTotales, costosPromedios, 'Evolución del Costo de Envío por Cliente', 'Costo total y promedio de envío por cliente');
            } else {
                console.error('No se encontró el elemento canvas con ID chartEvoCostoEnvioCliente');
            }
        } else {
            await sweetAlert(2, 'Cliente inexistente', false);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud: ', error);
        await sweetAlert(2, 'Error al realizar la solicitud', false);
    }
}


var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})