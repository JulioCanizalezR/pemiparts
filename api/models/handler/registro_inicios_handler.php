<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class Registros_inicios_handler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
 
     protected $id_registro = null;
     protected $correo_electronico = null;
     protected $fecha_hora = null;
    // Constante para establecer la ruta de las imágenes.
 
    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_registro,correo_electronico,fecha_hora
                FROM tb_registro_inicios
                WHERE correo_electronico LIKE ?';
        $params = array($value);
        return Database::getRows($sql, $params);
    }
 
    public function readAll()
    {
        $sql = 'SELECT ri.id_registro, u.correo_electronico, ri.fecha_hora
                    FROM tb_registro_inicios ri
                    INNER JOIN tb_usuarios u ON ri.id_usuario = u.id_usuario
                    ORDER BY ri.fecha_hora ASC LIMIT 25';
            return Database::getRows($sql);
    }

    
}
 