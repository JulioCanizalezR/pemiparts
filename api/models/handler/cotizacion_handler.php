<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class CotizacionHandler
{


    protected $id_envio = null;
    protected $id_detalle_envio = null;
    protected $nombre_producto = null;
    protected $estado_envio = null;
    protected $medio_envio = null;
    protected $costo_envio = null;
    protected $id_entidad = null;
    protected $impuesto_envio = null;
    protected $fecha_estimada = null;
    protected $numero_seguimiento = null;
    protected $fecha_inicio = null;
    protected $direccion_envio = null;
    protected $cantidad_entidad = null;
    protected $tiempo_final = null;
    protected $nombre_cliente = null;
    protected $etiqueta_edificacion = null;
    protected $id_cliente = null;
 
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
        WHERE numero_seguimiento LIKE ?';
        $params = array($value);
        return Database::getRows($sql, $params);
    }
    public function createRow()
    {
        $sql = 'INSERT INTO tb_envios (
            estado_envio, 
            fecha_estimada, 
            numero_seguimiento, 
            etiqueta_edificacion, 
            id_cliente
        )VALUES(?,?,?,?,?)';
        $params = array($this->estado_envio, $this->fecha_estimada, $this->numero_seguimiento, $this->etiqueta_edificacion, $this->id_cliente);
        return Database::executeRow($sql, $params);
    }
 
    public function getLastInsertedId()
    {
        return Database::getLastInsertId(); // Este método debe obtener el último ID insertado por la conexión de base de datos.
    }
    public function createRowDetalle()
    {
        $sql = 'INSERT INTO tb_detalle_envios (
            id_envio,
            medio_envio,
            costo_envio,
            impuesto_envio,
            id_entidad,
            cantidad_entidad,
            direccion_envio
        ) VALUES (?, ?, ?, ?, ?, ?, ?)';
        $params = array(
            $this->id_envio,
            $this->medio_envio,
            $this->costo_envio,
            $this->impuesto_envio,
            $this->id_entidad,
            $this->cantidad_entidad,
            $this->direccion_envio
        );
        return Database::executeRow($sql, $params);
    }
    public function readAll()
    {
        $sql = 'SELECT 
    de.id_detalle_envio,
    de.id_envio,
    de.medio_envio,
    de.costo_envio,
    de.id_entidad,
    de.cantidad_entidad,
    e.estado_envio,
    e.fecha_estimada,
    e.numero_seguimiento,
    c.nombre_cliente,
    c.apellido_cliente,
    en.id_almacenamiento,
    en.existencias,
    en.estado,
    FROM tb_detalle_envios de
    INNER JOIN tb_envios e ON de.id_envio = e.id_envio
    INNER JOIN tb_clientes c ON e.id_cliente = c.id_cliente
    INNER JOIN tb_entidades en ON de.id_entidad = en.id_entidad
    INNER JOIN tb_productos p ON en.id_producto = p.id_producto';
        return Database::getRows($sql);
    }

    public function readAllCoti()
    {
        $sql = 'SELECT 
        e.id_envio,
        e.estado_envio,
        e.fecha_estimada,
        e.numero_seguimiento,
        e.etiqueta_edificacion,
        c.id_cliente,
        c.nombre_cliente,
        c.apellido_cliente
        FROM tb_envios e
        INNER JOIN tb_clientes c ON e.id_cliente = c.id_cliente';
        return Database::getRows($sql);
    }
 
    public function readOne()
    {
        $sql = 'SELECT 
        de.id_detalle_envio,
        de.id_envio,
        de.medio_envio,
        de.costo_envio,
        de.impuesto_envio,
        de.id_entidad,
        de.cantidad_entidad,
        e.estado_envio,
        e.fecha_estimada,
        e.numero_seguimiento,
        e.etiqueta_edificacion,
        c.nombre_cliente,
        c.apellido_cliente,
        c.sufijo_cliente,
        en.id_almacenamiento,
        en.existencias,
        en.estado AS estado_entidad,
    FROM tb_detalle_envios de
    INNER JOIN tb_envios e ON de.id_envio = e.id_envio
    INNER JOIN tb_clientes c ON e.id_cliente = c.id_cliente
    INNER JOIN tb_entidades en ON de.id_entidad = en.id_entidad
    WHERE id_detalle_envio = ?';
        $params = array($this->id_detalle_envio);
        return Database::getRow($sql, $params);
    }
 
 
    public function updateRow()
    {
        $sql = 'UPDATE tb_detalle_envios de
        INNER JOIN tb_entidades en ON de.id_entidad = en.id_entidad
        INNER JOIN tb_productos p ON en.id_producto = p.id_producto
        SET 
            de.nombre_producto = ?,
            de.cantidad_entidad = ?
        WHERE de.id_detalle_envio = ?';
        $params = array($this->nombre_producto,$this->cantidad_entidad, $this->id_envio);
        return Database::executeRow($sql, $params);
    }
 
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_detalle_envios
                WHERE id_envio = ?';
        $params = array($this->id_detalle_envio);
        return Database::executeRow($sql, $params);
    }
}
 