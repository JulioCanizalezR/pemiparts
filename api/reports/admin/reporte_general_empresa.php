<?php
// Importa los archivos necesarios para el reporte y la obtención de datos
require_once('../../helpers/report.php');
require_once('../../models/data/empresa_data.php');

// Crea la instancia del reporte
$pdf = new Report;
// Inicia el reporte con el título 'Reporte de empresa'
$pdf->startReport('Reporte de empresa');

// Crea una instancia de la clase ClienteData para obtener los datos de los empresa
$empresa = new EmpresaData;

// Verifica si existen datos en el cliente
if ($dataempresa = $empresa->readAll()) {
    // Configura los estilos del reporte
    $pdf->setFillColor(225); 
    $pdf->setFont('Arial', 'B', 11); 

    // Agrega las celdas del encabezado con el título de cada columna
    $pdf->cell(50, 15, 'nombre_empresa', 1, 1, 'C', 1);

    // Configura la fuente para las filas de datos
    $pdf->setFont('Arial', '', 11);

    // Recorre cada cliente obtenido de la base de datos
    foreach ($dataempresa as $rowempresa) {

        // Verifica si la posición Y actual más 15 (alto de la celda) supera el límite de la página
        if ($pdf->getY() + 15 > 279 - 30) { 
            $pdf->addPage('P', 'Letter'); 
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->setFillColor(225);
            $pdf->setFont('Arial', 'B', 11);
            $pdf->cell(50, 15, 'nombre_empresa', 1, 1, 'C', 1);
        }

        // Imprime las celdas con los datos del cliente
        $pdf->setFillColor(255, 255, 255); 
        $pdf->cell(50, 15, $pdf->encodeString($rowempresa['nombre_empresa']), 1, 1, 'C'); 
    }
} else {
    // Si no hay empresa para mostrar, se imprime un mensaje en una celda
    $pdf->cell(0, 15, $pdf->encodeString('No hay empresa para mostrar'), 1, 1);
}

// Genera el reporte con el nombre_empresa 'empresa.pdf' y lo muestra en el navegador
$pdf->output('I', 'empresa.pdf');
?>
