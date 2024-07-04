<?php
// Se incluye la clase del modelo.
require_once('../../models/data/entidades_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $entidad = new EntidadesData;
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
                } elseif ($result['dataset'] = $entidad->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$entidad->setIdAlmacenamiento($_POST['almacenamiento']) or
                    !$entidad->setIdProducto($_POST['producto']) or
                    !$entidad->setExistencias($_POST['existencia']) or
                    !$entidad->setEstado($_POST['estado'])
                ) {
                    $result['error'] = $entidad->getDataError();
                } elseif ($entidad->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Entidad creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el entidad';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $entidad->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen entidades registrados';
                }
                break;
            case 'readOne':
                if (!$entidad->setId($_POST['idEntidad'])) {
                    $result['error'] = $entidad->getDataError();
                } elseif ($result['dataset'] = $entidad->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Entidad inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$entidad->setId($_POST['idEntidad']) or
                    !$entidad->setIdAlmacenamiento($_POST['almacenamiento']) or
                    !$entidad->setIdProducto($_POST['producto']) or
                    !$entidad->setExistencias($_POST['aumentarExistencias']) or
                    !$entidad->setEstado($_POST['estado'])
                ) {
                    $result['error'] = $entidad->getDataError();
                } elseif ($entidad->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Entidad modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el entidad';
                }
                break;
            case 'deleteRow':
                if (
                    !$entidad->setId($_POST['idEntidad'])
                ) {
                    $result['error'] = $entidad->getDataError();
                } elseif ($entidad->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Entidad eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el entidad';
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
