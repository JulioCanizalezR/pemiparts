// Constante para establecer el formulario de registro del primer usuario.
const SIGNUP_FORM = document.getElementById('signupForm');
// Constante para establecer el formulario de inicio de sesión.
const LOGIN_FORM = document.getElementById('loginForm');
const DOUBLE_CHECK_ENABLED = true; // Cambia a false si deseas que sea opcional.
// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Petición para consultar los usuarios registrados.
    const DATA = await fetchData(USER_API, 'readUsers');
    // Se comprueba si existe una sesión, de lo contrario se sigue con el flujo normal.
    if (DATA.session) {
        // Se direcciona a la página web de bienvenida.
        location.href = 'dashboard.html';
    } else if (DATA.status) {
        // Se muestra el formulario para iniciar sesión.
        LOGIN_FORM.classList.remove('d-none');

        sweetAlert(4, DATA.message, true);
    } else {
        // Se muestra el formulario para registrar el primer usuario.
        SIGNUP_FORM.classList.remove('d-none');
        sweetAlert(4, DATA.error, true);
    }
});



// Método del evento para cuando se envía el formulario de registro del primer usuario.
SIGNUP_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Validar el formulario
    if (!SIGNUP_FORM.checkValidity()) {
        event.stopPropagation();
        SIGNUP_FORM.classList.add('was-validated');
        return;
    }
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SIGNUP_FORM);


    // Fetch user data
    const DATA = await fetchData(USER_API, 'readUsers');

    // Handle response
    if (DATA.session) {
        location.href = 'dashboard.html';
    } else if (DATA.status) {
        // Show login form
        MAIN_TITLE.textContent = 'Iniciar sesión';
        LOGIN_FORM.classList.remove('d-none');
        sweetAlert(4, "Ya existen usuarios en la base de datos", true, 'index.html');
    } else {
        // Petición para registrar el primer usuario del sitio privado.
        const data = await fetchData(USER_API, 'signUp', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (data.status) {
            sweetAlert(1, data.message, true, 'index.html');
        } else {
            sweetAlert(2, data.error, true);
        }
    }
});

 

 
// Método del evento para cuando se envía el formulario de inicio de sesión.
LOGIN_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const FORM = new FormData(LOGIN_FORM);

    // Enviar correo con el código de verificación
    const DATA = await fetchData(USER_API, 'sendVerificationCode', FORM);
    if (DATA.status) {
        sweetAlert(1, "Se ha enviado un código de verificación a tu correo.", true);
        // Ocultar campos de correo y contraseña
        LOGIN_FORM.classList.add('d-none'); // Asegúrate de que esto oculte el formulario correctamente
        // Mostrar el contenedor del código de verificación
        document.getElementById('doubleCheckContainer').classList.remove('d-none');
    } else {
        sweetAlert(2, DATA.error, false);
    }
});


// Evento para verificar el código de verificación
document.getElementById('verifyButton').addEventListener('click', async () => {
    const verificationCode = document.getElementById('verificacion').value;
    const FORM = new FormData(LOGIN_FORM); // Aquí no necesitas el formulario de login, ya que solo estás verificando
    FORM.append('verificacion', verificationCode);

    // Petición para iniciar sesión con el código de verificación
    const DATA = await fetchData(USER_API, 'logIn', FORM);
    
    if (DATA.status) {
        sweetAlert(1, DATA.message, true, 'dashboard.html');
    } else {
        sweetAlert(2, DATA.error, false);
    }
});
