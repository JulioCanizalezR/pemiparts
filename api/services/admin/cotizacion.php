<?php
// Se incluye la clase del modelo.
require_once('../../models/data/cotizacion_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $cotizacion = new CotizacionData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null, 'dataset' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idUsuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
                // Acción para agregar un producto al carrito de compras.
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $cotizacion->searchRows()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cotizacion->setEstado($_POST['estadoEnvio']) or
                    !$cotizacion->setFechaEstimada($_POST['fechaEstimada']) or
                    !$cotizacion->setNumeroSeguimiento($_POST['numeroSeguimiento']) or
                    !$cotizacion->setEtiquetaEdificacion($_POST['etiquetaEdificacion']) or
                    !$cotizacion->setIdCliente($_POST['nombreCliente'])
                ) {
                    $result['error'] = $cotizacion->getDataError();
                } elseif ($cotizacion->createRow()) {
                    $lastId = $cotizacion->getLastInsertedId(); // Obtener el último ID insertado

                    if (!$lastId) {
                        $result['error'] = 'No se pudo obtener el ID del envío recién creado';
                    } else {
                        if (
                            !$cotizacion->setIdEnvio($lastId) or
                            !$cotizacion->setMedioEnvio($_POST['medioEnvio']) or
                            !$cotizacion->setCostoEnvio($_POST['costoEnvio']) or
                            !$cotizacion->setImpuestoEnvio($_POST['impuestoEnvio']) or
                            !$cotizacion->setIdEntidad($_POST['nombreEntidad']) or
                            !$cotizacion->setCantidadEntidad($_POST['cantidadEntidad']) or
                            !$cotizacion->setDireccionEnvio($_POST['direccionEnvio'])
                        ) {
                            $result['error'] = $cotizacion->getDataError();
                        } elseif ($cotizacion->createRowDetalle()) {
                            $result['status'] = 1;
                            $result['message'] = 'Cotización y detalles de envío creados correctamente';
                        } else {
                            $result['error'] = 'Ocurrió un problema al crear los detalles de envío';
                        }
                    }
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la cotización';
                }
                break;

            case 'readAll':
                if ($result['dataset'] = $cotizacion->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen cotizaciones registrados';
                }
                break;
            case 'readAllCoti':
                if ($result['dataset'] = $cotizacion->readAllCoti()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen cotizaciones registrados';
                }
                break;
            case 'readAllDetalle':
                if ($result['dataset'] = $cotizacion->readAllDetalle()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen cotizaciones registrados';
                }
                break;
            case 'readOne':
                if (!$cotizacion->setIdEnvio($_POST['idEnvio'])) {
                    $result['error'] = $cotizacion->getDataError();
                } elseif ($result['dataset'] = $cotizacion->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Cotización inexistente';
                }
                break;
            case 'readOneDetalle':
                if (!$cotizacion->setIdDetalle($_POST['idDetalle'])) {
                    $result['error'] = $cotizacion->getDataError();
                } elseif ($result['dataset'] = $cotizacion->readOneDetalle()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Detalle envio inexistente';
                }
                break;
            case 'updateRowDetalle':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cotizacion->setMedioEnvio($_POST['medioEnvio2']) or
                    !$cotizacion->setCostoEnvio($_POST['costoEnvio2']) or
                    !$cotizacion->setImpuestoEnvio($_POST['impuestoEnvio2']) or
                    !$cotizacion->setIdEntidad($_POST['nombreEntidad2']) or
                    !$cotizacion->setCantidadEntidad($_POST['cantidadEntidad2']) or
                    !$cotizacion->setDireccionEnvio($_POST['direccionEnvio2']) or
                    !$cotizacion->setId($_POST['idDetalle2'])
                ) {
                    $result['error'] = $cotizacion->getDataError();
                } elseif ($cotizacion->updateRowDetalle()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cotización modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el detalle de la cotización';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cotizacion->setEstado($_POST['estadoEnvio2']) or
                    !$cotizacion->setFechaEstimada($_POST['fechaEstimada2']) or
                    !$cotizacion->setNumeroSeguimiento($_POST['numeroSeguimiento2']) or
                    !$cotizacion->setEtiquetaEdificacion($_POST['etiquetaEdificacion2']) or
                    !$cotizacion->setIdCliente($_POST['nombreCliente2']) or
                    !$cotizacion->setIdEnvio($_POST['idEnvio2'])
                ) {
                    $result['error'] = $cotizacion->getDataError();
                } elseif ($cotizacion->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cotización modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la cotización';
                }
                break;
            case 'getEstados':
                if ($result['dataset'] = $cotizacion->getEstados()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen estados registrados';
                }
                break;
            case 'deleteRow':
                if (
                    !$cotizacion->setIdEnvio($_POST['idEnvio'])
                ) {
                    $result['error'] = $cotizacion->getDataError();
                } elseif ($cotizacion->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cotización eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la cotización';
                }
                break;
            case 'deleteRowDetalle':
                if (
                    !$cotizacion->setId($_POST['idDetalle'])
                ) {
                    $result['error'] = $cotizacion->getDataError();
                } elseif ($cotizacion->deleteRowDetalle()) {
                    $result['status'] = 1;
                    $result['message'] = 'Detalle de la cotización eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la cotización';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando un cliente no ha iniciado sesión.
        switch ($_GET['action']) {
            default:
                $result['error'] = 'Acción no disponible fuera de la sesión';
        }
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
