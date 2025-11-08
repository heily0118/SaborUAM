// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

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
  const estado = document.getElementById("estadoProducto").value;
  const archivo = inputImagen.files[0];

  if (!nombre || !codigo || !tipo_menu || !descripcion || !precio || !archivo || !estado) {
    alert('⚠️ Por favor completa todos los campos antes de continuar.');
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
  const estadoProducto = document.getElementById('estadoProducto').value.trim();

  // === DATOS DEL LUGAR ===
  const nombreLugar = document.getElementById('nombreLugar').value.trim();
  const nit = document.getElementById('nit').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const horario = document.getElementById('horario').value.trim();
  const dias = document.getElementById('dias').value.trim();
  const servicioDomicilio = document.getElementById('servicioDomicilio').value.trim();
  const numeroContacto = document.getElementById('numeroContacto').value.trim();
  const estadoLugar = document.getElementById('estado').value.trim();
  const tipo = document.getElementById('tipo').value.trim();

  try {
    // === 1️⃣ GUARDAR EL LUGAR ===
    const lugarData = {
      NIT: nit,
      nombre: nombreLugar,
      tipo,
      horario,
      estado: estadoLugar,
      servicioDomicilio,
      numeroContacto,
      ubicacion
    };

    const respuestaLugar = await fetch(`${API_URL}/api/lugares/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lugarData)
    });

    const dataLugar = await respuestaLugar.json();
    if (!respuestaLugar.ok) throw new Error(dataLugar.mensaje || 'Error al guardar el lugar');

    // === 2️⃣ GUARDAR EL PRODUCTO ===
    const formData = new FormData();
    formData.append("nombreProducto", nombreProducto);
    formData.append("codigo", codigo);
    formData.append("descripcion", descripcion);
    formData.append("tipo_menu", tipo_menu);
    formData.append("precio", precio);
    formData.append("estado", estadoProducto); 
    formData.append("imagen", inputImagen.files[0]);
    formData.append("NIT", nit);

    const respuestaProducto = await fetch(`${API_URL}/api/productos`, {
      method: 'POST',
      body: formData
    });

    const dataProducto = await respuestaProducto.json();
    if (!respuestaProducto.ok) throw new Error(dataProducto.mensaje || 'Error al guardar el producto');

    alert('✅ Producto y lugar agregados correctamente.');

    modal.style.display = 'none';
    formProducto.reset();
    paso1.style.display = 'block';
    paso2.style.display = 'none';

    // 🔄 Recargar lista sin recargar la página
    await cargarProductos();
  } catch (error) {
    console.error('❌ Error al guardar producto o lugar:', error);
    alert('Hubo un error al guardar. Revisa la consola.');
  }
});

// === FUNCIÓN PARA CARGAR PRODUCTOS EXISTENTES ===
async function cargarProductos() {
  try {
    const res = await fetch(`${API_URL}/api/productos`);
    const productos = await res.json();

    listaProductos.innerHTML = ""; // Limpiar antes de volver a pintar

    productos.forEach(producto => {
      const estado = (producto.estado || '').toLowerCase().trim();

      // Detectar el color correcto
      let colorClase = '';
      let estadoTexto = '';

      if (estado === 'disponible') {
        colorClase = 'estado-disponible';
        estadoTexto = 'Disponible';
      } else if (estado === 'no disponible') {
        colorClase = 'estado-no-disponible';
        estadoTexto = 'No disponible';
      } else {
        // En caso de valores inesperados
        colorClase = 'estado-desconocido';
        estadoTexto = producto.estado || 'Sin estado';
      }

      const tarjeta = document.createElement('div');
      tarjeta.classList.add('tarjeta');
      tarjeta.innerHTML = `
        <img src="${API_URL}/uploads/${producto.imagen}" alt="${producto.nombreProducto}">
        <div class="info">
          <h3>${producto.nombreProducto}</h3>
          <p class="precio">$${producto.precio}</p>
          <p class="lugar">${producto.NOMBRE_LUGAR || 'Sin lugar'}</p>
          <p class="estado">
            Estado:
            <strong class="estado-texto ${colorClase}">
              ${estadoTexto}
            </strong>
          </p>
        </div>

        <div class="acciones-tarjeta">
          <button class="menu-btn"><i data-lucide="more-vertical"></i></button>
          <div class="menu-opciones">
            <button class="ver-btn">Ver más</button>
            <button class="editar-btn">Actualizar</button>
            <button class="eliminar-btn">Eliminar</button>
          </div>
        </div>
      `;

      listaProductos.appendChild(tarjeta);
    });

    lucide.createIcons();

    // === ABRIR / CERRAR MENÚ ===
    document.querySelectorAll(".menu-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const menu = btn.nextElementSibling;
        document.querySelectorAll(".menu-opciones").forEach(m => {
          if (m !== menu) m.classList.remove("show");
        });
        menu.classList.toggle("show");
      });
    });

    // === CERRAR MENÚ AL HACER CLIC FUERA ===
    document.addEventListener("click", () => {
      document.querySelectorAll(".menu-opciones").forEach(menu => menu.classList.remove("show"));
    });

  } catch (error) {
    console.error('❌ Error al cargar productos:', error);
  }
}


// === CARGAR PRODUCTOS AL INICIO ===
window.addEventListener('DOMContentLoaded', cargarProductos);
