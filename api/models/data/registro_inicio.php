<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/registro_inicios_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla CATEGORIA.
 */
class registro_inicios_data extends Registros_inicios_handler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;

     
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la entidad es incorrecto';
            return false;
        }
    }
 
    public function getDataError()
    {
        return $this->data_error;
    }

    
}
