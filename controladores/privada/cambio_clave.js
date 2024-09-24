const CHANGE_PASS_FORM = document.getElementById('changePasswordForm');
CHANGE_PASS_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();  // Evita que el formulario se envíe automáticamente

    const nuevaClave = document.getElementById('nuevaClave').value;
    const confirmarClave = document.getElementById('confirmarClave').value;
    const token = new URLSearchParams(window.location.search).get('token');  // Obtener el token de la URL

    // Validar si las contraseñas coinciden
    if (!nuevaClave || nuevaClave !== confirmarClave) {
        sweetAlert(2, "Las contraseñas no coinciden.", false);
        return;
    }

    const FORM = new FormData();
    FORM.append('token', token);
    FORM.append('nuevaClave', nuevaClave);
    FORM.append('confirmarClave', confirmarClave);

    const DATA = await fetchData(USER_API, 'changePasswordByEmail', FORM);

    if (DATA.status) {
        sweetAlert(1, DATA.message, true);
 
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000); 
    } else {
        sweetAlert(2, DATA.error, false);
    }
});
