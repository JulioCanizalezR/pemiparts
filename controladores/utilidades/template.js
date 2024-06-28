// Constante para completar la ruta de la API.
const USER_API = 'services/admin/usuario.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
// Se establece el título de la página web.
document.querySelector('title').textContent = 'Sistema Pemi';

// Función para agregar referencia CSS usando cache busting y retorno de promesa
function cssReference(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${href}?v=1.0.0`;
        link.onload = resolve; // Resuelve la promesa cuando el CSS se carga
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

// Función para generar el HTML del sidebar
const generateSideBarHTML = async () => {
    // Petición para obtener el nombre del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'getUser');
    // Se verifica si el usuario está autenticado, de lo contrario se envía a iniciar sesión.
    if (DATA && DATA.session) {
        // Se comprueba si existe un alias definido para el usuario, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            return `
                <aside id="sidebar" class="sidebar">
                    <div class="d-flex">
                        <button class="toggle-btn" type="button">
                            <img src="../recursos/img/vector.png" alt="Logo" width="24px" height="24px">
                        </button>
                        <div class="sidebar-logo">
                            <a href="../vistas/dashboard.html">Pemi Parts</a>
                        </div>
                    </div>
                    <ul class="sidebar-nav">
                        <li class="sidebar-item">
                            <a href="../vistas/productos.html" class="sidebar-link">
                                <i class="bi bi-box-seam"></i>
                                <span>Productos</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                            <a href="../vistas/usuario.html" class="sidebar-link">
                                <i class="bi bi-people"></i>
                                <span>Usuarios</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                            <a href="../vistas/clientes.html" class="sidebar-link">
                                <i class="bi bi-person-lines-fill"></i>
                                <span>Clientes</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                            <a href="../vistas/contenedores.html" class="sidebar-link">
                                <i class="bi bi-layout-text-window-reverse"></i>
                                <span>Contenedor</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                            <a href="../vistas/cotizaciones.html" class="sidebar-link">
                                <i class="bi bi-file-text"></i>
                                <span>Cotizaciones</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                            <a href="../vistas/categorias.html" class="sidebar-link">
                                <i class="bi bi-Categoria-text"></i>
                                <span>Categorias</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                            <a href="../vistas/empresas.html" class="sidebar-link">
                                <i class="bi bi-empresas-text"></i>
                                <span>Empresas</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                            <a href="../vistas/entidades.html" class="sidebar-link">
                                <i class="bi bi-entidades-text"></i>
                                <span>Entidades</span>
                            </a>
                        </li>
                    </ul>
                    <div class="sidebar-footer">
                        <a href="#" class="sidebar-link" onclick="logOut()" aria-label="Cerrar sesión">
                            <i class="lni lni-exit"></i>
                        </a>
                        <select class="form-select ms-2 ms-md-5 dropup" aria-label="Cambiar Idioma">
                            <option value="en">English</option>
                            <option selected="es">Español</option>
                        </select>
                    </div>
                </aside>
            `;
        } else {
            // Manejo del error si no hay alias
            return `<div>Error: Alias de usuario no definido.</div>`;
        }
    } else {
        // Redirigir o mostrar mensaje de error si no está autenticado
        sweetAlert(1, "Error no has iniciado sesión", 3);
        return '';
    }
}

// Función para cargar la template
async function loadTemplate() {
    const mainElement = document.querySelector('main');

    if (mainElement) {
        mainElement.classList.add('wrapper', 'd-flex');

        const mainTitleDiv = document.createElement('div');
        mainTitleDiv.id = 'mainTitle';
        mainTitleDiv.classList.add('flex-shrink-0');
        mainElement.insertBefore(mainTitleDiv, mainElement.firstChild);

        // Inserta el HTML del sidebar
        const sidebarHTML = await generateSideBarHTML();
        mainTitleDiv.innerHTML = sidebarHTML;

        const hamBurger = mainTitleDiv.querySelector(".toggle-btn");
        hamBurger?.addEventListener("click", function () {
            mainTitleDiv.querySelector("#sidebar").classList.toggle("expand");
        });

        const mainContentDiv = document.getElementById('mainContent');
        if (mainContentDiv) {
            mainContentDiv.classList.add('main', 'p-3', 'text-center');
        }
    }
}

// Cargar referencias CSS y luego cargar la template
document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        cssReference('../recursos/css/template_style.css'),
        cssReference('../recursos/css/bootstrap-icons.min.css'),
        cssReference('../recursos/css/lineicons.css')
    ]).then(loadTemplate).catch((error) => {
        console.error('Error loading CSS files:', error);
    });
});
