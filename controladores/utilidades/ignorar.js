// Función para agregar referencia CSS usando cache busting y retorno de promesa
function cssReference(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${href}?v=1.0.0`;
        link.onload = resolve; // Resuelve la promesa q hace la pagina cuando el css se carga
        link.onerror = reject; 
        document.head.appendChild(link);
    });
}

// Función para generar el HTML del sidebar
function sideBar() {
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
            </ul>
            <div class="sidebar-footer">
                <a href="#" class="sidebar-link" aria-label="Cerrar sesión">
                    <i class="lni lni-exit"></i>
                </a>
                <select class="form-select ms-2 ms-md-5 dropup" aria-label="Cambiar Idioma">
                    <option value="en">English</option>
                    <option selected="es">Español</option>
                </select>
            </div>
        </aside>
    `;
}

// Función para cargar la template
function loadTemplate() {
    const mainElement = document.querySelector('main');

    if (mainElement) {
        mainElement.classList.add('wrapper', 'd-flex');

        const mainTitleDiv = document.createElement('div');
        mainTitleDiv.id = 'mainTitle';
        mainTitleDiv.classList.add('flex-shrink-0');
        mainElement.insertBefore(mainTitleDiv, mainElement.firstChild);

        const sidebarHTML = sideBar();
        mainTitleDiv.innerHTML = sidebarHTML;

        const hamBurger = mainTitleDiv.querySelector(".toggle-btn");
        hamBurger.addEventListener("click", function () {
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
