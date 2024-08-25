<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class ChatHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id_chat = null;
    protected $id_usuario_emisor = null;
    protected $id_usuario_receptor = null;
    protected $mensaje = null;


    // Constante para establecer la ruta de las imágenes.

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT 
        c.mensaje, 
        CONCAT(ue.nombre, " ", ue.apellido) AS nombre_emisor,
        ue.imagen_usuario AS imagen_usuario_emisor,
        CONCAT(ur.nombre, " ", ur.apellido) AS nombre_receptor,
        ur.imagen_usuario AS imagen_usuario_receptor,
        c.fecha_registro AS fecha,
        c.id_usuario_emisor AS id_usuario_emisor,
        c.id_usuario_receptor AS id_usuario_receptor
        FROM 
        tb_chat c
        JOIN 
        tb_usuarios ue ON c.id_usuario_emisor = ue.id_usuario
        JOIN 
        tb_usuarios ur ON c.id_usuario_receptor = ur.id_usuario
        WHERE c.id_usuario_emisor != ? OR mensaje = ? OR nombre_usuario = ?;';
        $params = array($_SESSION['idUsuario'], $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tb_chat(id_usuario_emisor, id_usuario_receptor, mensaje)
                VALUES(?,?,?);';
        $params = array($_SESSION['idUsuario'], $this->id_usuario_receptor, $this->mensaje);
        return Database::executeRow($sql, $params);
    }

    public function readAllMessagesRecived()
    {
        $sql = 'SELECT 
        c.mensaje, 
        CONCAT(ue.nombre, " ", ue.apellido) AS nombre_emisor,
        ue.imagen_usuario AS imagen_usuario_emisor,
        CONCAT(ur.nombre, " ", ur.apellido) AS nombre_receptor,
        ur.imagen_usuario AS imagen_usuario_receptor,
        c.fecha_registro AS fecha,
        c.id_usuario_emisor AS id_usuario_emisor,
        c.id_usuario_receptor AS id_usuario_receptor
        FROM 
        tb_chat c
        JOIN 
        tb_usuarios ue ON c.id_usuario_emisor = ue.id_usuario
        JOIN 
        tb_usuarios ur ON c.id_usuario_receptor = ur.id_usuario
        WHERE c.id_usuario_receptor = ?
        ORDER BY c.fecha_registro ASC;';
        $params = array($_SESSION['idUsuario']);
        return Database::getRows($sql, $params);
    }

    public function readAllMessagesSends()
    {
        $sql = 'SELECT 
        c.mensaje, 
        CONCAT(ue.nombre, " ", ue.apellido) AS nombre_emisor,
        ue.imagen_usuario AS imagen_usuario_emisor,
        CONCAT(ur.nombre, " ", ur.apellido) AS nombre_receptor,
        ur.imagen_usuario AS imagen_usuario_receptor,
        c.fecha_registro AS fecha,
        c.id_usuario_emisor AS id_usuario_emisor,
        c.id_usuario_receptor AS id_usuario_receptor
        FROM 
        tb_chat c
        JOIN 
        tb_usuarios ue ON c.id_usuario_emisor = ue.id_usuario
        JOIN 
        tb_usuarios ur ON c.id_usuario_receptor = ur.id_usuario
        WHERE c.id_usuario_emisor = ?;';
        $params = array($_SESSION['idUsuario']);
        return Database::getRows($sql, $params);
    }

    
    public function readAllMessagesRecivedChat()
    {
        $sql = 'SELECT 
        c.mensaje, 
        CONCAT(ue.nombre, " ", ue.apellido) AS nombre_emisor,
        ue.imagen_usuario AS imagen_usuario_emisor,
        CONCAT(ur.nombre, " ", ur.apellido) AS nombre_receptor,
        ur.imagen_usuario AS imagen_usuario_receptor,
        c.fecha_registro AS fecha,
        c.id_usuario_emisor AS id_usuario_emisor,
        c.id_usuario_receptor AS id_usuario_receptor
        FROM 
        tb_chat c
        JOIN 
        tb_usuarios ue ON c.id_usuario_emisor = ue.id_usuario
        JOIN 
        tb_usuarios ur ON c.id_usuario_receptor = ur.id_usuario
        WHERE c.id_usuario_receptor = ? AND c.id_usuario_emisor = ?
        ORDER BY c.fecha_registro ASC;';
        $params = array($_SESSION['idUsuario'], $this->id_chat);
        return Database::getRows($sql, $params);
    }

    public function readAllMessagesSendsChat()
    {
        $sql = 'SELECT 
        c.mensaje, 
        CONCAT(ue.nombre, " ", ue.apellido) AS nombre_emisor,
        ue.imagen_usuario AS imagen_usuario_emisor,
        CONCAT(ur.nombre, " ", ur.apellido) AS nombre_receptor,
        ur.imagen_usuario AS imagen_usuario_receptor,
        c.fecha_registro AS fecha,
        c.id_usuario_emisor AS id_usuario_emisor,
        c.id_usuario_receptor AS id_usuario_receptor
        FROM 
        tb_chat c
        JOIN 
        tb_usuarios ue ON c.id_usuario_emisor = ue.id_usuario
        JOIN 
        tb_usuarios ur ON c.id_usuario_receptor = ur.id_usuario
        WHERE c.id_usuario_emisor = ? AND c.id_usuario_receptor = ?
        ORDER BY c.fecha_registro ASC;';
        $params = array($_SESSION['idUsuario'], $this->id_chat);
        return Database::getRows($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT 
        c.id_chat,
        c.mensaje, 
        CONCAT(ue.nombre, " ", ue.apellido) AS nombre_emisor,
        ue.imagen_usuario AS imagen_usuario_emisor,
        CONCAT(ur.nombre, " ", ur.apellido) AS nombre_receptor,
        ur.imagen_usuario AS imagen_usuario_receptor,
        c.fecha_registro AS fecha,
        c.id_usuario_emisor AS id_usuario_emisor,
        c.id_usuario_receptor AS id_usuario_receptor
        FROM 
        tb_chat c
        JOIN 
        tb_usuarios ue ON c.id_usuario_emisor = ue.id_usuario
        JOIN 
        tb_usuarios ur ON c.id_usuario_receptor = ur.id_usuario
        WHERE c.id_chat = ?';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT *
                FROM tb_chat
                WHERE id_chat = ?';
        $params = array($this->id_chat);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE tb_chat
                SET id_usuario_emisor = ?, id_usuario_receptor = ?, mensaje = ? 
                WHERE id_chat = ?';
        $params = array($_SESSION['idUsuario'], $this->id_usuario_receptor, $this->mensaje, $this->id_chat);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_chat
                WHERE id_chat = ?';
        $params = array($this->id_chat);
        return Database::executeRow($sql, $params);
    }
}
