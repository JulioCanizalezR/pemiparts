  // Constante para establecer el formulario de registro del primer usuario.
  const SIGNUP_FORM = document.getElementById('signupForm');
  // Constante para establecer el formulario de inicio de sesión.
  const LOGIN_FORM = document.getElementById('loginForm');
  const MAIN_TITLE = document.getElementById('mainTitle');
  // Método del evento para cuando el documento ha cargado.
  document.addEventListener('DOMContentLoaded', async () => {
      // Load template
      loadTemplate();

      // Fetch user data
      const DATA = await fetchData(USER_API, 'readUsers');

      // Handle response
      if (DATA.session) {
          location.href = 'dashboard.html';  
      } else if (DATA.status) {
          // Show login form
          MAIN_TITLE.textContent = 'Iniciar sesión';
          LOGIN_FORM.classList.remove('d-none');
          sweetAlert(4, DATA.message, true);
      } else {
          MAIN_TITLE.textContent = 'Registrar primer usuario';
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
      // Petición para registrar el primer usuario del sitio privado.
      const DATA = await fetchData(USER_API, 'signUp', FORM);
      // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
      if (DATA.status) {
          sweetAlert(1, DATA.message, true, 'index.html');
      } else {
          sweetAlert(2, DATA.error, true);
      }
  });


  // Método del evento para cuando se envía el formulario de inicio de sesión.
  LOGIN_FORM.addEventListener('submit', async (event) => {
      // Se evita recargar la página web después de enviar el formulario.
      event.preventDefault();
      // Validar el formulario
      if (!LOGIN_FORM.checkValidity()) {
          event.stopPropagation();
          LOGIN_FORM.classList.add('was-validated');
          return;
      }
      // Constante tipo objeto con los datos del formulario.
      const FORM = new FormData(LOGIN_FORM);
      // Petición para iniciar sesión.
      const DATA = await fetchData(USER_API, 'logIn', FORM);
      // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
      if (DATA.status) {
          sweetAlert(1, DATA.message, true, 'dashboard.html');
      } else {
          sweetAlert(2, DATA.error, false);
      }
  });