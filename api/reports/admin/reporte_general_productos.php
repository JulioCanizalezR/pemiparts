<?php
// Importa los archivos necesarios para el reporte y la obtención de datos
require_once('../../helpers/report.php');
require_once('../../models/data/producto_data.php');

// Crea la instancia del reporte
$pdf = new Report;
// Inicia el reporte con el título 'Reporte de productos'
$pdf->startReport('Reporte de productos');

// Crea una instancia de la clase ProductoData para obtener los datos de los productos
$productos = new ProductoData;

// Verifica si existen datos en el producto
if ($dataproductos = $productos->readAll()) {
    // Configura los estilos del reporte
    $pdf->setFillColor(225); // Color de fondo de las celdas del encabezado (gris)
    $pdf->setFont('Arial', 'B', 11); // Fuente y tamaño del texto del encabezado

    // Agrega las celdas del encabezado con el título de cada columna
    $pdf->cell(100, 15, 'Nombre', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Precio (US$)', 1, 0, 'C', 1);
    $pdf->cell(30, 15, 'Codigo', 1, 1, 'C', 1); // El último parámetro 1 en la última celda hace el salto de línea.

    // Configura la fuente para las filas de datos
    $pdf->setFont('Arial', '', 11);

    // Recorre cada producto obtenido de la base de datos
    foreach ($dataproductos as $rowproductos) {

        // Verifica si la posición Y actual más 15 (alto de la celda) supera el límite de la página
        if ($pdf->getY() + 15 > 279 - 30) { // Ajusta este valor según el tamaño de tus celdas y la altura de la página
            $pdf->addPage('P', 'Letter'); // Añade una nueva página de tamaño carta
            // Vuelve a imprimir los encabezados en la nueva página
            $pdf->setFillColor(225);
            $pdf->setFont('Arial', 'B', 11);
            $pdf->cell(100, 15, 'Nombre', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Precio (US$)', 1, 0, 'C', 1);
            $pdf->cell(30, 15, 'Codigo', 1, 1, 'C', 1);
        }

        // Imprime las celdas con los datos del producto
        $pdf->setFillColor(255, 255, 255); // Fondo blanco para las celdas de datos
        $pdf->cell(100, 15, $pdf->encodeString($rowproductos['nombre_producto']), 1, 0, 'C'); // Celda de nombre
        $pdf->cell(30, 15, $pdf->encodeString($rowproductos['precio_producto']), 1, 0, 'C'); // Celda de precio
        $pdf->cell(30, 15, $pdf->encodeString($rowproductos['codigo_producto']), 1, 1, 'C'); // Celda de código, con salto de línea
    }
} else {
    // Si no hay productos para mostrar, se imprime un mensaje en una celda
    $pdf->cell(0, 15, $pdf->encodeString('No hay productos para mostrar'), 1, 1);
}

// Genera el reporte con el nombre 'productos.pdf' y lo muestra en el navegador
$pdf->output('I', 'productos.pdf');
?>
