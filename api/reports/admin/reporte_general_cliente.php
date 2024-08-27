<?php
// Importa los archivos necesarios para el reporte y la obtención de datos
require_once('../../helpers/report.php');
require_once('../../models/data/cliente_data.php');

// Crea la instancia del reporte
$pdf = new Report;
// Inicia el reporte con el título 'Reporte de Clientes'
$pdf->startReport('Reporte de Clientes');

// Crea una instancia de la clase ClienteData para obtener los datos de los clientes
$Clientes = new ClienteData;

// Verifica si existen datos en el cliente
if ($dataClientes = $Clientes->readAll()) {
    // Configura los estilos del reporte
    $pdf->setFillColor(225); 
    $pdf->setFont('Arial', 'B', 11); 

    // Agrega las celdas del encabezado con el título de cada columna
    $pdf->cell(60, 15, 'Nombre', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Apellido', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Telefono', 1, 0, 'C', 1);
    $pdf->cell(60, 15, 'Correo', 1, 1, 'C', 1);

    // Configura la fuente para las filas de datos
    $pdf->setFont('Arial', '', 11);

    // Recorre cada cliente obtenido de la base de datos
    foreach ($dataClientes as $rowClientes) {

        // Verifica si la posición Y actual más 15 (alto de la celda) supera el límite de la página
        if ($pdf->getY() + 15 > 279 - 30) { 
            $pdf->addPage('P', 'Letter'); 
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->setFillColor(225);
            $pdf->setFont('Arial', 'B', 11);
            $pdf->cell(60, 15, 'Nombre', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Apellido', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Telefono', 1, 0, 'C', 1);
            $pdf->cell(60, 15, 'Correo', 1, 1, 'C', 1);
        }

        // Imprime las celdas con los datos del cliente
        $pdf->setFillColor(255, 255, 255); 
        $pdf->cell(60, 15, $pdf->encodeString($rowClientes['nombre_cliente']), 1, 0, 'C'); 
        $pdf->cell(30, 15, $pdf->encodeString($rowClientes['apellido_cliente']), 1, 0, 'C'); 
        $pdf->cell(30, 15, $pdf->encodeString($rowClientes['numero_telefono_cliente']), 1, 0, 'C'); 
        $pdf->cell(60, 15, $pdf->encodeString($rowClientes['correo_electronico_cliente']), 1, 1, 'C'); 
    }
} else {
    // Si no hay clientes para mostrar, se imprime un mensaje en una celda
    $pdf->cell(0, 15, $pdf->encodeString('No hay Clientes para mostrar'), 1, 1);
}

// Genera el reporte con el nombre 'Clientes.pdf' y lo muestra en el navegador
$pdf->output('I', 'Clientes.pdf');
?>
