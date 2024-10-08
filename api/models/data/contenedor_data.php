<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/contenedor_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla Pedido.
 */
class ContenedorData extends ContenedorHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename = null;

    /*
     *   Métodos para validar y establecer los datos.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del contenedor es incorrecto';
            return false;
        }
    }

    public function setContenedor($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre_almacenamiento = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function validarFechas($fecha_inicio, $tiempo_final)
    {
        $fecha_actual = date('Y-m-d');
        $diez_anios_despues = date('Y-m-d', strtotime('+10 years'));

        if ($tiempo_final <= $fecha_inicio) {
            $this->data_error = 'La fecha final debe ser mayor que la fecha inicial.';
            return false;
        }

        if ($tiempo_final < $fecha_actual) {
            $this->data_error = 'La fecha final no puede ser menor a la fecha actual.';
            return false;
        }

        if ($tiempo_final > $diez_anios_despues) {
            $this->data_error = 'La fecha final no puede ser mayor a 10 años desde la fecha actual.';
            return false;
        }

        return true;
    }

    public function setFecha_inicio($value)
    {
        if (Validator::validateDate($value)) {
            $this->fecha_inicio = $value;
            return true;
        } else {
            $this->data_error = 'La fecha de registro es incorrecta';
            return false;
        }
    }

    public function setTiempo_final($value)
    {
        if (Validator::validateDate($value)) {
            $this->tiempo_final = $value;
            return true;
        } else {
            $this->data_error = 'El tiempo final es incorrecto';
            return false;
        }
    }

    /*
     *  Métodos para obtener los atributos adicionales.
     */
    public function getDataError()
    {
        return $this->data_error;
    }

    public function getFilename()
    {
        return $this->filename;
    }
}
?>
