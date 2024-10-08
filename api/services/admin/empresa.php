<?php
// Se incluye la clase del modelo.
require_once('../../models/data/empresa_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $Empresa = new EmpresaData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $Empresa->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$Empresa->setNombre_empresa($_POST['nombreEmpresa'])
                ) {
                    $result['error'] = $Empresa->getDataError();
                } elseif ($Empresa->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empresa registrada correctamente';
                    // Se asigna el estado del archivo después de insertar.
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar la empresa';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $Empresa->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen Empresas registradas';
                }
                break;
            case 'readOne':
                if (!$Empresa->setId_empresa($_POST['idEmpresa'])) {
                    $result['error'] = $Empresa->getDataError();
                } elseif ($result['dataset'] = $Empresa->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Empresa inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$Empresa->setId_empresa($_POST['idEmpresa']) or
                    !$Empresa->setNombre_empresa($_POST['nombreEmpresa'])
                ) {
                    $result['error'] = $Empresa->getDataError();
                } elseif ($Empresa->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empresa modificada correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la empresa';
                }
                break;
            case 'deleteRow':
                if (
                    !$Empresa->setId_empresa($_POST['idEmpresa'])
                ) {
                    $result['error'] = $Empresa->getDataError();
                } elseif ($Empresa->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empresa eliminada correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la empresa';
                }
                break;
            case 'compExistenciasProductos':
                if (!$Empresa->setId_categoria($_POST['idCategoria'])) {
                    $result['error'] = $Empresa->getDataError();
                } elseif ($result['dataset'] = $Empresa->compExistenciasProductos()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Categoria inexistente';
                }
                break;
            case 'evoCostoEnvioCliente':
                if (!$Empresa->setId_cliente($_POST['idCliente'])) {
                    $result['error'] = $Empresa->getDataError();
                } elseif ($result['dataset'] = $Empresa->evoCostoEnvioCliente()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Cliente inexistente';
                }
                break;
            case 'existenciasSegunIdCategoria':
                if ($result['dataset'] = $Empresa->existenciasSegunIdCategoria()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen Empresas registradas';
                }
                break;
            case 'clientesCompras':
                if ($result['dataset'] = $Empresa->clientesCompras()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen clientes registrados';
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
