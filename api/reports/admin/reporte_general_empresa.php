<?php
// Importa los archivos necesarios para el reporte y la obtención de datos
require_once('../../helpers/report.php');
require_once('../../models/data/empresa_data.php');
// Convertir texto a ISO-8859-1
function convertToISO88591($text) {
    return mb_convert_encoding($text, 'ISO-8859-1', 'UTF-8');
}
// Crea la instancia del reporte
$pdf = new Report;
// Inicia el reporte con el título 'Reporte de empresas'
$pdf->startReport('Reporte de empresas');

// Crea una instancia de la clase EmpresaData para obtener los datos de las empresas
$empresa = new EmpresaData;

// Obtiene los datos usando el método reporteGeneralEmpresa()
if ($dataempresa = $empresa->reporteGeneralEmpresa()) {
    // Configura los estilos del reporte
    $pdf->setFillColor(225); 
    $pdf->setFont('Arial', 'B', 12); // Fuente para el encabezado

    // Agrega las celdas del encabezado con el título de cada columna
    $pdf->cell(30, 10, 'ID Empresa', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Empresa', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Clientes', 1, 0, 'C', 1);
    $pdf->cell(40, 10, 'Productos', 1, 0, 'C', 1);
    $pdf->cell(40, 10, 'Existencias', 1, 0, 'C', 1);
    $pdf->cell(20, 10, convertToISO88591('Envíos'), 1, 1, 'C', 1); // Nueva línea para los encabezados

    $pdf->setTextColor(0); // Color de texto para los datos
    $pdf->setFont('Arial', '', 10); // Fuente para los datos

    // Recorre cada empresa obtenida de la base de datos
    foreach ($dataempresa as $rowempresa) {
        $pdf->cell(30, 10, $rowempresa['id_empresa'], 1, 0, 'C'); 
        $pdf->cell(30, 10, $pdf->encodeString($rowempresa['nombre_empresa']), 1, 0, 'C'); 
        $pdf->cell(30, 10, $rowempresa['total_clientes'], 1, 0, 'C'); 
        $pdf->cell(40, 10, $rowempresa['total_productos'], 1, 0, 'C'); 
        $pdf->cell(40, 10, $rowempresa['total_existencias'], 1, 0, 'C'); 
        $pdf->cell(20, 10, $rowempresa['total_envios'], 1, 1, 'C'); // Nueva línea para los datos
    }
} else {
    // Si no hay empresas para mostrar, se imprime un mensaje en una celda
    $pdf->cell(0, 15, $pdf->encodeString('No hay empresas para mostrar'), 1, 1, 'C');
}

// Genera el reporte con el nombre 'empresa.pdf' y lo muestra en el navegador
$pdf->output('I', 'empresa.pdf');
?>
