const VERIFICATION_FORM = document.getElementById('verificationForm');
const codigoInput = document.getElementById('codigo_secret');

// Agregar un evento de entrada para filtrar caracteres no numéricos
codigoInput.addEventListener('input', (event) => {
    // Reemplaza cualquier carácter que no sea un dígito
    event.target.value = event.target.value.replace(/\D/g, '');
});

// Manejo del envío del formulario
VERIFICATION_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();  // Evita el envío predeterminado del formulario

    const codigo = codigoInput.value;  // Obtener el valor del input
    const token = new URLSearchParams(window.location.search).get('token');  

    const FORM = new FormData();
    FORM.append('codigo_secret', codigo);
    FORM.append('token', token);

    const DATA = await fetchData(USER_API, 'emailPasswordValidator', FORM);

    if (DATA.status) {
        sweetAlert(1, "Código verificado. Redirigiendo...", true);

        setTimeout(() => {
            window.location.href = 'cambio_contraseña.html?token=' + DATA.dataset;
        }, 3000);  
    } else {
        sweetAlert(2, DATA.error, false);
    }
});
