<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/cotizacion_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla Pedido.
 */
class CotizacionData extends CotizacionHandler
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
            $this->id_detalle_envio = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del contenedor es incorrecto';
            return false;
        }
    }

    public function setIdEnvio($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_detalle_envio = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del contenedor es incorrecto';
            return false;
        }
    }

    public function setIdCliente($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del cliente es incorrecto';
            return false;
        }
    }

    public function setIdAlmacen($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this-> id_entidad = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del contenedor es incorrecto';
            return false;
        }
    }

    public function setNumeroSeguimiento($value, $min = 2, $max = 250)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->numero_seguimiento = $value;
            return true;
        } else {
            $this->data_error = 'El numero de seguimiento es incorrecto';
            return false;
        }
    }

    public function setEtiquetaEdificacion($value, $min = 2, $max = 250)
    {
        if (!Validator::validateString($value)) {
            $this->data_error = 'La etiqueta edificacion contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->etiqueta_edificacion = $value;
            return true;
        } else {
            $this->data_error = 'La etiqueta edificacion debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setMedioEnvio($value, $min = 2, $max = 250)
    {
        if (!Validator::validateString($value)) {
            $this->data_error = 'Medio envio contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->medio_envio = $value;
            return true;
        } else {
            $this->data_error = 'Medio envios debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }



    public function setProducto($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->nombre_producto = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del producto es incorrecto';
            return false;
        }
    }

    public function setEstado($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->estado_envio = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }



    public function setCantidad($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad_entidad = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad del producto debe ser mayor o igual a 1';
            return false;
        }
    }

    public function setCosto($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->costo_envio = $value;
            return true;
        } else {
            $this->data_error = 'el costo de envio debe ser mayor o igual a 1';
            return false;
        }
    }
 
    public function setImpuesto($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->impuesto_envio = $value;
            return true;
        } else {
            $this->data_error = 'el impuesto debe ser mayor o igual a 1';
            return false;
        }
    }
    public function setTiempo_final($value)
    {
        if (Validator::validateDate($value)) {
            $this->tiempo_final = $value;
            return true;
        } else {
            $this->data_error = 'La fecha final es incorrecta';
            return false;
        }
    }

    

    public function setFechaEstimada($value)
    {
        if (Validator::validateDate($value)) {
            $this->fecha_estimada = $value;
            return true;
        } else {
            $this->data_error = 'La fecha final es incorrecta';
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
 