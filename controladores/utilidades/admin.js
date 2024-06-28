/*
* Controlador de uso general en las páginas web del sitio privado.
* Sirve para manejar la plantilla del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'services/admin/administrador.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
MAIN.classList.add('container');

/* Función asíncrona para cargar el encabezado y pie del documento.
* Parámetros: ninguno.
* Retorno: ninguno.
*/





const loadTemplate = async () => {


    // Se agrega el encabezado de la página web antes del contenido principal.
    MAIN.insertAdjacentHTML('beforebegin', `<header>
    <nav class="navbar fixed-top sticky-sm-top">
    <div class="container">
        <button class="navbar-toggler navbar-poz" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand fw-semibold titulo" href="#" id='title'></a>
        <!-- Cuerpo -->
        <div class="offcanvas offcanvas-start celeste" tabindex="-1" id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel">
            <div class="offcanvas-header">
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
            </div>
            <!-- Cuerpo del nav -->
            <div class="offcanvas-body">
                <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                    <!-- Fila que contiene el logo centrado en la parte superior del menu -->
                    <div class="row justify-content-center mb-5">
                        <div class="col-auto">
                            <a class="logo"><i class='bx bxl-dropbox'></i></a>
                        </div>
                    </div>
                    <div class="container ms-2">
                        <!-- Etiqueta para el dashboard -->
                        <li class="nav-item">
                            <a class="nav-link active text-light" aria-current="page" href="productos.html">
                                <img src="../../../resources/img/svg/icons_menu/dashboard.svg" class="me-3"
                                    alt=""><i class='bx bxl-dropbox'></i> Productos</a>
                        </li>
                        <!-- Etiqueta para el usuario -->
                        <li class="nav-item">
                            <a class="nav-link text-light" href="usuario.html" role="button">
                                <img src="../../../resources/img/svg/icons_menu/users.svg" class="me-3" alt="">
                                <i class='bx bx-user'></i> Usuarios
                            </a>
                        </li>
                        <!-- Etiqueta para el estadisticas -->
                        <li class="nav-item">
                            <a class="nav-link text-light" href="clientes.html" role="button">
                                <img src="../../../resources/img/svg/icons_menu/estadisticas.svg" class="me-3"
                                    alt="">
                                <i class='bx bx-group'></i> Clientes
                            </a>
                        </li>
                        <!-- Etiqueta para el entrenamientos -->
                        <li class="nav-item">
                            <a class="nav-link text-light" href="contenedor.html" role="button">
                                <img src="../../../resources/img/svg/icons_menu/entrenamientos.svg" class="me-3"
                                    alt="">
                                <i class='bx bx-envelope'></i> Contenedor
                            </a>
                        </li>
                        <!-- Etiqueta para el equipos -->
                        <li class="nav-item">
                            <a class="nav-link text-light" href="cotizaciones.html" role="button">
                                <img src="../../../resources/img/svg/icons_menu/equipos.svg" class="me-3" alt="">
                                <i class='bx bx-list-ul'></i> Cotizaciones
                            </a>
                        </li>
                    </div>
                    <footer >
                        <div class="d-flex  fixed-bottom">
                            <!-- Etiqueta para el primer boton -->
                            <a class="Usuario me-3"><i class='bx bx-user text-white'></i></a>
                            <!-- Etiqueta para el segundo boton -->
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-primary dropdown-toggle"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    Español
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">English</a></li>
                                </ul>
                            </div>
                         </div>
                    </footer>
                </ul>
            </div>
        </div>
    </div>
</nav>
</header>
`);

    const userName = document.getElementById('name');
    userName.textContent = 'Chepe Martínez';

}

/*Apartado contenedor*/

/*<!-- Etiqueta para el entrenamientos -->
                            <li class="nav-item">
                                <a class="nav-link text-light" href="contenedor.html" role="button">
                                    <img src="../../../resources/img/svg/icons_menu/entrenamientos.svg" class="me-3"
                                        alt="">
                                        <i class='bx bx-envelope' ></i> Contenedor
                                </a>
                            </li>

*/

