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

let imagenSeleccionada = "";

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
  imagenSeleccionada = "";
});

// === PREVISUALIZAR IMAGEN ===
inputImagen.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagenSeleccionada = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagenSeleccionada = "";
  }
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
formProducto.addEventListener('submit', (event) => {
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
    !nombreLugar || !NIT || !ubicacion || !horario || !servicioDomicilio || !descripcion || !dias || !codigo || !tipo_menu ||
    !estado || !tipo || !numeroContacto
  ) {
    alert("Por favor completa toda la información del lugar.");
    return;
  }

  // === CREAR TARJETA VISUAL ===
  const tarjeta = document.createElement('div');
  tarjeta.classList.add('tarjeta');
  tarjeta.innerHTML = `
    <img src="${imagenSeleccionada}" alt="${nombreProducto}">
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
  imagenSeleccionada = "";
});

