<?php
require_once('../../helpers/report.php');
require_once('../../models/data/entidades_data.php');

// Convertir texto a ISO-8859-1
function convertToISO88591($text) {
    return mb_convert_encoding($text, 'ISO-8859-1', 'UTF-8');
}

$pdf = new Report;

if (isset($_GET['idContenedor'])) {
    $entidadesData = new EntidadesData;

    if ($entidadesData->setIdAlmacenamiento($_GET['idContenedor'])) {
        $pdf->startReport('Productos por Almacenamiento');

        $pdf->setFont('Arial', '', 12);

        if ($dataProductos = $entidadesData->productosAlmacenReport()) {
            $nombreAlmacenamiento = $dataProductos[0]['nombre_almacenamiento'];
            $categoriaAlmacenamiento = $dataProductos[0]['categoria']; // Ajustado para obtener la categoría del primer registro
        
            $pdf->cell(0, 10, convertToISO88591('Nombre del almacenamiento: ' . $nombreAlmacenamiento), 0, 1, 'C');
            $pdf->cell(0, 10, convertToISO88591('Categoría: ' . $categoriaAlmacenamiento), 0, 1, 'C');
        
            $pdf->ln(10);  
        
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(225);
            $pdf->setFont('Arial', 'B', 11);
        
            // Se imprimen las celdas con los encabezados.
            $pdf->cell(40, 10, convertToISO88591('Código Producto'), 1, 0, 'C', 1);
            $pdf->cell(60, 10, 'Nombre Producto', 1, 0, 'C', 1);
            $pdf->cell(40, 10, 'Cantidad', 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Precio', 1, 1, 'C', 1);
        
            $pdf->setFont('Arial', '', 11);
        
            // Se recorren los registros fila por fila.
            foreach ($dataProductos as $rowProducto) {
                $pdf->cell(40, 10, convertToISO88591($rowProducto['codigo_producto']), 1, 0);
                $pdf->cell(60, 10, convertToISO88591($rowProducto['nombre_producto']), 1, 0);
                $pdf->cell(40, 10, convertToISO88591($rowProducto['existencias']), 1, 0);
                $pdf->cell(30, 10, convertToISO88591('$' . number_format($rowProducto['precio_producto'], 2)), 1, 1);
            }
        } else {
            $pdf->setFont('Arial', '', 12);
            $pdf->cell(0, 10, convertToISO88591('No hay productos para este almacenamiento'), 1, 1, 'C');
        }

        $pdf->output('I', 'productos_almacenamiento.pdf');
    } else {
        print('Almacenamiento incorrecto');
    }
} else {
    print('Debe seleccionar un almacenamiento');
}
?>
