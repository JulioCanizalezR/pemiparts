<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class CategoriaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;

    // Constante para establecer la ruta de las imágenes.

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_categoria, nombre 
                FROM tb_categorias
                WHERE nombre LIKE ? 
                ORDER BY nombre';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tb_categorias(nombre)
                VALUES(?)';
        $params = array($this->nombre);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_categoria, nombre
                FROM tb_categorias
                ORDER BY id_categoria';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_categoria, nombre
                FROM tb_categorias
                WHERE id_categoria = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    public function updateRow()
    {
        $sql = 'UPDATE tb_categorias
                SET nombre = ?
                WHERE id_categoria = ?';
        $params = array($this->nombre, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_categorias
                WHERE id_categoria = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
    
    public function checkDuplicate($value)
    {
        $sql = 'SELECT id_categoria
            FROM tb_categorias
            WHERE nombre = ?';

        $params = array($value);

        if ($this->id !== null) {
            $sql .= ' AND id_categoria <> ?';
            $params[] = $this->id;
        }

        return Database::getRow($sql, $params);
    }
    
    public function productoXcagetoria()
    {
        $sql = 'SELECT p.nombre_producto, p.descripcion_producto, p.precio_producto, c.nombre
                FROM tb_productos p
                JOIN tb_categorias c ON p.id_categoria = c.id_categoria
                WHERE c.id_categoria = ?; 

                ';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }
}
