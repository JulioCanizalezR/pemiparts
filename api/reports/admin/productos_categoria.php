<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');
require_once('../../models/data/categoria_data.php');
// Convertir texto a ISO-8859-1
function convertToISO88591($text) {
    return mb_convert_encoding($text, 'ISO-8859-1', 'UTF-8');
}
// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se verifica si existe un valor para la categoría, de lo contrario se muestra un mensaje.
if (isset($_GET['idCategoria'])) {

    // Se instancia la entidad correspondiente.
    $categoria = new CategoriaData;

    // Se establece el valor de la categoría, de lo contrario se muestra un mensaje.
    if ($categoria->setId_categoria($_GET['idCategoria'])) {

        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Productos por Categoria');

        // Mostrar subtítulo debajo del título.
        $pdf->setFont('Arial', '', 12);

        // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
        if ($dataProductos = $categoria->productoXcagetoria()) {
            // Obtener el nombre de la categoría del primer registro.
            $nombreCategoria = $dataProductos[0]['nombre'];
        
            // Mostrar subtítulo debajo del título.
            $pdf->cell(0, 10, convertToISO88591('Nombre de la categoría: ' . $nombreCategoria), 0, 1, 'C');
        
            $pdf->ln(10); // Añade un espacio entre el subtítulo y la tabla
        
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(225);
            $pdf->setFont('Arial', 'B', 11);
        
            // Se imprimen las celdas con los encabezados.
            $pdf->cell(60, 10, 'Nombre del Producto', 1, 0, 'C', 1);
            $pdf->cell(90, 10, convertToISO88591('Descripción'), 1, 0, 'C', 1);
            $pdf->cell(40, 10, 'Precio ($)', 1, 1, 'C', 1);
        
            $pdf->setFont('Arial', '', 11);
        
            // Se recorren los registros fila por fila.
            foreach ($dataProductos as $rowProducto) {
                $pdf->cell(60, 10, convertToISO88591($rowProducto['nombre_producto']), 1, 0);
                $pdf->cell(90, 10, convertToISO88591($rowProducto['descripcion_producto']), 1, 0);
                $pdf->cell(40, 10, convertToISO88591($rowProducto['precio_producto']), 1, 1);
            }
        } else {
            $pdf->setFont('Arial', '', 12);
            $pdf->cell(0, 10, convertToISO88591('No hay productos para esta categoría'), 1, 1, 'C');
        }
        

        // Se llama implícitamente al método footer() y se envía el documento al navegador web.
        $pdf->output('I', 'productos_categoria.pdf');

    } else {
        print('Categoría incorrecta');
    }
} else {
    print('Debe seleccionar una categoría');
}
?>
