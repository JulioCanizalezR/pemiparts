<?php

require_once('../../helpers/report.php');
require_once('../../models/data/producto_data.php');

// Convertir texto a ISO-8859-1 para caracteres en castellano
function convertToISO88591($text) {
    return mb_convert_encoding($text, 'ISO-8859-1', 'UTF-8');
}

// Formatear el mes y año
function formatMonthYear($dateString) {
    $months = [
        '01' => 'Enero',
        '02' => 'Febrero',
        '03' => 'Marzo',
        '04' => 'Abril',
        '05' => 'Mayo',
        '06' => 'Junio',
        '07' => 'Julio',
        '08' => 'Agosto',
        '09' => 'Septiembre',
        '10' => 'Octubre',
        '11' => 'Noviembre',
        '12' => 'Diciembre'
    ];
    
    $parts = explode('-', $dateString);
    $year = $parts[0];
    $monthNumber = $parts[1];
    
    $monthName = isset($months[$monthNumber]) ? $months[$monthNumber] : 'Mes desconocido';
    
    return "$monthName de $year";
}

// Crear un nuevo PDF.
$pdf = new Report();

// Título del documento
$pdf->SetFont('Arial', 'B', 14);
$pdf->startReport(convertToISO88591('Reporte de Ventas Futuras por Categoria'));

// Subtítulo
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 10, convertToISO88591('Proyección de Ganancias Futuras (Media Móvil Simple)'), 0, 1, 'L');
$pdf->Ln(5);

// Obtener datos de las predicciones de ventas futuras
$productoData = new productoData();
$predicciones = $productoData->predecirVentasFuturasPorCategoria();

if (!empty($predicciones)) {
    foreach ($predicciones as $index => $prediccion) {
        // Añadir nueva página si no es la primera categoría
        if ($index > 0) {
            $pdf->AddPage();
        }

        // Nombre de la categoría
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, convertToISO88591('Categoría: ' . $prediccion['categoria']), 0, 1, 'L');
        $pdf->Ln(5);

        // Encabezado de la tabla
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(90, 10, convertToISO88591('Mes'), 1);
        $pdf->Cell(90, 10, convertToISO88591('Ganancia Proyectada'), 1);
        $pdf->Ln();

        // Contenido de la tabla
        $pdf->SetFont('Arial', '', 10);
        foreach ($prediccion['proyeccion'] as $mesPrediccion) {
            $formattedMonth = formatMonthYear($mesPrediccion['mes']);
            $pdf->Cell(90, 10, convertToISO88591($formattedMonth), 1);
            $pdf->Cell(90, 10, '$' . number_format($mesPrediccion['ganancia_proyectada'], 2), 1);
            $pdf->Ln();
        }
    }
} else {
    $pdf->SetFont('Arial', '', 10);
    $pdf->Cell(0, 10, convertToISO88591('No se encontraron datos de ventas pasadas o futuras para generar el reporte.'), 0, 1, 'C');
}

// Salida del documento
$pdf->Output('I', 'reporte_ventas_futuras.pdf');

?>
