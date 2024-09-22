/*
*   CONTROLADOR DE USO GENERAL EN TODAS LAS PÁGINAS WEB.
*/
// Constante para establecer la ruta base del servidor.
const SERVER_URL = 'http://localhost/pemiparts/api/';

/*
*   Función para mostrar un mensaje de confirmación. Requiere la librería sweetalert para funcionar.
*   Parámetros: message (mensaje de confirmación).
*   Retorno: resultado de la promesa.
*/
const confirmAction = (message) => {
    return swal({
        title: 'Advertencia',
        text: message,
        icon: 'warning',
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            cancel: {
                text: 'No',
                value: false,
                visible: true
            },
            confirm: {
                text: 'Sí',
                value: true,
                visible: true
            }
        }
    });
}

const confirmUpdateAction = (message) => {
    return swal({
        title: 'Aviso',
        text: message,
        icon: 'info',
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            cancel: {
                text: 'No',
                value: false,
                visible: true
            },
            confirm: {
                text: 'Sí',
                value: true,
                visible: true
            }
        }
    });
}

/*
*   Función asíncrona para manejar los mensajes de notificación al usuario. Requiere la librería sweetalert para funcionar.
*   Parámetros: type (tipo de mensaje), text (texto a mostrar), timer (uso de temporizador) y url (valor opcional con la ubicación de destino).
*   Retorno: ninguno.
*/
const sweetAlert = async (type, text, timer, url = null) => {
    // Se compara el tipo de mensaje a mostrar.
    switch (type) {
        case 1:
            title = 'Éxito';
            icon = 'success';
            break;
        case 2:
            title = 'Error';
            icon = 'error';
            break;
        case 3:
            title = 'Advertencia';
            icon = 'warning';
            break;
        case 4:
            title = 'Aviso';
            icon = 'info';
    }
    // Se define un objeto con las opciones principales para el mensaje.
    let options = {
        title: title,
        text: text,
        icon: icon,
        closeOnClickOutside: false,
        closeOnEsc: false,
        button: {
            text: 'Aceptar'
        }
    };
    // Se verifica el uso del temporizador.
    (timer) ? options.timer = 3000 : options.timer = null;
    // Se muestra el mensaje.
    await swal(options);
    // Se direcciona a una página web si se indica.
    (url) ? location.href = url : undefined;
}

/*
*   Función asíncrona para cargar las opciones en un select de formulario.
*   Parámetros: filename (nombre del archivo), action (acción a realizar), select (identificador del select en el formulario) y selected (dato opcional con el valor seleccionado).
*   Retorno: ninguno.
*/
const fillSelect = async (filename, action, select, selected = null) => {
    // Petición para obtener los datos.
    const DATA = await fetchData(filename, action);
    let content = '';
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje.
    if (DATA.status) {
        content += '<option value="" selected>Seleccione una opción</option>';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se obtiene el dato del primer campo.
            value = Object.values(row)[0];
            // Se obtiene el dato del segundo campo.
            text = Object.values(row)[1];
            // Se verifica cada valor para enlistar las opciones.
            if (value != selected) {
                content += `<option value="${value}">${text}</option>`;
            } else {
                content += `<option value="${value}" selected>${text}</option>`;
            }
        });
    } else {
        content += '<option>No hay opciones disponibles</option>';
    }
    // Se agregan las opciones a la etiqueta select mediante el id.
    document.getElementById(select).innerHTML = content;
}

