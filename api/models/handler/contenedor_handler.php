<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class ContenedorHandler
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
        $sql = 'SELECT id_almacenamiento,nombre_almacenamiento,tiempo_inicial,tiempo_final
                FROM tb_almacenamientos
                WHERE nombre_almacenamiento LIKE ?';
        $params = array($value);
        return Database::getRows($sql, $params);
    }
 
    public function createRow()
    {
        // Validar fechas en el servidor
        $fecha_actual = date('Y-m-d');
        $diez_anios_despues = date('Y-m-d', strtotime('+10 years'));

        if ($this->fecha_inicio < $fecha_actual) {
            throw new Exception('La fecha inicial no puede ser menor a la fecha actual.');
        }

        if ($this->tiempo_final <= $this->fecha_inicio) {
            throw new Exception('La fecha final debe ser mayor que la fecha inicial.');
        }

        if ($this->tiempo_final < $fecha_actual) {
            throw new Exception('La fecha final no puede ser menor a la fecha actual.');
        }

        if ($this->tiempo_final > $diez_anios_despues) {
            throw new Exception('La fecha final no puede ser mayor a 10 años desde la fecha actual.');
        }

        $sql = 'INSERT INTO tb_almacenamientos (
            nombre_almacenamiento,
            tiempo_inicial,
            tiempo_final)
            VALUES(?,?,?)';
        $params = array($this->nombre_almacenamiento, $this->fecha_inicio, $this->tiempo_final);
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
 