<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
require_once('../../models/data/entidades_data.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se verifica si existe un valor para el almacenamiento, de lo contrario se muestra un mensaje.
if (isset($_GET['idEntidad'])) {

    // Se instancia la entidad correspondiente.
    $entidad = new EntidadesData;

    // Se establece el valor del almacenamiento, de lo contrario se muestra un mensaje.
    if ($entidad->setIdAlmacenamiento($_GET['idEntidad'])) {

        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Reporte Detallado de Entidades por Almacen');

        // Mostrar subtítulo debajo del título.
        $pdf->setFont('Arial', '', 12);
        $pdf->cell(0, 10, 'ID de la entidad: ' . $_GET['idEntidad'], 0, 1, 'C');
        $pdf->ln(10); // Añade un espacio entre el subtítulo y la tabla

        // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
        if ($dataEntidades = $entidad->entidadXAlmacen()) {
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(225);
            // Se establece la fuente para los encabezados.
            $pdf->setFont('Arial', 'B', 11);
            // Se imprimen las celdas con los encabezados.
            $pdf->cell(50, 10, 'ID Entidad', 1, 0, 'C', 1);
            $pdf->cell(50, 10, 'Existencias', 1, 0, 'C', 1);
            $pdf->cell(50, 10, 'Estado', 1, 1, 'C', 1);
            // Se establece la fuente para los datos de las entidades.
            $pdf->setFont('Arial', '', 11);
            // Se recorren los registros fila por fila.
            foreach ($dataEntidades as $rowEntidad) {
                // Se imprimen las celdas con los datos de las entidades.
                $pdf->cell(50, 10, $rowEntidad['id_entidad'], 1, 0);
                $pdf->cell(50, 10, $rowEntidad['existencias'], 1, 0);
                $pdf->cell(50, 10, $rowEntidad['estado'], 1, 1);
            }
        } else {
            // Se establece la fuente antes de imprimir el mensaje de error.
            $pdf->setFont('Arial', '', 12);
            $pdf->cell(0, 10, 'No hay entidades para este almacenamiento', 1, 1, 'C');
        }

        // Se llama implícitamente al método footer() y se envía el documento al navegador web.
        $pdf->output('I', 'entidades_almacen.pdf');

    } else {
        print('Almacenamiento incorrecto');
    }
} else {
    print('Debe seleccionar un almacenamiento');
}
?>
