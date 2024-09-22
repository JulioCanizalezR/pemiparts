<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class EntidadesHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */

    protected $id = null;
    protected $id_almacenamiento = null;
    protected $id_producto = null;
    protected $existencias = null;
    protected $estado = null;

    // Constante para establecer la ruta de las imágenes.

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT 
        e.id_entidad,
        e.id_almacenamiento,
        e.id_producto,
        e.existencias,
        e.estado,
        a.nombre_almacenamiento,
        a.tiempo_inicial,
        a.tiempo_final,
        p.nombre_producto,
        p.impuesto_producto,
        p.imagen_producto,
        p.precio_producto,
        p.costo_compra,
        p.codigo_producto,
        p.id_categoria
        FROM 
        tb_entidades e
        INNER JOIN 
        tb_almacenamientos a ON e.id_almacenamiento = a.id_almacenamiento
        INNER JOIN 
        tb_productos p ON e.id_producto = p.id_producto 
        WHERE nombre_almacenamiento LIKE ? OR nombre_producto LIKE ?';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $this->estado = 'Disponible';
        $sql = 'INSERT INTO tb_entidades (
            id_almacenamiento,
            id_producto,
            existencias,
            estado)
            VALUES(?,?,?,?)';
        $params = array($this->id_almacenamiento, $this->id_producto, $this->existencias, $this->estado);
        return Database::executeRow($sql, $params);
    }

    public function readEntidades()
    {
        $sql = 'SELECT id_entidad, nombre_almacenamiento 
                FROM tb_entidades 
                INNER JOIN tb_almacenamientos ON tb_entidades.id_almacenamiento = tb_almacenamientos.id_almacenamiento;';
        return Database::getRows($sql);
    }

    public function checkRelacion()
    {
        $sql = '
            SELECT COUNT(*) AS conteo FROM (
                SELECT id_entidad FROM tb_detalle_envios WHERE id_entidad = ?
                UNION ALL
                SELECT id_entidad FROM tb_entidades WHERE id_entidad = ?
            ) AS relaciones';
        $params = array($this->id, $this->id);
        $data = Database::getRow($sql, $params);
        return $data['conteo'] > 1;  
    }
    

    public function readAll()
    {
        $sql = 'SELECT 
        e.id_entidad,
        e.id_almacenamiento,
        e.id_producto,
        e.existencias,
        e.estado,
        a.nombre_almacenamiento,
        a.tiempo_inicial,
        a.tiempo_final,
        p.nombre_producto,
        p.impuesto_producto,
        p.imagen_producto,
        p.precio_producto,
        p.costo_compra,
        p.codigo_producto,
        p.id_categoria
        FROM 
        tb_entidades e
        INNER JOIN 
        tb_almacenamientos a ON e.id_almacenamiento = a.id_almacenamiento
        INNER JOIN 
        tb_productos p ON e.id_producto = p.id_producto';
        return Database::getRows($sql);
    }

    public function readAllForContainer()
    {
        $sql = 'SELECT 
        e.id_entidad,
        e.id_almacenamiento,
        e.id_producto,
        e.existencias,
        e.estado,
        a.nombre_almacenamiento,
        a.tiempo_inicial,
        a.tiempo_final,
        p.nombre_producto,
        p.impuesto_producto,
        p.imagen_producto,
        ROUND(precio_producto, 2) AS precio_producto, 
        p.costo_compra,
        p.codigo_producto,
        p.id_categoria,
        c.nombre
        FROM 
        tb_entidades e
        INNER JOIN 
        tb_almacenamientos a ON e.id_almacenamiento = a.id_almacenamiento
        INNER JOIN 
        tb_productos p ON e.id_producto = p.id_producto
        INNER JOIN 
        tb_categorias c ON p.id_categoria = c.id_categoria
        WHERE e.id_almacenamiento = ?';
        $params = array($this->id_almacenamiento);
        return Database::getRows($sql, $params);
    }

    public function productosAlmacenReport()
    {
        $sql = 'SELECT 
        e.id_producto,
        e.existencias,
        p.nombre_producto,
        ROUND(p.precio_producto, 2) AS precio_producto,
        p.codigo_producto,
        c.nombre AS categoria,
        a.nombre_almacenamiento
        FROM 
            tb_entidades e
        INNER JOIN 
            tb_productos p ON e.id_producto = p.id_producto
        INNER JOIN 
            tb_categorias c ON p.id_categoria = c.id_categoria
        INNER JOIN 
            tb_almacenamientos a ON e.id_almacenamiento = a.id_almacenamiento
        WHERE 
            e.id_almacenamiento = ?
    ';
        $params = array($this->id_almacenamiento);
        return Database::getRows($sql, $params);
    }


    public function readProducts()
    {
        $sql = 'SELECT id_producto, nombre_producto
                FROM tb_productos
                INNER JOIN tb_categorias USING(id_categoria)
                ORDER BY nombre_producto;';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT 
        e.id_entidad,
        e.id_almacenamiento,
        e.id_producto,
        e.existencias,
        e.estado,
        a.nombre_almacenamiento,
        a.tiempo_inicial,
        a.tiempo_final,
        p.nombre_producto,
        p.impuesto_producto,
        p.imagen_producto,
        p.precio_producto,
        p.costo_compra,
        p.codigo_producto,
        p.id_categoria
        FROM 
        tb_entidades e
        INNER JOIN 
        tb_almacenamientos a ON e.id_almacenamiento = a.id_almacenamiento
        INNER JOIN 
        tb_productos p ON e.id_producto = p.id_producto
        WHERE id_entidad = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function checkExistencias($cambio_existencias)
    {
        $sql = 'SELECT existencias
            FROM tb_entidades
            WHERE id_entidad = ?';
        $params = array($this->id);
        $row = Database::getRow($sql, $params);

        if ($row) {
            $existencias_actuales = $row['existencias'];
            return ($existencias_actuales + $cambio_existencias) >= 0;
        }
        return false;
    }

    public function updateRow()
    {
        if ($this->checkExistencias($this->existencias)) {
            /*
            $sql = 'UPDATE tb_entidades
            SET id_almacenamiento = ?, id_producto = ?, existencias = existencias + ?, estado = ?
            WHERE id_entidad = ?';
            $params = array($this->id_almacenamiento, $this->id_producto, $this->existencias, $this->estado, $this->id);
            */
            $sql = 'UPDATE tb_entidades
            SET id_almacenamiento = ?, id_producto = ?, existencias = ?, estado = ?
            WHERE id_entidad = ?';
            $params = array($this->id_almacenamiento, $this->id_producto, $this->existencias, $this->estado, $this->id);
            return Database::executeRow($sql, $params);
        } else {
            return false;
        }
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_entidades
                WHERE id_entidad = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    /*
    *   Métodos para generar reportes.
    */
    public function entidadXAlmacen()
    {
        $sql = 'SELECT e.id_entidad, e.existencias, e.estado
                FROM tb_entidades e
                JOIN tb_almacenamientos a ON e.id_almacenamiento = a.id_almacenamiento
                WHERE a.id_almacenamiento = ?;  
                ';
        $params = array($this->id_almacenamiento);
        return Database::getRows($sql, $params);
    }
}
