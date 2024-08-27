<?php
// Importa los archivos necesarios para el reporte y la obtención de datos
require_once('../../helpers/report.php');
require_once('../../models/data/usuario_data.php');

// Crea la instancia del reporte
$pdf = new Report;
// Inicia el reporte con el título 'Reporte de Usuario'
$pdf->startReport('Reporte de Usuario');

// Crea una instancia de la clase ClienteData para obtener los datos de los Usuario
$Usuario = new UsuarioData;

// Verifica si existen datos en el cliente
if ($dataUsuario = $Usuario->readAll()) {
    // Configura los estilos del reporte
    $pdf->setFillColor(225); 
    $pdf->setFont('Arial', 'B', 11); 

    // Agrega las celdas del encabezado con el título de cada columna
    $pdf->cell(40, 15, 'Nombre', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Apellido', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Telefono', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Cargo', 1, 0, 'C', 1);
    $pdf->cell(60, 15, 'Correo', 1, 1, 'C', 1);

    // Configura la fuente para las filas de datos
    $pdf->setFont('Arial', '', 11);

    // Recorre cada cliente obtenido de la base de datos
    foreach ($dataUsuario as $rowUsuario) {

        // Verifica si la posición Y actual más 15 (alto de la celda) supera el límite de la página
        if ($pdf->getY() + 15 > 279 - 30) { 
            $pdf->addPage('P', 'Letter'); 
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->setFillColor(225);
            $pdf->setFont('Arial', 'B', 11);
            $pdf->cell(40, 15, 'Nombre', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Apellido', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Telefono', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Cargo', 1, 0, 'C', 1);
            $pdf->cell(60, 15, 'Correo', 1, 1, 'C', 1);
        }

        // Imprime las celdas con los datos del cliente
        $pdf->setFillColor(255, 255, 255); 
        $pdf->cell(40, 15, $pdf->encodeString($rowUsuario['nombre']), 1, 0, 'C'); 
        $pdf->cell(30, 15, $pdf->encodeString($rowUsuario['apellido']), 1, 0, 'C'); 
        $pdf->cell(30, 15, $pdf->encodeString($rowUsuario['numero_telefono']), 1, 0, 'C'); 
        $pdf->cell(30, 15, $pdf->encodeString($rowUsuario['cargo']), 1, 0, 'C'); 
        $pdf->cell(60, 15, $pdf->encodeString($rowUsuario['correo_electronico']), 1, 1, 'C'); 
    }
} else {
    // Si no hay Usuario para mostrar, se imprime un mensaje en una celda
    $pdf->cell(0, 15, $pdf->encodeString('No hay Usuario para mostrar'), 1, 1);
}

// Genera el reporte con el nombre 'Usuario.pdf' y lo muestra en el navegador
$pdf->output('I', 'Usuario.pdf');
?>
