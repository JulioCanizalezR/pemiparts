const PRODUCTO_API = "services/admin/producto.php";
const CATEGORIA_API = "services/admin/categoria.php"
const saveModal = new bootstrap.Modal("#saveModal"),
  modalTitle = document.getElementById("modalTitle");
const seeModal = new bootstrap.Modal("#seeModal"),
  modalTitle2 = document.getElementById("modalTitle2");

const SEARCH_INPUT = document.getElementById("searchInput");

const saveForm = document.getElementById("saveForm"),
  sidProducto = document.getElementById("idProducto"),
  sNombreProducto = document.getElementById("nombreProducto"),
  sDescripcionProducto = document.getElementById("descripcionProducto"),
  sImpuestoProducto = document.getElementById("impuestoProducto"),
  sCostoProducto = document.getElementById("costoProducto"),
  sPrecioProducto = document.getElementById("precioProducto"),
  sCodigoProducto = document.getElementById("codigoProducto"),
  sCategoriaProducto = document.getElementById("categoriaProducto"),
  sImagenProducto = document.getElementById("imagenProducto");

const seeForm = document.getElementById("seeForm"),
  idProducto = document.getElementById("idProducto"),
  nombreProducto = document.getElementById("nombre"),
  categoriaProducto = document.getElementById("categoria"),
  precioProducto = document.getElementById("precio"),
  cantidadProducto = document.getElementById("cantidad"),
  costoProducto = document.getElementById("costoProduccion"),
  descripcionProducto = document.getElementById("descripcion"),
  imagenProducto = document.getElementById("imagen");

document.addEventListener("DOMContentLoaded", () => {
  fillCards();
});

saveForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveOrUpdateProduct();
});

seeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveOrUpdateProduct();
});

SEARCH_INPUT.addEventListener("input", (event) => {
  event.preventDefault();
  const FORM = new FormData();
  FORM.append("search", SEARCH_INPUT.value);
  if (SEARCH_INPUT.value == "") {
    fillCards();
  } else {
    fillCards(FORM);
  }
});

const saveOrUpdateProduct = async () => {
  const action = sidProducto.value ? "updateRow" : "createRow";
  const formData = new FormData(saveForm);
  const data = await fetchData(PRODUCTO_API, action, formData);

  if (data.status) {
    saveModal.hide();
    sweetAlert(1, data.message, true);
    fillCards();
  } else {
    sweetAlert(4, data.error, true);
  }
};

const openCreate = () => {
  saveModal.show();
  modalTitle.textContent = "Crear Producto";
  saveForm.reset();
  fillSelect(CATEGORIA_API, 'readAll', 'categoriaProducto');
};

const readOne = async (id) => {
  const formData = new FormData();
  formData.append("idProducto", id);
  const data = await fetchData(PRODUCTO_API, "readOne", formData);

  if (data.status) {
    populateProductModal(data.dataset);
  } else {
    sweetAlert(4, data.error, true);
  }
};

const populateProductModal = (productData) => {
  const imageUrl = `${SERVER_URL}images/productos/${productData.imagen_producto}`;
  seeModal.show();
  modalTitle2.value = "Información del Producto";
  const priceProduct = parseFloat(productData.precio_producto).toFixed(2);
  idProducto.value = productData.id_producto;
  nombreProducto.textContent = productData.nombre_producto;
  categoriaProducto.textContent = productData.nombre_categoria;
  precioProducto.textContent = priceProduct;
  cantidadProducto.textContent = productData.existencias;
  descripcionProducto.textContent = productData.descripcion_producto;
  costoProducto.textContent = productData.costo_compra;
  imagenProducto.src = imageUrl;
  imagenProducto.onerror = () => {
    imagenProducto.src = `${SERVER_URL}images/productos/default.png`;
  };
  document.getElementById('Actualizar').onclick = () => openUpdate(productData.id_producto);
  document.getElementById('Eliminar').onclick = () => openDelete(productData.id_producto);
};


