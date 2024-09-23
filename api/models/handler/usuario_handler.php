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
        // Obtener información del usuario
        $sql = 'SELECT id_usuario, correo_electronico, contraseña, fecha_cambio_clave, intentos_fallidos, bloqueado_hasta
                FROM tb_usuarios
                WHERE correo_electronico = ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);
    
        if (!$data) {
            return false; // Usuario no encontrado
        }
    
        // Comprobar si la cuenta está bloqueada
        if ($data['bloqueado_hasta'] && strtotime($data['bloqueado_hasta']) > time()) {
            // Calcula el tiempo restante para el desbloqueo
            $tiempo_restante = (strtotime($data['bloqueado_hasta']) - time()) / 3600;
            return 'bloqueado'; // Cuenta bloqueada
        }
    
        // Verificar la contraseña
        if (password_verify($password, $data['contraseña'])) {
            // Restablecer intentos fallidos si el login es correcto
            $sql = 'UPDATE tb_usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id_usuario = ?';
            $params = array($data['id_usuario']);
            Database::executeRow($sql, $params);
    
            // Comprobar si la contraseña ha expirado
            $fechaCambio = strtotime($data['fecha_cambio_clave']);
            $fechaLimite = $fechaCambio + (90 * 24 * 60 * 60); // 90 días en segundos
    
            if (time() > $fechaLimite) {
                return 'expirada'; // Contraseña expirada
            }
    
            // Autenticación exitosa
            $_SESSION['idUsuario'] = $data['id_usuario'];
            $_SESSION['correoUsuario'] = $data['correo_electronico'];
            return true;
        } else {
            // Incrementar intentos fallidos
            $intentos_fallidos = $data['intentos_fallidos'] + 1;
            $bloqueado_hasta = null;
    
            // Si alcanza el límite de 3 intentos fallidos, bloquear la cuenta
            if ($intentos_fallidos >= 4) {
                $bloqueado_hasta = date('Y-m-d H:i:s', strtotime('+24 hours')); // Bloqueo por 24 horas
            }
    
            // Actualizar intentos fallidos y posible bloqueo
            $sql = 'UPDATE tb_usuarios SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE id_usuario = ?';
            $params = array($intentos_fallidos, $bloqueado_hasta, $data['id_usuario']);
            Database::executeRow($sql, $params);
    
            // Mostrar mensaje si la cuenta ha sido bloqueada
            if ($bloqueado_hasta) {
                return 'bloqueado'; // Devuelve el estado de bloqueo
            }
    
            return false; // Contraseña incorrecta
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

    public function getPasswordHash($userId)
    {
        $sql = 'SELECT contraseña FROM tb_usuarios WHERE id_usuario = ?';
        $params = array($userId);
        $data = Database::getRow($sql, $params);
        return $data['contraseña'];
    }

    public function getUserNameById($userId)
    {
        $sql = 'SELECT nombre FROM tb_usuarios WHERE id_usuario = ?';
        $params = array($userId);
        $data = Database::getRow($sql, $params);
        return $data ? $data['nombre'] : null;
        
    }

    public function getEmailById($userId)
    {
        $sql = 'SELECT correo_electronico FROM tb_usuarios WHERE id_usuario = ?';
        $params = array($userId);
        $data = Database::getRow($sql, $params);
        return $data ? $data['correo_electronico'] : null; // Retorna null si no hay datos
    }
    


    public function changePassword()
    {
        $sql = 'UPDATE tb_usuarios
                SET contraseña = ?, fecha_cambio_clave = ?
                WHERE id_usuario = ?';
        $params = array($this->clave, date('Y-m-d H:i:s'), $_SESSION['idUsuario']);
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
        $sql = 'INSERT INTO tb_usuarios(imagen_usuario, nombre, apellido, numero_telefono, cargo, correo_electronico, contraseña, fecha_cambio_clave)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->imagen, $this->nombre, $this->apellido, $this->telefono, $this->cargo, $this->correo, $this->clave, date('Y-m-d H:i:s'));
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
