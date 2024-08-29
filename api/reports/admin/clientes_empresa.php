<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
require_once('../../models/data/cliente_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se verifica si existe un valor para la empresa, de lo contrario se muestra un mensaje.
if (isset($_GET['idEmpresa'])) {

    // Convertir texto a ISO-8859-1
    function convertToISO88591($text)
    {
        return mb_convert_encoding($text, 'ISO-8859-1', 'UTF-8');
    }

    // Se instancia la clase ClienteData.
    $cliente = new ClienteData;

    // Se establece el valor de id_empresa en la clase ClienteData.
    if ($cliente->setIdEmpresa($_GET['idEmpresa'])) {

        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Clientes por Empresa');

        // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
        if ($dataClientes = $cliente->clientesXempresa()) {

            // Obtener el nombre de la categoría del primer registro.
            $nombreEmpresa = $dataClientes[5]['nombre_empresa'];

            // Mostrar subtítulo debajo del título.
            $pdf->setFont('Arial', '', 12);
            $pdf->cell(0, 10, convertToISO88591('Clientes de la empresa: ' . $nombreEmpresa), 0, 1, 'C');
            $pdf->ln(10); // Añade un espacio entre el subtítulo y la tabla
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(225);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Arial', 'B', 11);
            // Se imprimen las celdas con los encabezados.
            $pdf->cell(30, 10, 'Cliente', 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Apellido', 1, 0, 'C', 1);
            $pdf->cell(50, 10, convertToISO88591('Correo Electrónico'), 1, 0, 'C', 1);

            $pdf->cell(30, 10, 'Fecha Registro', 1, 0, 'C', 1);
            $pdf->cell(40, 10, 'Empresa', 1, 1, 'C', 1);
            // Se establece la fuente para los datos.
            $pdf->setFont('Arial', '', 11);
            // Se recorren los registros fila por fila.
            foreach ($dataClientes as $rowCliente) {
                // Se imprimen las celdas con los datos del cliente.
                $pdf->cell(30, 10, convertToISO88591($rowCliente['nombre_cliente']), 1, 0);
                $pdf->cell(30, 10, convertToISO88591($rowCliente['apellido_cliente']), 1, 0);
                $pdf->cell(50, 10, convertToISO88591($rowCliente['correo_electronico_cliente']), 1, 0);
                $pdf->cell(30, 10, $rowCliente['fecha_registro_cliente'], 1, 0);
                $pdf->cell(40, 10, convertToISO88591($rowCliente['nombre_empresa']), 1, 1);
            }
        } else {
            // Se establece la fuente antes de imprimir el mensaje de error.
            $pdf->setFont('Arial', '', 12);
            $pdf->cell(0, 10, 'No hay clientes para esta empresa', 1, 1, 'C');
        }

        // Se llama implícitamente al método footer() y se envía el documento al navegador web.
        $pdf->output('I', 'clientes_empresa.pdf');
    } else {
        print('ID de empresa incorrecto');
    }
} else {
    print('Debe seleccionar una empresa');
}
