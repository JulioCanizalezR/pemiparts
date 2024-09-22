<?php
// Se incluye la clase del modelo.
require_once('../../models/data/chat_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $chat = new ChatData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $chat->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$chat->setIdUsuarioReceptor($_POST['idUsuario']) or
                    !$chat->setMensaje($_POST['mensaje'])
                ) {
                    $result['error'] = $chat->getDataError();
                } elseif ($chat->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'chat registrada correctamente';
                    // Se asigna el estado del archivo después de insertar.
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar la chat';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $chat->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen chats registradas';
                }
                break;
            case 'readAllMessagesSends':
                if ($result['dataset'] = $chat->readAllMessagesSends()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen chats registradas';
                }
                break;
            case 'readAllMessagesRecived':
                if ($result['dataset'] = $chat->readAllMessagesRecived()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen chats registradas';
                }
                break;
            case 'readAllMessagesSendsChat':
                if (!$chat->setId($_POST['idChat'])) {
                    $result['error'] = $chat->getDataError();
                } elseif ($result['dataset'] = $chat->readAllMessagesSendsChat()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen chats registradas';
                }
                break;
            case 'readAllMessagesRecivedChat':
                if (!$chat->setId($_POST['idChat'])) {
                    $result['error'] = $chat->getDataError();
                } elseif ($result['dataset'] = $chat->readAllMessagesRecivedChat()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen chats registradas';
                }
                break;
            case 'readOne':
                if (!$chat->setId($_POST['idchat'])) {
                    $result['error'] = $chat->getDataError();
                } elseif ($result['dataset'] = $chat->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'chat inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$chat->setIdUsuarioReceptor($_POST['idUsuario']) or
                    !$chat->setMensaje($_POST['mensaje']) or
                    !$chat->setId($_POST['idChat'])
                ) {
                    $result['error'] = $chat->getDataError();
                } elseif ($chat->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'chat modificada correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la chat';
                }
                break;
            case 'deleteRow':
                if (
                    !$chat->setId($_POST['idChat'])
                ) {
                    $result['error'] = $chat->getDataError();
                } elseif ($chat->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'chat eliminada correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la chat';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
