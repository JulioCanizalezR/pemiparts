<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class CotizacionHandler
{


    protected $id_cotizacion = null;
    protected $detalle_envio = null;
    protected $estado_envio = null;
    protected $fecha_estimada = null;
    protected $numero_seguimiento = null;
    protected $fecha_inicio = null;
    protected $tiempo_final = null;
    protected $nombre_cliente = null;
    protected $estado_envio = null;
    
 
    // Constante para establecer la ruta de las imágenes.
 
    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_envio, estado_envio, fecha_estimada,numero_seguimiento,
        etiqueta_edificacion, id_cliente, nombre_cliente 
        FROM tb_envios 
        INNER JOIN tb_clientes USING(id_cliente)
        WHERE nombre_cliente LIKE ?';
        $params = array($value);
        return Database::getRows($sql, $params);
    }
 
    public function createRow()
    {
        $sql = 'INSERT INTO tb_detalle_envios (
            id_detalle_envio, 
            id_envio, 
            medio_envio, 
            costo_envio, 
            impuesto_envio, 
            id_entidad, 
            cantidad_entidad, 
            direccion_envio
        )VALUES(?,?,?,?,?,?,?,?)';
        $params = array($this->detalle_envio,$this->fecha_inicio,$this->tiempo_final);
        return Database::executeRow($sql, $params);
    }
 
    public function readAll()
    {
        $sql = 'SELECT id_almacenamiento,nombre_almacenamiento,tiempo_inicial,tiempo_final
                FROM tb_almacenamientos';
        return Database::getRows($sql);
    }
 
    public function readOne()
    {
        $sql = 'SELECT id_almacenamiento, nombre_almacenamiento,tiempo_inicial,tiempo_final
                FROM tb_almacenamientos
                WHERE id_almacenamiento = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
 
 
    public function updateRow()
    {
        $sql = 'UPDATE tb_almacenamientos
                SET nombre_almacenamiento = ?, tiempo_inicial = ?, tiempo_final = ?
                WHERE id_almacenamiento = ?';
        $params = array($this->nombre_almacenamiento,$this->fecha_inicio,$this->tiempo_final, $this->id);
        return Database::executeRow($sql, $params);
    }
 
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_almacenamientos
                WHERE id_almacenamiento = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
 