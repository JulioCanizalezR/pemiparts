<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/entidades_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla CATEGORIA.
 */
class EntidadesData extends EntidadesHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;

    /*
     *  Métodos para validar y establecer los datos.
     */

     
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
    
    public function setIdAlmacenamiento($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_almacenamiento = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del almacenamiento es incorrecto';
            return false;
        }
    }

    public function setIdProducto($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_producto = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del producto es incorrecto';
            return false;
        }
    }

    // Validación y asignación de la cantidad de existencias de la hamaca.
    public function setExistencias($value, $min = 1)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->existencias = $value;
            if ($this->existencias >= $min) {
                return true;
            } else {
                $this->data_error = 'El valor minimo de las existencias es ' . $min;
                return false;
            }
        } else {
            $this->data_error = 'El valor de las existencias debe ser numérico entero';
            return false;
        }
    }

    public function setEstado($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El estado debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->estado = $value;
            return true;
        } else {
            $this->data_error = 'El estado debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    /*
     *  Métodos para obtener el valor de los atributos adicionales.
     */
    public function getDataError()
    {
        return $this->data_error;
    }

    
}
