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
 
 
    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/productos/';
 
    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_producto, imagen_producto, nombre_producto, descripcion_producto, precio_producto, nombre_categoria, estado_producto
                FROM producto 
                INNER JOIN categoria USING(id_categoria)
                WHERE nombre_producto LIKE ? OR descripcion_producto LIKE ?
                ORDER BY nombre_producto';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }
 
    public function createRow()
    {
        $sql = 'INSERT INTO tb_productos (nombre_producto, descripcion_producto, impuesto_producto, imagen_producto,
        precio_producto, costo_produccion_producto, codigo_producto, id_categoria)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->descripcion, $this->impuesto_producto, $this->imagen, $this->precio, $this->costo_produccion, $this->codigo, $this->categoria);
        return Database::executeRow($sql, $params);
    }
   
 
    public function readAll()
    {
        $sql = 'SELECT id_producto, nombre_producto, descripcion_producto, impuesto_producto, imagen_producto, precio_producto, costo_produccion_producto, codigo_producto,  tb_categorias.nombre AS "nombre_categoria" , existencias
                FROM tb_productos
                INNER JOIN tb_categorias USING(id_categoria)
                LEFT JOIN tb_entidades USING (id_producto)
                ORDER BY nombre_producto;';
        return Database::getRows($sql);
    }
 
    public function readOne()
    {
        $sql = 'SELECT id_producto, nombre_producto, descripcion_producto, impuesto_producto, imagen_producto, precio_producto, costo_produccion_producto, codigo_producto,  tb_categorias.nombre AS "nombre_categoria" , existencias, id_categoria
                FROM tb_productos
                INNER JOIN tb_categorias USING(id_categoria)
                LEFT JOIN tb_entidades USING (id_producto)
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
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
        precio_producto = ?, costo_produccion_producto = ?, codigo_producto = ?, id_categoria = ?
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
}
 