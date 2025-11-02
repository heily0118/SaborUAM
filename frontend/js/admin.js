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
  const nit = document.getElementById('nit').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const horario = document.getElementById('horario').value.trim();
  const dias = document.getElementById('dias').value.trim();
  const servicioDomicilio = document.getElementById('servicioDomicilio').value.trim();
  const numeroContacto = document.getElementById('numeroContacto').value.trim();
  const estado = document.getElementById('estado').value.trim();
  const tipo = document.getElementById('tipo').value.trim();

  // === VALIDACIÓN ===
  if (!nombreProducto || !codigo || !tipo_menu || !descripcion || !precio) {
    alert("Por favor completa todos los campos del producto.");
    return;
  }

  if (!nombreLugar || !nit || !ubicacion || !horario || !dias || !servicioDomicilio || !numeroContacto || !estado || !tipo) {
    alert("Por favor completa toda la información del lugar.");
    return;
  }

  try {
    // === 1️⃣ GUARDAR EL LUGAR (en JSON) ===
    const lugarData = {
      NIT: nit,
      nombre: nombreLugar,
      tipo,
      horario,
      estado,
      servicioDomicilio,
      numeroContacto,
      ubicacion
    };

    // CÓDIGO CORREGIDO: DEBE FUNCIONAR
    const respuestaLugar = await fetch('http://localhost:3000/api/lugares/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lugarData)
    });

    const dataLugar = await respuestaLugar.json();
    console.log('✅ Lugar guardado:', dataLugar);

    if (!respuestaLugar.ok) throw new Error(dataLugar.mensaje || 'Error al guardar el lugar');

    // === 2️⃣ GUARDAR EL PRODUCTO (con imagen en FormData) ===
    const formData = new FormData();
    formData.append("nombreProducto", nombreProducto);
    formData.append("codigo", codigo);
    formData.append("descripcion", descripcion);
    formData.append("tipo_menu", tipo_menu);
    formData.append("precio", precio);
    formData.append("imagen", inputImagen.files[0]);
    formData.append("NIT", nit); // Relación con el lugar

    const respuestaProducto = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      body: formData
    });

    const dataProducto = await respuestaProducto.json();
    console.log('✅ Producto guardado:', dataProducto);

    if (!respuestaProducto.ok) throw new Error(dataProducto.mensaje || 'Error al guardar el producto');

    // === MOSTRAR TARJETA VISUAL ===
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

    alert('✅ Producto y lugar agregados correctamente.');
    modal.style.display = 'none';
    formProducto.reset();
    paso1.style.display = 'block';
    paso2.style.display = 'none';

  } catch (error) {
    console.error('❌ Error al guardar producto o lugar:', error);
    alert('Hubo un error al guardar. Revisa la consola.');
  }
});
