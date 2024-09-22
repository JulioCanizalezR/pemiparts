<?php
// Se incluye la clase del modelo.
require_once('../../models/data/contenedor_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $contenedor = new ContenedorData;
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
                } elseif ($result['dataset'] = $contenedor->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$contenedor->setContenedor($_POST['contenedor']) or
                    !$contenedor->setFecha_inicio($_POST['fechaInicio']) or
                    !$contenedor->setTiempo_final($_POST['tiempoFinal']) 
                ) {
                    $result['error'] = $contenedor->getDataError();
                } elseif ($contenedor->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'contenedor creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el contenedor';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $contenedor->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen contenedores registrados';
                }
                break;
            case 'readOne':
                if (!$contenedor->setId($_POST['idContenedor'])) {
                    $result['error'] = $contenedor->getDataError();
                } elseif ($result['dataset'] = $contenedor->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Contenedor inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$contenedor->setId($_POST['idContenedor']) or
                    !$contenedor->setTiempo_final($_POST['tiempoFinal'])
                ) {
                    $result['error'] = $contenedor->getDataError();
                } elseif ($contenedor->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contenedor modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el contenedor';
                }
                break;
            case 'deleteRow':
                if (
                    !$contenedor->setId($_POST['idContenedor'])
                ) {
                    $result['error'] = $contenedor->getDataError();
                } elseif ($contenedor->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contenedor eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el contenedor';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando un cliente no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'createDetail':
                $result['error'] = 'Debe iniciar sesión para agregar el producto al carrito';
                break;
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
