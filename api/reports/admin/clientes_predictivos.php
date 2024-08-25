<?php
// Incluye la librería para generar PDFs.
require_once('../../helpers/report.php');
require_once('../../models/data/cliente_data.php');

// Convertir texto a ISO-8859-1
function convertToISO88591($text) {
    return mb_convert_encoding($text, 'ISO-8859-1', 'UTF-8');
}

// Creación de un nuevo PDF.
$pdf = new Report();

// Crear una nueva página
$pdf->AddPage();

// Título del documento.
$pdf->SetFont('Arial', 'B', 14);
$pdf->Cell(0, 10, convertToISO88591('Reporte de Clientes Predictivos'), 0, 1, 'C');
$pdf->Ln(10);

// Subtítulo.
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 10, convertToISO88591('Estimación del Valor del Ciclo de Vida del Cliente (CLV)'), 0, 1, 'L');
$pdf->Ln(5);

// Obtener datos del CLV.
$ClienteData = new ClienteData();
$reporteCLV = $ClienteData->obtenerReporteCLV();

// Encabezados de tabla.
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(60, 10, convertToISO88591('Nombre'), 1);
$pdf->Cell(60, 10, convertToISO88591('Correo'), 1);
$pdf->Cell(40, 10, convertToISO88591('CLV Estimado'), 1);
$pdf->Ln();

// Contenido de la tabla.
$pdf->SetFont('Arial', '', 10);
foreach ($reporteCLV as $cliente) {
    $pdf->Cell(60, 10, convertToISO88591($cliente['nombre']), 1);
    $pdf->Cell(60, 10, convertToISO88591($cliente['correo']), 1);
    $pdf->Cell(40, 10, '$' . number_format($cliente['clv'], 2), 1);
    $pdf->Ln();
}

// Salida del documento.
$pdf->Output('I', 'clientes_predictivos.pdf');
?>
