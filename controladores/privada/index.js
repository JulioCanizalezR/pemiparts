// Constante para establecer el formulario de registro del primer usuario.
const SIGNUP_FORM = document.getElementById('signupForm');
// Constante para establecer el formulario de inicio de sesión.
const LOGIN_FORM = document.getElementById('loginForm');
const DOUBLE_CHECK_ENABLED = true; // Cambia a false si deseas que sea opcional.
// Método del evento para cuando el documento ha cargado.
const REGISTER_LINK = document.getElementById('registerLink');
const verificacionInput = document.getElementById('verificacion');

// Agregar un evento de entrada para filtrar caracteres no numéricos
verificacionInput.addEventListener('input', (event) => {
    // Reemplaza cualquier carácter que no sea un dígito
    event.target.value = event.target.value.replace(/\D/g, '');
});

REGISTER_LINK.addEventListener('click', (event) => {
    event.preventDefault();  // Prevenir el comportamiento predeterminado del enlace.
    
    // Ocultar el formulario de inicio de sesión y mostrar el de registro.
    LOGIN_FORM.classList.add('d-none');
    SIGNUP_FORM.classList.remove('d-none');

    // Cambiar el título principal a "Registrarse".
    document.getElementById('mainTitle').textContent = 'Registrarse';
});

document.addEventListener('DOMContentLoaded', async () => {
    // Código existente para inicializar el formulario de inicio de sesión.
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
    // Evento cuando se haga clic en "¿Olvidaste tu contraseña?"
    document.querySelector('a[href="recuperacion_contraseña.html"]').addEventListener('click', async (event) => {
        event.preventDefault(); // Prevenir comportamiento por defecto del enlace

        const correo = document.getElementById('correo').value; // Obtener el correo ingresado

        if (!correo) {
            sweetAlert(2, "Por favor, ingresa tu correo para recuperar la contraseña.", false);
            return;
        }

        // Llamar a la API para enviar el correo de recuperación
        const FORM = new FormData();
        FORM.append('correo', correo);

        const DATA = await fetchData(USER_API, 'emailPasswordSender', FORM);

        if (DATA.status) {
            sweetAlert(1, "Se ha enviado un código a tu correo.", true);
            // Redirigir a la página de recuperación
            window.location.href = 'recuperacion_contraseña.html?token=' + DATA.dataset; // Pasa el token en la URL
        } else {
            sweetAlert(2, DATA.error, false);
        }
    });
});



/// Método del evento para cuando se envía el formulario de registro.
SIGNUP_FORM.addEventListener('submit', async (event) => {
    // Evitar la recarga de la página.
    event.preventDefault();

    // Validar el formulario.
    if (!SIGNUP_FORM.checkValidity()) {
        event.stopPropagation();
        SIGNUP_FORM.classList.add('was-validated');
        return;
    }

    // Objeto con los datos del formulario.
    const FORM = new FormData(SIGNUP_FORM);

    // Petición para consultar los usuarios registrados.
    const DATA = await fetchData(USER_API, 'readUsers');

    if (DATA.session) {
        location.href = 'dashboard.html';
    } else if (DATA.status) {
        // Mostrar el formulario de inicio de sesión.
        document.getElementById('mainTitle').textContent = 'Iniciar sesión';
        LOGIN_FORM.classList.remove('d-none');
        sweetAlert(4, "Ya existen usuarios en la base de datos", true, 'index.html');
    } else {
        // Petición para registrar al primer usuario.
        const DATA = await fetchData(USER_API, 'signUp', FORM);
        if (DATA.status) {
            sweetAlert(1, DATA.message, true, 'index.html');
        } else {
            sweetAlert(2, DATA.error, false);
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
