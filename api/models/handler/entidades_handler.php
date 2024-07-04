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
        WHERE nombre_almacenamiento LIKE ? OR nombre_producto LIKE ?';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }
 
    public function createRow()
    {
        $sql = 'INSERT INTO tb_entidades (
            id_almacenamiento,
            id_producto,
            existencias,
            estado)
            VALUES(?,?,?,?)';
        $params = array($this->id_almacenamiento,$this->id_producto,$this->existencias,$this->estado);
        return Database::executeRow($sql, $params);
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
        $sql = 'UPDATE tb_entidades
                SET id_almacenamiento = ?, id_producto = ?, existencias = ?, estado = ?
                WHERE id_entidad = ?';
        $params = array($this->id_almacenamiento,$this->id_producto,$this->existencias,$this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }
 
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_entidades
                WHERE id_entidad = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
        
    }
}
 