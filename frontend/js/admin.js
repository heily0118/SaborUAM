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
const inputBuscador = document.getElementById('buscador');

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
    if (!respuestaProducto.ok) throw new Error(dataProducto.error || 'Error al guardar el producto');

    alert('✅ Producto y lugar agregados correctamente.');

    modal.style.display = 'none';
    formProducto.reset();
    paso1.style.display = 'block';
    paso2.style.display = 'none';

    await cargarProductos();
  } catch (error) {
    console.error('❌ Error al guardar producto o lugar:', error);
    alert('Hubo un error al guardar. Revisa la consola.');
  }
});

// === FUNCIÓN PARA CARGAR PRODUCTOS EXISTENTES ===
let productosGlobal = [];

async function cargarProductos() {
  try {
    const res = await fetch(`${API_URL}/api/productos`);
    const productos = await res.json();
    productosGlobal = productos;
    mostrarProductos(productosGlobal);
  } catch (error) {
    console.error('❌ Error al cargar productos:', error);
  }
}

// === FUNCIÓN PARA MOSTRAR PRODUCTOS ===
function mostrarProductos(lista) {
  listaProductos.innerHTML = "";

  if (lista.length === 0) {
    listaProductos.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  lista.forEach(producto => {
    const estado = (producto.estado || '').toLowerCase().trim();
    let colorClase = '';
    let estadoTexto = '';

    if (estado === 'disponible') {
      colorClase = 'estado-disponible';
      estadoTexto = 'Disponible';
    } else if (estado === 'no disponible') {
      colorClase = 'estado-no-disponible';
      estadoTexto = 'No disponible';
    } else {
      colorClase = 'estado-desconocido';
      estadoTexto = producto.estado || 'Sin estado';
    }

    const precioNumerico = parseFloat(producto.precio) || 0;
    const precioFormateado = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precioNumerico);

    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');
    tarjeta.innerHTML = `
      <img src="${API_URL}/uploads/${producto.imagen}" alt="${producto.nombreProducto}">
      <div class="info">
        <h3>${producto.nombreProducto}</h3>
        <p class="precio">${precioFormateado}</p>
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

  document.addEventListener("click", () => {
    document.querySelectorAll(".menu-opciones").forEach(menu => menu.classList.remove("show"));
  });
}

// === FILTRO POR TIPO DE MENÚ ===
document.querySelectorAll(".filtro-btn").forEach(boton => {
  boton.addEventListener("click", e => {
    document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("activo"));
    e.target.classList.add("activo");

    const tipoSeleccionado = e.target.textContent.trim().toLowerCase();

    if (tipoSeleccionado === "todos") {
      mostrarProductos(productosGlobal);
      return;
    }

    const filtrados = productosGlobal.filter(p => {
      const tipoProducto = (p.tipo_menu || "").toLowerCase().trim();
      return (
        (tipoSeleccionado === "desayunos" && tipoProducto.includes("desayuno")) ||
        (tipoSeleccionado === "almuerzos" && tipoProducto.includes("almuerzo")) ||
        (tipoSeleccionado === "bebidas" && tipoProducto.includes("bebida")) ||
        (tipoSeleccionado === "otros" && tipoProducto.includes("otro"))
      );
    });

    mostrarProductos(filtrados);
  });
});

// === FUNCIÓN DE BÚSQUEDA ===
function aplicarFiltros() {
  const texto = inputBuscador.value.toLowerCase().trim();

  const filtrados = productosGlobal.filter(p => {
    const nombre = (p.nombreProducto || "").toLowerCase();
    const tipo = (p.tipo_menu || "").toLowerCase();
    return nombre.includes(texto) || tipo.includes(texto);
  });

  mostrarProductos(filtrados);
}

inputBuscador.addEventListener('keyup', aplicarFiltros);
inputBuscador.addEventListener('change', aplicarFiltros);

document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos relacionados con notificaciones ---
  const campanaContainer = document.getElementById('campana-container'); // contenedor clickeable
  const iconoCampana = document.getElementById('iconoCampana');         // icono (SVG creado por lucide)
  const panelNotificaciones = document.getElementById('panel-notificaciones');

  // --- Seguridad: si no encuentra los elementos, no hace nada ---
  if (!campanaContainer || !iconoCampana || !panelNotificaciones) {
    console.warn('Elemento de notificaciones no encontrado en el DOM.');
    return;
  }

  // --- Función para generar contenido del panel (simulado) ---
  function generarContenidoNotificaciones() {
    const notificacionesSimuladas = [
      { tipo: 'pedido', mensaje: '🍔 Nuevo pedido en Cafetería Principal' },
      { tipo: 'producto', mensaje: '📦 Producto "Empanada" marcado como No disponible' }
    ];

    let html = '<h3>🎉 Notificaciones</h3>';
    if (notificacionesSimuladas.length === 0) {
      html += '<ul><li>No hay notificaciones nuevas.</li></ul>';
    } else {
      html += '<ul>';
      notificacionesSimuladas.forEach(n => {
        html += `<li>${n.mensaje}</li>`;
      });
      html += '</ul>';
    }
    return html;
  }

  // --- Función para abrir el panel ---
  function abrirPanel() {
    panelNotificaciones.innerHTML = generarContenidoNotificaciones();
    panelNotificaciones.classList.add('mostrar');
    panelNotificaciones.setAttribute('aria-hidden', 'false');
  }

  // --- Función para cerrar el panel ---
  function cerrarPanel() {
    panelNotificaciones.classList.remove('mostrar');
    panelNotificaciones.setAttribute('aria-hidden', 'true');
  }

  // --- Abrir/cerrar al hacer clic en la campana ---
  campanaContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    const abierto = panelNotificaciones.classList.contains('mostrar');
    if (abierto) cerrarPanel();
    else abrirPanel();
  });

  // --- Cerrar si se hace clic fuera del panel ---
  document.addEventListener('click', (e) => {
    if (!panelNotificaciones.contains(e.target) && !campanaContainer.contains(e.target)) {
      cerrarPanel();
    }
  });

  // --- Evitar que se cierre al hacer clic dentro del panel ---
  panelNotificaciones.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});




// === CARGAR PRODUCTOS AL INICIO ===
window.addEventListener('DOMContentLoaded', cargarProductos);
