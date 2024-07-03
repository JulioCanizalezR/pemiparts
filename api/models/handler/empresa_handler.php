<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class EmpresaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id_empresa = null;
    protected $nombre_empresa = null;

    // Constante para establecer la ruta de las imágenes.

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_empresa, nombre_empresa
                FROM tb_empresas
                WHERE nombre_empresa LIKE ? 
                ORDER BY nombre_empresa';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tb_empresas(nombre_empresa)
                VALUES(?)';
        $params = array($this->nombre_empresa);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_empresa, nombre_empresa
                FROM tb_empresas
                ORDER BY id_empresa';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_empresa, nombre_empresa
                FROM tb_empresas
                WHERE id_empresa = ?';
        $params = array($this->id_empresa);
        return Database::getRow($sql, $params);
    }


    public function updateRow()
    {
        $sql = 'UPDATE tb_empresas
                SET nombre_empresa = ?
                WHERE id_empresa = ?';
        $params = array($this->nombre_empresa, $this->id_empresa);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_empresas
                WHERE id_empresa = ?';
        $params = array($this->id_empresa);
        return Database::executeRow($sql, $params);
    }
}
