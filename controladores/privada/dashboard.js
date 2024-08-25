const PRODUCTO_API = 'services/admin/producto.php';
const CLIENTE_API = 'services/admin/cliente.php';

document.addEventListener('DOMContentLoaded', () => {
 graficoLinearVentasPasadas();
 graficoLinearVentasFuturas();
 graficoLinearClientesFuturos();
 graficoPastelEnviosPorEstado();
 graficoClientesPorEmpresa();
 graficoPromProductoCategoria();
 graficoClientesXmes(); 
});

const graficoLinearVentasPasadas = async () => {
    const DATA = await fetchData(PRODUCTO_API, 'ventasPasadas');
    if (DATA.status) {
        let mes = [];
        let total = [];
        DATA.dataset.forEach(row => {
            mes.push(row.mes);
            total.push(row.ganancia_mensual);
        });
        lineSalesGraph('chartGananciasPasadas', 'line', mes, total, 'Ingresos mensuales actuales', 'Muestra los ingresos mensuales pasados');
    } else {
        document.getElementById('chartGananciasPasadas').remove();
        console.log(DATA.error);
    }
}

const graficoLinearVentasFuturas = async () => {
    const DATA = await fetchData(PRODUCTO_API, 'gananciasFuturas');
    if (DATA.status) {
        let mes = [];
        let total = [];
        // Asegúrate de que DATA.dataset está en el formato correcto
        if (DATA.dataset) {
            DATA.dataset.forEach(row => {
                mes.push(row.mes);
                total.push(row.ganancia);
            });
            lineSalesGraph('chartGananciasFuturas', 'line', mes, total, 'Ingresos mensuales a futuro', 'Muestra los ingresos futuros');
        } else {
            console.log('Datos futuros no disponibles o mal formateados');
            document.getElementById('chartGananciasFuturas').remove();
        }
    } else {
        document.getElementById('chartGananciasFuturas').remove();
        console.log(DATA.error);
    }
}

const graficoLinearClientesFuturos = async () => {
    const DATA = await fetchData(PRODUCTO_API, 'predecirClientesFuturos');
    if (DATA.status) {
        let clientes = [];
        let totalCompras = [];
        
        if (DATA.dataset) {
            DATA.dataset.forEach(row => {
                clientes.push(row.nombre_completo);
                totalCompras.push(row.total_compras);
            });
            
            // Generar gráfico de barras con los clientes y el total de compras
            barGraph('chartClientesFuturos', clientes, totalCompras, 'Probabilidad de comprar', '3 clientes mas suceptibles a comprar el proximo año');
        } else {
            console.log('Datos de clientes futuros no disponibles o mal formateados');
            document.getElementById('chartClientesFuturos').remove();
        }
    } else {
        document.getElementById('chartClientesFuturos').remove();
        console.log(DATA.error);
    }
}

const graficoPastelEnviosPorEstado = async () => {
    const DATA = await fetchData(PRODUCTO_API, 'getPedidosEstado');
    if (DATA.status) {
        let estados = [];
        let cantidades = [];

        if (DATA.dataset) {
            DATA.dataset.forEach(row => {
                estados.push(row.estado);
                cantidades.push(row.total);
            });
            pieGraph('chartEnviosPorEstado', estados, cantidades, 'Porcentaje de envíos por estado.', 'Distribución de pedidos por su estado');
        } else {
            console.log('Datos de pedidos por estado no disponibles o mal formateados');
            document.getElementById('chartEnviosPorEstado').remove();
        }
    } else {
        document.getElementById('chartEnviosPorEstado').remove();
        console.log(DATA.error);
    }
}

const graficoClientesPorEmpresa = async () => {
    const DATA = await fetchData(CLIENTE_API, 'clientesPorEmpresa');
    if (DATA.status) {
        let empresas = [];
        let totalClientes = [];

        if (DATA.dataset) {
            DATA.dataset.forEach(row => {
                empresas.push(row.empresa);
                totalClientes.push(row.total_clientes);
            });
            // Generar gráfico de Doughnut
            pieGraph('chartClientesPorEmpresa', empresas, totalClientes, 'Clientes por empresa', 'Distribución de clientes por empresa', 'doughnut');
        } else {
            console.log('Datos de clientes por empresa no disponibles o mal formateados');
            document.getElementById('chartClientesPorEmpresa').remove();
        }
    } else {
        document.getElementById('chartClientesPorEmpresa').remove();
        console.log(DATA.error);
    }
}

const graficoPromProductoCategoria = async () => {
    const DATA = await fetchData(PRODUCTO_API, 'promProductoCategoria');
    if (DATA.status) {
        let categorias = [];
        let promedios = [];

        if (DATA.dataset) {
            DATA.dataset.forEach(row => {
                categorias.push(row.categoria);
                promedios.push(row.precio_promedio);
            });
            radarGraph('chartPromProductoCategoria', categorias, promedios, 'Promedio de productos por categoría', 'promedio de productos por categoría');
        } else {
            console.log('Datos de promedio de productos por categoría no disponibles o mal formateados');
            document.getElementById('chartPromProductoCategoria').remove();
        }
    } else {
        document.getElementById('chartPromProductoCategoria').remove();
        console.log(DATA.error);
    }
}

const graficoClientesXmes = async () => {
    const DATA = await fetchData(CLIENTE_API, 'clientesRegistradosXmes');
    if (DATA.status) {
        let meses = [];
        let clientes = [];

        DATA.dataset.forEach(row => {
            meses.push(row.mes);
            clientes.push(row.nuevos_clientes);
        });

        // Llama a la función areaGraph para generar el gráfico de área
        areaGraph('chartClientesXmes', meses, clientes, 'Nuevos Clientes', 'Número de nuevos clientes registrados por mes');
    } else {
        document.getElementById('chartClientesXmes').remove();
        console.log(DATA.error);
    }
}
