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
    protected $nombre_almacenamiento = null;
    protected $fecha_inicio = null;
    protected $tiempo_final = null;
 
    // Constante para establecer la ruta de las imágenes.
 
    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT 
        e.id_entidad,
        e.existencias,
        e.estado,
        a.nombre_almacenamiento,
        a.tiempo_inicial,
        a.tiempo_final,
        p.nombre_producto,
        p.descripcion_producto,
        p.impuesto_producto,
        p.imagen_producto,
        p.precio_producto,
        p.costo_producción_producto,
        p.codigo_producto,
        p.id_categoria
        FROM 
        tb_entidades e
        INNER JOIN 
        tb_almacenamientos a ON e.id_almacenamiento = a.id_almacenamiento
        INNER JOIN 
        tb_productos p ON e.id_producto = p.id_producto 
        WHERE nombre_almacenamiento LIKE ?';
        $params = array($value);
        return Database::getRows($sql, $params);
    }
 
    public function createRow()
    {
        $sql = 'INSERT INTO tb_almacenamientos (
            nombre_almacenamiento,
            tiempo_inicial,
            tiempo_final)
            VALUES(?,?,?)';
        $params = array($this->nombre_almacenamiento,$this->fecha_inicio,$this->tiempo_final);
        return Database::executeRow($sql, $params);
    }
 
    public function readAll()
    {
        $sql = 'SELECT 
        e.id_entidad,
        e.existencias,
        e.estado,
        a.nombre_almacenamiento,
        a.tiempo_inicial,
        a.tiempo_final,
        p.nombre_producto,
        p.descripcion_producto,
        p.impuesto_producto,
        p.imagen_producto,
        p.precio_producto,
        p.costo_producción_producto,
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
 
    public function readOne()
    {
        $sql = 'SELECT id_entidad, nombre_almacenamiento,tiempo_inicial,tiempo_final
                FROM tb_almacenamientos
                WHERE id_entidad = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
 
 
    public function updateRow()
    {
        $sql = 'UPDATE tb_almacenamientos
                SET nombre_almacenamiento = ?, tiempo_inicial = ?, tiempo_final = ?
                WHERE id_entidad = ?';
        $params = array($this->nombre_almacenamiento,$this->fecha_inicio,$this->tiempo_final, $this->id);
        return Database::executeRow($sql, $params);
    }
 
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_almacenamientos
                WHERE id_entidad = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
        
    }
}
 