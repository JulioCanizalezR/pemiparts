<?php
// Se incluye la clase del modelo.
require_once('../../models/data/usuario_data.php');
const POST_NCONTRASEÑA = "usuario_nueva_contraseña";
const POST_CNCONTRASEÑA = "usuario_confirmar_nueva_contraseña";

const POST_CODIGO_SECRETO_CONTRASEÑA = "codigoSecretoContraseña";

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $usuario = new UsuarioData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $usuario->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$usuario->setImagen($_FILES['imagenUsuario']) or
                    !$usuario->setNombre($_POST['nombreUsuario']) or
                    !$usuario->setApellido($_POST['apellidoUsuario']) or
                    !$usuario->setTelefono($_POST['telefonoUsuario']) or
                    !$usuario->setCargo($_POST['cargoUsuario']) or
                    !$usuario->setCorreo($_POST['correoUsuario']) or
                    !$usuario->setClave($_POST['claveUsuario'])

                ) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($_POST['claveUsuario'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($usuario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenUsuario'], $usuario::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el usuario';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $usuario->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen usuarios registrados';
                }
                break;
            case 'readOne':
                if (!$usuario->setId($_POST['idUsuario'])) {
                    $result['error'] = 'Usuario incorrecto';
                } elseif ($result['dataset'] = $usuario->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Usuario inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$usuario->setId($_POST['idUsuario']) or
                    !$usuario->setNombre($_POST['nombreUsuario']) or
                    !$usuario->setFilename() or 
                    !$usuario->setApellido($_POST['apellidoUsuario']) or
                    !$usuario->setCargo($_POST['cargoUsuario']) or
                    !$usuario->setCorreo($_POST['correoUsuario']) or
                    !$usuario->setTelefono($_POST['telefonoUsuario']) or
                    !$usuario->setImagen($_FILES['imagenUsuario'], $usuario->getFilename())
                ) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario modificado correctamente';
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenUsuario'], $usuario::RUTA_IMAGEN, $usuario->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el usuario';
                }
                break;
            case 'deleteRow':
                if ($_POST['idUsuario'] == $_SESSION['idUsuario']) {
                    $result['error'] = 'No se puede eliminar a sí mismo';
                } elseif (!$usuario->setId($_POST['idUsuario'])) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($usuario::RUTA_IMAGEN, $usuario->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el usuario';
                }
                break;
            case 'getUser':
                if (isset($_SESSION['correoUsuario'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['correoUsuario'];
                } else {
                    $result['error'] = 'Alias de usuario indefinido';
                }
                break;
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            case 'readProfile':
                if ($result['dataset'] = $usuario->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
            case 'editProfile':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$usuario->setId($_POST['idUsuario']) or
                    !$usuario->setNombre($_POST['nombreUsuario']) or
                    !$usuario->setFilename() or 
                    !$usuario->setApellido($_POST['apellidoUsuario']) or
                    !$usuario->setCorreo($_POST['correoUsuario']) or
                    !$usuario->setTelefono($_POST['telefonoUsuario']) or
                    !$usuario->setImagen($_FILES['imagenUsuario'], $usuario->getFilename())
                    /*    !$usuario->setAlias($_POST['correoUsuario']) */
                ) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->editProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    $_SESSION['correoUsuario'] = $_POST['correoUsuario'];
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenUsuario'], $usuario::RUTA_IMAGEN, $usuario->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;
            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$usuario->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveUsuario'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$usuario->setClave($_POST['claveUsuario'])) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readUsers':
                if ($usuario->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear una usuario para comenzar';
                }
                break;
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$usuario->setNombre($_POST['nombreUsuario']) or
                    !$usuario->setApellido($_POST['apellidoUsuario']) or
                    !$usuario->setTelefono($_POST['telefonoUsuario']) or
                    !$usuario->setCargo('0') or
                    !$usuario->setCorreo($_POST['correoUsuario']) or
                    !$usuario->setClave($_POST['claveUsuario'])
                ) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($_POST['claveUsuario'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($usuario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario registrado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar el usuario';
                }
                break;

            case 'logIn':
                $_POST = Validator::validateForm($_POST);
                if ($usuario->checkUser($_POST['correo'], $_POST['clave'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Autenticación correcta';
                } else {
                    $result['error'] = 'Credenciales incorrectas';
                }
                break;

                case 'emailPasswordSender':
                    $_POST = Validator::validateForm($_POST);
    
                    if (!$usuario->setCorreo($_POST[POST_CORREO])) {
                        $result['error'] = $usuario->getDataError();
                    } elseif ($usuario->verifyExistingEmail()) {
    
                        $secret_change_password_code = mt_rand(10000000, 99999999);
                        $token = Validator::generateRandomString(64);
    
                        $_SESSION['secret_change_password_code'] = [
                            'code' => $secret_change_password_code,
                            'token' => $token,
                            'expiration_time' => time() + (60 * 15) # (x*y) y=minutos de vida 
                        ];
    
                        $_SESSION['usuario_correo_vcc'] = [
                            'correo' => $_POST[POST_CORREO],
                            'expiration_time' => time() + (60 * 25) # (x*y) y=minutos de vida 
                        ];
    
                        sendVerificationEmail($_POST[POST_CORREO], $secret_change_password_code);
                        $result['status'] = 1;
                        $result['message'] = 'Correo enviado';
                        $result['dataset'] = $token;
                    } else {
                        $result['error'] = 'El correo indicado no existe';
                    }
                    break;
                case 'emailPasswordValidator':
                    $_POST = Validator::validateForm($_POST);
                
                    if (!isset($_POST[POST_CODIGO_SECRETO_CONTRASEÑA])) {
                        $result['error'] = "El código no fue proporcionado";
                    } elseif (!isset($_POST["token"])) {
                        $result['error'] = 'El token no fue proporcionado';
                    } elseif (!(ctype_digit($_POST[POST_CODIGO_SECRETO_CONTRASEÑA]) && strlen($_POST[POST_CODIGO_SECRETO_CONTRASEÑA]) === 6)) {
                        $result['error'] = "El código es inválido";
                    } elseif (!isset($_SESSION['secret_change_password_code'])) {
                        $result['message'] = "El código ha expirado";
                    } elseif ($_SESSION['secret_change_password_code']['token'] != $_POST["token"]) {
                        $result['error'] = 'El token es invalido';
                    } elseif ($_SESSION['secret_change_password_code']['expiration_time'] <= time()) {
                        $result['message'] = "El código ha expirado.";
                        unset($_SESSION['secret_change_password_code']);
                    } elseif ($_SESSION['secret_change_password_code']['code'] == $_POST[POST_CODIGO_SECRETO_CONTRASEÑA]) {
                        $token = Validator::generateRandomString(64);
                        $_SESSION['secret_change_password_code_validated'] = [
                            'token' => $token,
                            'expiration_time' => time() + (60 * 10) # (x*y) y=minutos de vida 
                        ];
                        $result['status'] = 1;
                        $result['message'] = "Verificación Correcta";
                        $result['dataset'] = $token;
                        unset($_SESSION['secret_change_password_code']);
                    } else {
                        $result['error'] = "El código es incorrecto";
                    }
                    break;
                case 'changePasswordByEmail':
                    $_POST = Validator::validateForm($_POST);
                    if (!$usuario->setClave($_POST[POST_NCONTRASEÑA])) {
                        $result['error'] = $usuario->getDataError();
                    } elseif (!isset($_POST["token"])) {
                        $result['error'] = 'El token no fue proporcionado';
                    } elseif ($_SESSION['secret_change_password_code_validated']['expiration_time'] <= time()) {
                        $result['error'] = 'El tiempo para cambiar su contraseña ha expirado';
                        unset($_SESSION['secret_change_password_code_validated']);
                    } elseif ($_SESSION['secret_change_password_code_validated']['token'] != $_POST["token"]) {
                        $result['error'] = 'El token es invalido';
                    } elseif ($_POST[POST_NCONTRASEÑA] != $_POST[POST_CNCONTRASEÑA]) {
                        $result['error'] = 'Confirmación de contraseña diferente';
                    } elseif (!$usuario->setClave($_POST[POST_NCONTRASEÑA])) {
                        $result['error'] = $usuario->getDataError();
                    } elseif ($_SESSION['usuario_correo_vcc']['expiration_time'] <= time()) {
                        $result['error'] = 'El tiempo para cambiar su contraseña ha expirado';
                        unset($_SESSION['usuario_correo_vcc']);
                    } elseif ($usuario->changePasswordFromEmail()) {
                        $result['status'] = 1;
                        $result['message'] = 'Contraseña cambiada correctamente';
                        unset($_SESSION['secret_change_password_code_validated']);
                        unset($_SESSION['usuario_correo_vcc']);
                    } else {
                        $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                    }
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