/*
*   Función para generar un gráfico de barras verticales. Requiere la librería chart.js para funcionar.
*   Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), legend (etiqueta para los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/


const lineSalesGraph = (canvas, type, labels, data, legend, title, value = false) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    data.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: legend,
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return 'Ventas: ' + tooltipItem.formattedValue + ' USD';
                        }
                    }
                },
                legend: {
                    display: false 
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

const radarGraph = (elementId, labels, data, title, description) => {
    const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.2)`;  
    };

    const ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: description,
                data: data,
                backgroundColor: generateRandomColor(),
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: Math.max(...data) + 10  
                }
            }
        }
    });
}


const barGraph = (canvas, xAxis, yAxis, legend, title) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    xAxis.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'bar',
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

const lineGraph = (canvas, xAxis, yAxis, legend, title) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    xAxis.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'line',
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

const areaGraph = (canvas, xAxis, yAxis, legend, title) => {
    new Chart(document.getElementById(canvas), {
        type: 'line', // Para gráficos de área, el tipo sigue siendo 'line'
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo del área
                borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
                borderWidth: 1,
                fill: true // Esto hace que el gráfico sea de área
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Nueva función para gráfico de burbujas
const bubbleGraphCustom = (elementId, labels, data, sizes, title, description) => {
    // Generar colores aleatorios
    const backgroundColors = labels.map(() => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
    });

    const borderColors = backgroundColors.map(color => {
        return color.replace('0.5', '1');
    });

    // Obtener el elemento canvas y destruir el gráfico existente si es necesario
    const canvasElement = document.getElementById(elementId);
    if (canvasElement.chartInstance) {
        canvasElement.chartInstance.destroy();
    }

    // Crear el nuevo gráfico
    canvasElement.chartInstance = new Chart(canvasElement, {
        type: 'bubble',
        data: {
            labels: labels,
            datasets: [{
                label: description,
                data: data.map((value, index) => ({ x: index, y: value, r: sizes[index] })),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Categorías'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Existencias'
                    }
                }
            }
        }
    });
};
 
const mixedChart = (elementId, categories, barData, lineData, title, description) => {
    if (!categories || !Array.isArray(categories) || !barData || !Array.isArray(barData) || !lineData || !Array.isArray(lineData)) {
        console.error('Datos inválidos para el gráfico mixto.');
        sweetAlert(2, 'Datos inválidos para el gráfico mixto', false);
        return;
    }

    const canvasElement = document.getElementById(elementId);
    if (!canvasElement) {
        console.error(`No se encontró el elemento canvas con ID ${elementId}`);
        sweetAlert(2, 'Elemento canvas no encontrado', false);
        return;
    }

    // Verificar y destruir el gráfico existente si está presente
    if (canvasElement.chart && canvasElement.chart instanceof Chart) {
        canvasElement.chart.destroy();
    }

    // Crear nuevo gráfico y asignarlo a canvasElement.chart
    canvasElement.chart = new Chart(canvasElement.getContext('2d'), {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [
                {
                    type: 'bar',
                    label: 'Cantidad de Productos',
                    data: barData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    type: 'line',
                    label: 'Promedio de Ventas',
                    data: lineData,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (context.parsed.y !== null) {
                                label += `: ${context.parsed.y}`;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: false
                }
            }
        }
    });
};

const mixedChartEvoCosto = (elementId, categories, lineData, barData, title, description) => {
    if (!categories || !Array.isArray(categories) || !lineData || !Array.isArray(lineData) || !barData || !Array.isArray(barData)) {
        console.error('Datos inválidos para el gráfico mixto.');
        sweetAlert(2, 'Datos inválidos para el gráfico mixto', false);
        return;
    }

    const canvasElement = document.getElementById(elementId);
    if (!canvasElement) {
        console.error(`No se encontró el elemento canvas con ID ${elementId}`);
        sweetAlert(2, 'Elemento canvas no encontrado', false);
        return;
    }

    if (canvasElement.chart && canvasElement.chart instanceof Chart) {
        canvasElement.chart.destroy();
    }

    canvasElement.chart = new Chart(canvasElement.getContext('2d'), {
        type: 'line',
        data: {
            labels: categories,
            datasets: [
                {
                    type: 'line',
                    label: 'Costo Total',
                    data: lineData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    type: 'bar',
                    label: 'Costo Promedio',
                    data: barData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (context.parsed.y !== null) {
                                label += `: ${context.parsed.y}`;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false
                },
                y: {
                    stacked: false
                }
            }
        }
    });
};

/*
*   Función para generar un gráfico de pastel. Requiere la librería chart.js para funcionar.
*   Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
const pieGraph = (elementId, labels, data, title, description, type = 'pie') => {
    const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.5)`; // Color de fondo con transparencia
    };

    const generateRandomBorderColor = (bgColor) => {
        return bgColor.replace('0.2', '1'); // Misma combinación de colores con opacidad completa para el borde
    };

    const backgroundColors = [];
    const borderColors = [];

    labels.forEach(() => {
        const bgColor = generateRandomColor();
        backgroundColors.push(bgColor);
        borderColors.push(generateRandomBorderColor(bgColor));
    });

    const ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: type, // Tipo de gráfico: 'pie', 'doughnut', etc.
        data: {
            labels: labels,
            datasets: [{
                label: description,
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

const pieGraphCustom = (elementId, labels, data, title, description, type = 'pie') => {
    // Generar colores aleatorios
    const backgroundColors = labels.map(() => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
    });

    const borderColors = backgroundColors.map(color => {
        return color.replace('0.5', '1');
    });

    // Obtener el elemento canvas y destruir el gráfico existente si es necesario
    const canvasElement = document.getElementById(elementId);
    if (canvasElement.chartInstance) {
        canvasElement.chartInstance.destroy();
    }

    // Crear el nuevo gráfico
    canvasElement.chartInstance = new Chart(canvasElement, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: description,
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
};



/*
*   Función asíncrona para cerrar la sesión del usuario.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const logOut = async () => {
    // Se muestra un mensaje de confirmación y se captura la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de cerrar la sesión?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Petición para eliminar la sesión.
        const DATA = await fetchData(USER_API, 'logOut');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            sweetAlert(1, DATA.message, true, 'index.html');
        } else {
            sweetAlert(2, DATA.exception, false);
        }
    }
}

/*
*   Función asíncrona para intercambiar datos con el servidor.
*   Parámetros: filename (nombre del archivo), action (accion a realizar) y form (objeto opcional con los datos que serán enviados al servidor).
*   Retorno: constante tipo objeto con los datos en formato JSON.
*/
const fetchData = async (filename, action, form = null) => {
    // Se define una constante tipo objeto para establecer las opciones de la petición.
    const OPTIONS = {};
    // Se determina el tipo de petición a realizar.
    if (form) {
        OPTIONS.method = 'post';
        OPTIONS.body = form;
    } else {
        OPTIONS.method = 'get';
    }
    try {
        // Se declara una constante tipo objeto con la ruta específica del servidor.
        const PATH = new URL(SERVER_URL + filename);
        // Se agrega un parámetro a la ruta con el valor de la acción solicitada.
        PATH.searchParams.append('action', action);
        // Se define una constante tipo objeto con la respuesta de la petición.
        const RESPONSE = await fetch(PATH.href, OPTIONS);
        // Se retorna el resultado en formato JSON.
        return await RESPONSE.json();
    } catch (error) {
        // Se muestra un mensaje en la consola del navegador web cuando ocurre un problema.
        console.log(error);
    }
}