const openDelete = async (id) => {
  const response = await confirmAction('¿Desea eliminar el producto de forma permanente?');
  if (response) {
    const formData = new FormData();
    formData.append('idProducto', id);
    const data = await fetchData(PRODUCTO_API, 'deleteRow', formData);
    if (data.status) {
      seeModal.hide();
      await sweetAlert(1, data.message, true);
      fillCards();
    } else {
      sweetAlert(2, data.error, false);
    }
  }
};

const openUpdate = async (id) => {
  seeModal.hide();
  const formData = new FormData();
  formData.append("idProducto", id);
  const data = await fetchData(PRODUCTO_API, "readOne", formData);

  if (data.status) {
    populateUpdateForm(data.dataset);
  } else {
    sweetAlert(2, data.error, false);
  }
};

const populateUpdateForm = (productData) => {
  saveModal.show();
  modalTitle.textContent = "Actualizar el Producto";
  saveForm.reset();
  sidProducto.value = productData.id_producto;
  sNombreProducto.value = productData.nombre_producto;
  sDescripcionProducto.value = productData.descripcion_producto;
  sImpuestoProducto.value = parseInt(productData.impuesto_producto, 10);
  sCostoProducto.value = productData.costo_compra;
  sPrecioProducto.value = productData.precio_producto;
  sCodigoProducto.value = productData.codigo_producto;
  fillSelect(CATEGORIA_API, 'readAll', 'categoriaProducto', productData.id_categoria);
};

const fillCards = async (form = null) => {
  const cardsContainer = document.getElementById("cards");
  try {
    let action = form ? "searchRows" : "readAll";
    const data = await fetchData(PRODUCTO_API, action, form);
    cardsContainer.innerHTML = "";  

    if (data.status) {
      if (data.dataset.length === 1) {
        cardsContainer.classList.add("single-card");
      } else {
        cardsContainer.classList.remove("single-card");
      }

      data.dataset.forEach((product) => {
        const productCard = createProductCard(product);
        cardsContainer.innerHTML += productCard;
      });
    } else {
      sweetAlert(2, data.error, false);
    }
  } catch (error) {
    console.error("Error al obtener datos de la API:", error);
    sweetAlert(2, error, false);
  }
};


const createProductCard = (product) => {
  const precioRedondeado = parseFloat(product.precio_producto).toFixed(2);
  const imageUrl = `${SERVER_URL}images/productos/${product.imagen_producto}`;

  return `
    <div class="col-md-5 col-sm-12 mb-4">
      <div class="tarjeta shadow d-flex align-items-center p-3">
        <div class="col-4 p-2 d-flex justify-content-center align-items-center">
          <img class="img-fluid rounded" src="${imageUrl}" alt="${product.nombre_producto}" onerror="this.src='${SERVER_URL}images/productos/default.png'">
        </div>
        <div class="col-8 p-2 d-flex flex-column">
          <p class="text-secondary mb-1">Nombre: ${product.nombre_producto}</p>
          <p class="text-secondary mb-1">Descripción: ${product.descripcion_producto}</p>
          <p class="text-secondary mb-1">Cantidad: ${product.existencias}</p>
          <p class="text-secondary mb-1">Precio: $${precioRedondeado}</p>
          <p class="text-secondary mb-1">Categoría: ${product.nombre_categoria}</p>
          <div class="mt-auto d-flex justify-content-end">
            <button class="btn btn-primary" onclick="readOne(${product.id_producto})">Ver más</button>
          </div>
        </div>
      </div>
    </div>`;
};



var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
});

const openReport = () => {
 
  const PATH = new URL(`${SERVER_URL}reports/admin/reporte_general_productos.php`);
 
  window.open(PATH.href);
}
const openReportPred = () => {
  // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
  const PATH = new URL(`${SERVER_URL}reports/admin/producto_predicciones.php`);
  // Se abre el reporte en una nueva pestaña.
  window.open(PATH.href);
}
