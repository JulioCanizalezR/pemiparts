<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/chat_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class ChatData extends ChatHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_chat = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del chat es incorrecto';
            return false;
        }
    } 

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    public function setIdUsuarioEmisor($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_usuario_emisor = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del usuario emisor es incorrecto';
            return false;
        }
    }

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    public function setIdUsuarioReceptor($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_usuario_receptor = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del usuario receptor es incorrecto';
            return false;
        }
    }

    public function setMensaje($value, $min = 1, $max = 2000)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->mensaje = $value;
            return true;
        } else {
            $this->data_error = 'El mensaje debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
