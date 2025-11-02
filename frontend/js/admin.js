// adminis.js frontend

// === SELECCIÓN DE ELEMENTOS ===
const modal = document.getElementById('modal-agregar');
const btnAgregar = document.getElementById('btn-agregar');
const btnCancelar = document.getElementById('btn-cancelar');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnAtras = document.getElementById('btn-atras');
const formProducto = document.getElementById('form-producto');
const listaProductos = document.getElementById('lista-productos');
const paso1 = document.getElementById('paso1');
const paso2 = document.getElementById('paso2');
const inputImagen = document.getElementById('imagen-producto');

// === ABRIR MODAL ===
btnAgregar.addEventListener('click', () => {
  modal.style.display = 'flex';
  paso1.style.display = 'block';
  paso2.style.display = 'none';
});

// === CERRAR MODAL ===
btnCancelar.addEventListener('click', () => {
  modal.style.display = 'none';
  formProducto.reset();
});

// === CAMBIAR A SIGUIENTE PESTAÑA ===
btnSiguiente.addEventListener('click', () => {
  const nombre = document.getElementById('nombreProducto').value.trim();
  const codigo = document.getElementById('codigo').value.trim();
  const tipo_menu = document.getElementById('tipo_menu').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const precio = document.getElementById('precio').value.trim();
  const archivo = inputImagen.files[0];

  if (!nombre || !codigo || !tipo_menu || !descripcion || !precio || !archivo) {
    alert('Por favor completa todos los campos del producto antes de continuar.');
    return;
  }

  paso1.style.display = 'none';
  paso2.style.display = 'block';
});

// === VOLVER A LA PESTAÑA ANTERIOR ===
btnAtras.addEventListener('click', () => {
  paso2.style.display = 'none';
  paso1.style.display = 'block';
});

// === GUARDAR FORMULARIO ===
formProducto.addEventListener('submit', async (event) => {
  event.preventDefault();

  // === DATOS DEL PRODUCTO ===
  const nombreProducto = document.getElementById('nombreProducto').value.trim();
  const codigo = document.getElementById('codigo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const tipo_menu = document.getElementById('tipo_menu').value.trim();
  const precio = document.getElementById('precio').value.trim();

  // === DATOS DEL LUGAR ===
  const nombreLugar = document.getElementById('nombreLugar').value.trim();
  const NIT = document.getElementById('NIT').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const horario = document.getElementById('horario').value.trim();
  const dias = document.getElementById('dias').value.trim();
  const servicioDomicilio = document.getElementById('servicioDomicilio').value.trim();
  const numeroContacto = document.getElementById('numeroContacto').value.trim();
  const estado = document.getElementById('estado').value.trim();
  const tipo = document.getElementById('tipo').value.trim();

  // === VALIDACIÓN ===
  if (
    !nombreLugar || !NIT || !ubicacion || !horario || !servicioDomicilio || !descripcion ||
    !dias || !codigo || !tipo_menu || !estado || !tipo || !numeroContacto
  ) {
    alert("Por favor completa toda la información del lugar.");
    return;
  }

  try {
    // === CREAR FORM DATA PARA ENVIAR IMAGEN ===
    const formData = new FormData();
    formData.append("nombreProducto", nombreProducto);
    formData.append("codigo", codigo);
    formData.append("descripcion", descripcion);
    formData.append("tipo_menu", tipo_menu);
    formData.append("precio", precio);
    formData.append("nombreLugar", nombreLugar);
    formData.append("NIT", NIT);
    formData.append("ubicacion", ubicacion);
    formData.append("horario", horario);
    formData.append("dias", dias);
    formData.append("servicioDomicilio", servicioDomicilio);
    formData.append("numeroContacto", numeroContacto);
    formData.append("estado", estado);
    formData.append("tipo", tipo);
    formData.append("imagen", inputImagen.files[0]);

    // === ENVIAR AL BACKEND ===
    const respuesta = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      body: formData
    });

    if (!respuesta.ok) throw new Error('Error al guardar el producto en el servidor');

    const data = await respuesta.json();
    console.log('✅ Producto guardado en BD:', data);

    // === CREAR TARJETA VISUAL (DOM) ===
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');
    tarjeta.innerHTML = `
      <img src="http://localhost:3000/uploads/${inputImagen.files[0].name}" alt="${nombreProducto}">
      <div class="info">
        <h3>${nombreProducto}</h3>
        <p class="precio">$${precio}</p>
        <p class="lugar">${nombreLugar}</p>
      </div>
      <div class="acciones-tarjeta">
        <i data-lucide="more-vertical"></i>
      </div>
    `;

    listaProductos.appendChild(tarjeta);
    lucide.createIcons();

    // === RESETEAR Y CERRAR MODAL ===
    alert('Producto agregado correctamente.');
    modal.style.display = 'none';
    formProducto.reset();
    paso1.style.display = 'block';
    paso2.style.display = 'none';
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    alert('Hubo un error al guardar el producto. Revisa la consola.');
  }
});
