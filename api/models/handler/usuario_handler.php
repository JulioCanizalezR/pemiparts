<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
require_once('../../helpers/email.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla usuario.
 */
class UsuarioHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $correo = null;
    protected $telefono = null;
    protected $cargo = null;
    protected $alias = null;
    protected $clave = null;
    protected $imagen = null;


    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/usuarios/';
    /*
     *  Métodos para gestionar la cuenta del usuario.
     */
    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_usuario, correo_electronico, contraseña
                FROM tb_usuarios
                WHERE correo_electronico = ?';
        $params = array($username);
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } elseif (password_verify($password, $data['contraseña'])) {
            $_SESSION['idUsuario'] = $data['id_usuario'];
            $_SESSION['correoUsuario'] = $data['correo_electronico'];
            return true;
        } else {
            return false;
        }
    }

    public function checkPassword($password)
    {
        $sql = 'SELECT contraseña
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($_SESSION['idUsuario']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la clave coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['contraseña'])) {
            return true;
        } else {
            return false;
        }
    }

    public function changePassword()
    {
        $sql = 'UPDATE tb_usuarios
                SET contraseña = ?
                WHERE id_usuario = ?';
        $params = array($this->clave, $_SESSION['idUsuario']);
        return Database::executeRow($sql, $params);
    }

    public function readProfile()
    {
        $sql = 'SELECT id_usuario, nombre, apellido, numero_telefono, correo_electronico, cargo, contraseña, imagen_usuario
                FROM tb_usuarios 
                WHERE id_usuario = ? ';
        $params = array($_SESSION['idUsuario']);
        return Database::getRow($sql, $params);
    }

    public function editProfile()
    {
        $this->id = $_SESSION['idUsuario'];
        $sql = 'UPDATE tb_usuarios
                SET nombre = ?, apellido = ?, numero_telefono = ?, correo_electronico = ?,  imagen_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->nombre, $this->apellido, $this->telefono, $this->correo, $this->imagen, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT imagen_usuario
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    
    // Leer la imagen del administrador que ha iniciado sesion.
    public function readFilenameProfile()
    {
        $sql = 'SELECT imagen_usuario
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($_SESSION['idUsuario'],);
        return Database::getRow($sql, $params);
    }

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_usuario, imagen_usuario, nombre, apellido, numero_telefono, cargo, correo_electronico
                FROM tb_usuarios
                WHERE apellido LIKE ? OR nombre LIKE ? OR correo_electronico LIKE ?
                ORDER BY apellido';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tb_usuarios(imagen_usuario, nombre, apellido, numero_telefono, cargo, correo_electronico, contraseña )
                VALUES(?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->imagen, $this->nombre, $this->apellido, $this->telefono, $this->cargo, $this->correo, $this->clave);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_usuario, imagen_usuario, nombre, apellido, numero_telefono, cargo, correo_electronico
                FROM tb_usuarios
                ORDER BY apellido';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_usuario, imagen_usuario, nombre, apellido, numero_telefono, cargo, correo_electronico
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE tb_usuarios
                SET nombre = ?, apellido = ?, cargo = ?, correo_electronico = ?, numero_telefono = ?, imagen_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->nombre, $this->apellido, $this->cargo, $this->correo, $this->telefono, $this->imagen, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function checkDuplicate($value)
    {
        $sql = 'SELECT id_usuario
            FROM tb_usuarios
            WHERE correo_electronico = ?';

        $params = array($value);

        if ($this->id !== null) {
            $sql .= ' AND id_usuario <> ?';
            $params[] = $this->id;
        }

        return Database::getRow($sql, $params);
    }
    
    public function changePasswordFromEmail()
    {
        $sql = 'UPDATE tb_usuarios SET contraseña = ? WHERE correo_electronico = ?';
        $params = array($this->clave, $_SESSION['correo_vcc']['correo']);
        return Database::executeRow($sql, $params);
    }

    public function verifyExistingEmail()
    {
        $sql = 'SELECT COUNT(*) as count
                FROM tb_usuarios
                WHERE correo_electronico = ?';
        $params = array($this->correo);
        $result = Database::getRow($sql, $params);
    
        if ($result['count'] > 0) {
            return true; // Hay resultados
        } else {
            return false; // No hay resultados
        }
    }
}
