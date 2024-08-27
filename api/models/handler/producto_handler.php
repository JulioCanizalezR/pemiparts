<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*   Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class ProductoHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $existencias = null;
    protected $imagen = null;
    protected $categoria = null;
    protected $estado = null;
    protected $impuesto_producto = null;
    protected $costo_produccion = null;
    protected $codigo = null;
    protected $id_categoria = null;


    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/productos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT p.id_producto, p.nombre_producto, p.descripcion_producto, p.impuesto_producto, p.imagen_producto, p.precio_producto, p.costo_compra, p.codigo_producto, c.nombre AS "nombre_categoria", 
            (SELECT SUM(e.existencias) FROM tb_entidades e WHERE e.id_producto = p.id_producto) AS existencias
            FROM tb_productos p
            INNER JOIN tb_categorias c ON p.id_categoria = c.id_categoria
             WHERE nombre_producto LIKE ? OR descripcion_producto LIKE ?
             ORDER BY nombre_producto';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tb_productos (nombre_producto, descripcion_producto, impuesto_producto, imagen_producto,
        precio_producto, costo_compra, codigo_producto, id_categoria)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->descripcion, $this->impuesto_producto, $this->imagen, $this->precio, $this->costo_produccion, $this->codigo, $this->categoria);
        return Database::executeRow($sql, $params);
    }


    public function readAll()
    {
        $sql = 'SELECT p.id_producto, p.nombre_producto, p.descripcion_producto, p.impuesto_producto, p.imagen_producto, p.precio_producto, p.costo_compra, p.codigo_producto, c.nombre AS "nombre_categoria", 
            (SELECT SUM(e.existencias) FROM tb_entidades e WHERE e.id_producto = p.id_producto) AS existencias
            FROM tb_productos p
            INNER JOIN tb_categorias c ON p.id_categoria = c.id_categoria
            ORDER BY p.nombre_producto;
        ';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_producto, nombre_producto, descripcion_producto, impuesto_producto, imagen_producto, precio_producto, costo_compra, codigo_producto,  tb_categorias.nombre AS "nombre_categoria" , existencias, id_categoria
                FROM tb_productos
                INNER JOIN tb_categorias USING(id_categoria)
                LEFT JOIN tb_entidades USING (id_producto)
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function clientesFuturos()
    {
        $sql = 'SELECT 
                    tb_clientes.id_cliente, 
                    CONCAT(tb_clientes.nombre_cliente, " ", tb_clientes.apellido_cliente) AS nombre_completo,
                    COUNT(tb_envios.id_envio) AS total_compras,
                    MAX(tb_envios.fecha_estimada) AS ultima_compra
                FROM 
                    tb_envios
                JOIN 
                    tb_detalle_envios ON tb_envios.id_envio = tb_detalle_envios.id_envio
                JOIN 
                    tb_entidades ON tb_detalle_envios.id_entidad = tb_entidades.id_entidad
                JOIN 
                    tb_clientes ON tb_envios.id_cliente = tb_clientes.id_cliente
                WHERE 
                    tb_envios.estado_envio IN ("Entregado", "Finalizado")
                    AND tb_envios.fecha_estimada BETWEEN CONCAT(YEAR(CURDATE()) - 3, "-01-01") AND CONCAT(YEAR(CURDATE()), "-12-31")
                GROUP BY 
                    tb_clientes.id_cliente, nombre_completo
                ORDER BY 
                    total_compras DESC, ultima_compra DESC';

        return Database::getRows($sql);
    }

    public function predecirClientesFuturos()
    {
        // Obtener los datos históricos de compras de los clientes
        $clientes = $this->clientesFuturos();

        // Verificar si hay datos disponibles
        if (empty($clientes)) {
            return [];
        }

        // Asignar un puntaje de predicción basado en la recencia y frecuencia
        foreach ($clientes as &$cliente) {
            // Asignar puntajes basados en lógica personalizada
            $puntaje_recencia = strtotime($cliente['ultima_compra']) / time(); // Recencia normalizada
            $puntaje_frecuencia = $cliente['total_compras'] / max(array_column($clientes, 'total_compras')); // Frecuencia normalizada

            // Calcular el puntaje final (podrías ajustar los pesos de cada factor)
            $cliente['puntaje_prediccion'] = (0.6 * $puntaje_recencia) + (0.4 * $puntaje_frecuencia);
        }

        // Ordenar los clientes por su puntaje de predicción en orden descendente
        usort($clientes, function ($a, $b) {
            return $b['puntaje_prediccion'] <=> $a['puntaje_prediccion'];
        });

        // Filtrar los 3 clientes con mayor puntaje de predicción
        $clientesFuturos = array_slice($clientes, 0, 3);

        // Devuelve los 3 clientes con mayor probabilidad de realizar compras en el próximo año
        return $clientesFuturos;
    }

    public function ventasPasadas()
    {
        $sql = ' SELECT  DATE_FORMAT(tb_envios.fecha_estimada, "%Y-%m") AS mes,  SUM(tb_productos.precio_producto - (tb_productos.costo_compra + tb_detalle_envios.costo_envio)) AS ganancia_mensual
                 FROM tb_productos
                 JOIN tb_entidades ON tb_entidades.id_producto = tb_productos.id_producto
                 JOIN  tb_detalle_envios ON tb_detalle_envios.id_entidad = tb_entidades.id_entidad
                 JOIN tb_envios ON tb_envios.id_envio = tb_detalle_envios.id_envio
                 WHERE tb_envios.estado_envio IN ("Entregado", "Finalizado")
                 AND tb_envios.fecha_estimada BETWEEN CONCAT(YEAR(CURDATE()), "-01-01") AND CONCAT(YEAR(CURDATE()), "-12-31")
                 GROUP BY  mes
                ORDER BY mes;     
     ';
        return Database::getRows($sql);
    }

    public function gananciasFuturas()
    {
        // Obtener las ventas pasadas
        $ventas = $this->ventasPasadas();
        if (empty($ventas)) {
            return [];
        }
    
    
        // Arrays para almacenar los valores de los meses y las ganancias mensuales
        $meses = [];
        $ganancias = [];
        $gananciasSuavizadas = [];
    
        // Configuración de la media móvil
        $ventana = 12;
    
        foreach ($ventas as $venta) {
            // Agregar los valores de mes y ganancia sin filtrar
            $meses[] = strtotime($venta['mes'] . '-01'); // Convertir mes a timestamp
            $ganancias[] = $venta['ganancia_mensual'];
        }
    
        // Aplicar media móvil simple para suavizar los datos
        $n = count($ganancias);
        for ($i = 0; $i < $n; $i++) {
            $inicio = max(0, $i - $ventana + 1);
            $suma = 0;
            $conteo = 0;
    
            for ($j = $inicio; $j <= $i; $j++) {
                $suma += $ganancias[$j];
                $conteo++;
            }
    
            $gananciasSuavizadas[] = $suma / $conteo;
        }
    
    
        // Verificar si se tienen suficientes datos
        if ($n < 2) {
            return [];
        }
    
        $x_sum = array_sum($meses);
        $y_sum = array_sum($gananciasSuavizadas);
        $xy_sum = 0;
        $x_squared_sum = 0;
    
        for ($i = 0; $i < $n; $i++) {
            $xy_sum += $meses[$i] * $gananciasSuavizadas[$i];
            $x_squared_sum += $meses[$i] * $meses[$i];
        }
    
        $m = ($n * $xy_sum - $x_sum * $y_sum) / ($n * $x_squared_sum - $x_sum * $x_sum);
        $b = ($y_sum - $m * $x_sum) / $n;
    
        // Predecir las ganancias para los próximos 12 meses
        $predicciones = [];
        $ultimoMes = end($meses);
    
        for ($i = 1; $i <= 12; $i++) {
            $mesFuturo = strtotime("+$i months", $ultimoMes);
            $gananciaPredicha = $m * $mesFuturo + $b;
    
            if ($gananciaPredicha < 0) {
                $gananciaPredicha = 0;
            }
    
            $predicciones[] = [
                'mes' => date('Y-m', $mesFuturo),
                'ganancia' => round($gananciaPredicha, 2)
            ];
        }
    
        return $predicciones;
    }
    
    
    

    public function readFilename()
    {
        $sql = 'SELECT imagen_producto
                FROM tb_productos
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE tb_productos
                SET nombre_producto = ?, descripcion_producto = ?, impuesto_producto = ?, imagen_producto = ?,
        precio_producto = ?, costo_compra = ?, codigo_producto = ?, id_categoria = ?
                WHERE id_producto = ?';
        $params = array($this->nombre, $this->descripcion, $this->impuesto_producto, $this->imagen, $this->precio, $this->costo_produccion, $this->codigo, $this->categoria, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_productos
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function readProductosCategoria()
    {
        $sql = 'SELECT id_producto, imagen_producto, nombre_producto, descripcion_producto, precio_producto, existencias_producto
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE id_categoria = ? AND estado_producto = true
                ORDER BY nombre_producto';
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }

    public function checkRelacion()
    {
        $sql = '
            SELECT COUNT(*) AS conteo FROM (
                SELECT id_producto FROM tb_entidades WHERE id_producto = ?
                UNION ALL
                SELECT id_producto FROM tb_productos WHERE id_producto = ?
            ) AS relaciones';
        $params = array($this->id, $this->id);
        $data = Database::getRow($sql, $params);
        return $data['conteo'] > 1;
    }


    /*
    *   Métodos para generar gráficos.
    */
    public function cantidadProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, COUNT(id_producto) cantidad
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY cantidad DESC LIMIT 5';
        return Database::getRows($sql);
    }

    public function porcentajeProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, ROUND((COUNT(id_producto) * 100.0 / (SELECT COUNT(id_producto) FROM producto)), 2) porcentaje
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY porcentaje DESC';
        return Database::getRows($sql);
    }

    public function checkDuplicate($value)
    {
        $sql = 'SELECT id_usuario
            FROM tb_usuarios
            WHERE correo_electronico = ?';

        $params = array($value);

        if ($this->id !== null) {
            $sql .= ' AND id_usuario <> ?';
            $params[] = $this->id;
        }

        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para generar reportes.
    */

    public function promProductoCategoria()
    {
        $sql = 'SELECT c.nombre AS categoria, AVG(p.precio_producto) AS precio_promedio
        FROM tb_productos p
        JOIN tb_categorias c ON p.id_categoria = c.id_categoria
        GROUP BY c.id_categoria;
        ';
        return Database::getRows($sql);
    }

    public function getPedidosEstado()
    {
        $sql = 'SELECT estado_envio AS estado, COUNT(id_envio) AS total
                FROM tb_envios
                GROUP BY estado_envio;
                ';
        $params = array();
        return Database::getRows($sql, $params);
    }

    public function disponiblidadXcategoria()
    {
        $sql = 'SELECT c.nombre AS categoria, 
            COUNT(p.id_producto) AS cantidad_productos
            FROM tb_productos p
            JOIN tb_categorias c ON p.id_categoria = c.id_categoria
            JOIN tb_entidades e ON p.id_producto = e.id_producto
            WHERE c.id_categoria = ? 
            AND e.estado = "Disponible"  
            GROUP BY c.nombre, e.estado;';

        $params = array($this->id_categoria);
        return Database::getRows($sql, $params);
    }


    public function productosCategoria()
    {
        $sql = 'SELECT nombre_producto, precio_producto, estado_producto
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE id_categoria = ?
                ORDER BY nombre_producto';
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }

    /**
     * Función: ventasPorCategoria
     * 
     * Descripción:
     * Esta función consulta la base de datos para obtener el total de ganancias por categoría de producto en un rango de tiempo específico (el año actual y el anterior).
     * La ganancia por categoría se calcula sumando la diferencia entre el precio de venta y el costo del producto (incluyendo el costo de envío).
     * La consulta solo incluye envíos que han sido entregados o finalizados, lo que asegura que las ganancias reflejan ventas completadas.
     * Los resultados se agrupan por categoría y mes, proporcionando un resumen mensual de las ganancias.
     * 
     * Retorna:
     * Un arreglo de resultados donde cada entrada contiene el nombre de la categoría, el mes (en formato "YYYY-MM"), y la ganancia total de esa categoría en dicho mes.
     * 
     * SQL:
     * - Selecciona el nombre de la categoría, el mes de la fecha estimada de entrega, y la suma de las ganancias calculadas.
     * - Realiza uniones entre las tablas de productos, entidades, detalles de envíos, envíos, y categorías.
     * - Filtra por envíos con estado "Entregado" o "Finalizado", y dentro del rango de fechas especificado.
     * - Agrupa los resultados por categoría y mes, y los ordena alfabéticamente por categoría y cronológicamente por mes.
     */
    public function ventasPorCategoria()
    {
        $sql = 'SELECT c.nombre AS categoria,  DATE_FORMAT(e2.fecha_estimada, "%Y-%m") AS mes, SUM(d.cantidad_entidad * (p.precio_producto - LEAST(p.precio_producto, p.costo_compra + d.costo_envio))) AS ganancia_categoria
       FROM  tb_productos p INNER JOIN  tb_entidades e1 ON e1.id_producto = p.id_producto
       INNER JOIN  tb_detalle_envios d ON d.id_entidad = e1.id_entidad INNER JOIN 
        tb_envios e2 ON e2.id_envio = d.id_envio INNER JOIN 
        tb_categorias c ON c.id_categoria = p.id_categoria WHERE 
        e2.estado_envio IN ("Entregado", "Finalizado") AND e2.fecha_estimada BETWEEN CONCAT(YEAR(CURDATE()) - 1, "-01-01") AND CONCAT(YEAR(CURDATE()), "-12-31") GROUP BY 
        c.nombre, mes ORDER BY 
        c.nombre, mes;';

        return Database::getRows($sql);
    }

    /**
     * Función: predecirVentasFuturasPorCategoria
     * 
     * Descripción:
     * Esta función predice las ventas futuras para cada categoría de producto, basándose en los datos históricos obtenidos mediante la función `ventasPorCategoria`.
     * Utiliza el método de suavizado exponencial para calcular las ganancias futuras, que es una técnica que da más peso a los datos recientes para reflejar mejor las tendencias actuales.
     * La función también completa los meses faltantes en los datos históricos mediante interpolación lineal, lo que asegura una continuidad en los datos antes de aplicar el suavizado.
     * Las predicciones se realizan para los próximos 12 meses y se ajustan para evitar valores negativos o irreales.
     * 
     * Pasos:
     * 1. Obtener ventas pasadas por categoría.
     * 2. Agrupar las ventas por categoría y llenar los meses faltantes usando interpolación lineal.
     * 3. Aplicar suavizado exponencial a las ganancias completadas para capturar la tendencia actual.
     * 4. Proyectar las ganancias para los próximos 12 meses ajustando por la tendencia suavizada.
     * 5. Ajustar los valores proyectados si son negativos o irreales.
     * 6. Retornar las predicciones organizadas por categoría y mes.
     * 
     * Retorna:
     * Un arreglo de predicciones, donde cada entrada contiene la categoría y un arreglo de ganancias proyectadas para los próximos 12 meses.
     */
    public function predecirVentasFuturasPorCategoria()
    {
        // Obtener ventas pasadas.
        $ventas = $this->ventasPorCategoria();
        if (empty($ventas)) {
            return [];
        }

        $predicciones = [];
        $ano_siguiente = date('Y') + 1;

        // Agrupar por categoría y completar meses faltantes
        $categorias = [];
        foreach ($ventas as $venta) {
            $categorias[$venta['categoria']][$venta['mes']] = $venta['ganancia_categoria'];
        }

        foreach ($categorias as $categoria => $datos) {
            // Completar meses faltantes con interpolación lineal
            $meses = array_keys($datos);
            $ganancias = array_values($datos);

            // Agregar meses faltantes
            $meses_completos = [];
            $start_date = new DateTime($meses[0]);
            $end_date = new DateTime(sprintf('%d-12', date('Y')));

            while ($start_date <= $end_date) {
                $meses_completos[] = $start_date->format('Y-m');
                $start_date->modify('+1 month');
            }

            $ganancias_completas = [];
            foreach ($meses_completos as $mes) {
                if (isset($datos[$mes])) {
                    $ganancias_completas[] = $datos[$mes];
                } else {
                    // Interpolación simple para meses faltantes
                    $ganancia_interpolada = $this->interpolarGanancia($meses, $ganancias, $mes);
                    $ganancias_completas[] = $ganancia_interpolada;
                }
            }

            // Aplicar suavizado exponencial
            $alpha = 0.5; // Factor de suavizado (0 < alpha <= 1)
            $suavizado = [$ganancias_completas[0]];

            for ($i = 1; $i < count($ganancias_completas); $i++) {
                $suavizado[] = $alpha * $ganancias_completas[$i] + (1 - $alpha) * $suavizado[$i - 1];
            }

            // Proyectar ganancias futuras usando el suavizado exponencial
            $proyeccion = [];
            $ultimo_valor = end($suavizado);
            $tendencia = $ultimo_valor - prev($suavizado); // Tendencia basada en el suavizado

            for ($i = 1; $i <= 12; $i++) {
                $mes = sprintf('%d-%02d', $ano_siguiente, $i);

                // Calcular el valor proyectado ajustando por la tendencia
                $ganancia_proyectada = $ultimo_valor + $tendencia * $i;

                // Ajustar el valor proyectado si es negativo o irreal
                if ($ganancia_proyectada < 0) {
                    $ganancia_proyectada = $ultimo_valor; // Ajuste simple
                }

                $proyeccion[] = [
                    'mes' => $mes,
                    'ganancia_proyectada' => round($ganancia_proyectada, 2)
                ];
            }

            $predicciones[] = [
                'categoria' => $categoria,
                'proyeccion' => $proyeccion
            ];
        }

        return $predicciones;
    }

    /**
     * Función: interpolarGanancia
     * 
     * Descripción:
     * Esta función implementa una interpolación lineal simple para llenar los meses faltantes en los datos históricos de ventas.
     * Dado un mes que falta en la secuencia, la función encuentra los valores de ganancia antes y después de ese mes, y calcula el promedio de ambos como la ganancia interpolada.
     * Si no hay un valor siguiente, la función utiliza el valor anterior, y viceversa.
     * Si no se puede interpolar (no hay valores anteriores ni siguientes), la función retorna 0 como valor por defecto.
     * 
     * Parámetros:
     * - $meses: Un arreglo de meses en los que existen datos.
     * - $ganancias: Un arreglo de ganancias correspondientes a los meses.
     * - $mes_a_interpolar: El mes para el cual se necesita calcular una ganancia interpolada.
     * 
     * Retorna:
     * El valor interpolado para el mes dado, o 0 si no se puede calcular.
     */
    private function interpolarGanancia($meses, $ganancias, $mes_a_interpolar)
    {
        // Implementar interpolación lineal simple
        $pos = array_search($mes_a_interpolar, $meses);
        if ($pos === false) {
            // Encontrar posición donde interpolar
            $anterior = null;
            $siguiente = null;
            foreach ($meses as $index => $mes) {
                if ($mes < $mes_a_interpolar) {
                    $anterior = $index;
                } else {
                    $siguiente = $index;
                    break;
                }
            }

            if ($anterior !== null && $siguiente !== null) {
                $g_anterior = $ganancias[$anterior];
                $g_siguiente = $ganancias[$siguiente];
                return ($g_anterior + $g_siguiente) / 2;
            } elseif ($anterior !== null) {
                return $ganancias[$anterior];
            } elseif ($siguiente !== null) {
                return $ganancias[$siguiente];
            }
        }

        return 0; // Si no se puede interpolar, retornar 0 como default
    }
}
