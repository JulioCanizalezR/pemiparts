const PRODUCTO_API = "services/admin/producto.php";
const CATEGORIA_API = "services/admin/categoria.php"
const saveModal = new bootstrap.Modal("#saveModal"),
  modalTitle = document.getElementById("modalTitle");
const seeModal = new bootstrap.Modal("#seeModal"),
  modalTitle2 = document.getElementById("modalTitle2");

const saveForm = document.getElementById("saveForm"),
  sidProducto = document.getElementById("idProducto"),
  sNombreProducto = document.getElementById("producto"),
  sDescripcionProducto = document.getElementById("descripcion"),
  sCantidadProducto = document.getElementById("cantidad"),
  sPrecioProducto = document.getElementById("precio"),
  sCategoriaProducto = document.getElementById("categoria"),
  sImagenProducto = document.getElementById("imagen");

const seeForm = document.getElementById("seeForm"),
  idProducto = document.getElementById("idProducto"),
  nombreProducto = document.getElementById("nombre"),
  descripcionProducto = document.getElementById("descripcion"),
  cantidadProducto = document.getElementById("cantidad"),
  precioProducto = document.getElementById("precio"),
  categoriaProducto = document.getElementById("categoria"),
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
  seeModal.show();
  modalTitle2.value = "Información del Producto";
  nombreProducto.textContent = productData.nombre;
  descripcionProducto.textContent = productData.descripcion;
  cantidadProducto.textContent = productData.cantidad;
  precioProducto.textContent = productData.precio;
  categoriaProducto.textContent = productData.categoria;
  imagenProducto.src = `${SERVER_URL}images/productos/${productData.imagen}`;
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
  sNombreProducto.value = productData.nombre;
  sDescripcionProducto.value = productData.descripcion;
  sCantidadProducto.value = productData.cantidad;
  sPrecioProducto.value = productData.precio;
  sCategoriaProducto.value = productData.categoria;
};

const fillCards = async () => {
  const cardsContainer = document.getElementById("cards");
  try {
    cardsContainer.innerHTML = "";
    const data = await fetchData(PRODUCTO_API, "readAll");
    if (data.status) {
      data.dataset.forEach(product => {
        const productCard = createProductCard(product);
        cardsContainer.innerHTML += productCard;
      });
    } else {
      console.error("Error al obtener los datos:", data.error);
      sweetAlert(2, data.error, false);
    }
  } catch (error) {
    console.error("Error al obtener datos de la API:", error);
    sweetAlert(2, error, false);
  }
};

const createProductCard = (product) => {
    const precioRedondeado = parseFloat(product.precio_producto).toFixed(2);
  return `
    <div class="col-md-5 col-sm-12 mb-4">
      <div class="tarjeta shadow d-flex align-items-center p-3">
        <div class="col-4 p-2 d-flex justify-content-center align-items-center">
          <img class="img-fluid rounded" src="${SERVER_URL}images/productos/${product.imagen_producto}" alt="${product.nombre_producto}">
        </div>
        <div class="col-8 p-2 d-flex flex-column">
          <p class="text-secondary mb-1">Nombre: ${product.nombre_producto}</p>
          <p class="text-secondary mb-1">Descripción: ${product.descripción_producto}</p>
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

