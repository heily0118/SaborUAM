// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

// === VARIABLES GLOBALES DE DATOS (NO DE DOM) ===
let todosLosProductos = []; 
let notificaciones = []; // 🔔 Global para las notificaciones


// =======================================================
// === FUNCIONES DE UTILIDAD ===
// =======================================================

// Convierte un producto plano a formato anidado con "lugar"
function mapearProductoParaMenu(producto) {
  if (producto.lugar && producto.lugar.nombre) return producto;
  return {
    ...producto,
    lugar: {
      NIT: producto.NIT || '',
      nombre: producto.NOMBRE_LUGAR || producto.nombreLugar || 'Lugar Desconocido',
      tipo: producto.tipo || '',
      horario_atencion: producto.horario || '',
      dias: producto.dias || '',
      ubicacion: producto.ubicacion || '',
      stock: producto.stock ?? 0,
      precio: producto.precio ?? 0
    }
  };
}


// =======================================================
// === MODALES ===
// =======================================================
function crearModal(titulo, contenidoHTML) {
  document.querySelector('.modal')?.remove();
  const modal = document.createElement('div');
  modal.classList.add('modal', 'activo');
  modal.innerHTML = `
    <div class="modal-contenido">
      <h2>${titulo}</h2>
      <div class="contenido-modal">${contenidoHTML}</div>
      <button class="btn-cerrar-modal">Cerrar</button>
    </div>`;
  document.body.appendChild(modal);

  modal.querySelector('.btn-cerrar-modal')?.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

function mostrarModalVerMas(producto) {
  const lugar = producto.lugar || {};
  const stock = lugar.stock ?? 0;
  const estado = stock > 0 ? 'Disponible' : 'No disponible';
  const precio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })
    .format(lugar.precio ?? producto.precio ?? 0);

  const contenido = `
    <h3>Producto</h3>
    <p><strong>Nombre:</strong> ${producto.nombreProducto || 'N/A'}</p>
    <p><strong>Descripción:</strong> ${producto.descripcion || 'Sin descripción'}</p>
    <p><strong>Tipo:</strong> ${producto.tipo_menu || 'N/A'}</p>
    <p><strong>Precio:</strong> ${precio}</p>
    <p><strong>Estado:</strong> ${estado}</p>
    <hr>
    <h3>Lugar</h3>
    <p><strong>Nombre:</strong> ${lugar.nombre || 'Lugar Desconocido'}</p>
    <p><strong>Tipo:</strong> ${lugar.tipo || 'N/A'}</p>
    <p><strong>Horario:</strong> ${lugar.horario_atencion || 'N/A'}</p>
    <p><strong>Días:</strong> ${lugar.dias || 'N/A'}</p>
    <p><strong>Ubicación:</strong> ${lugar.ubicacion || 'N/A'}</p>
  `;
  crearModal('Detalles del producto', contenido);
}


// =======================================================
// === RENDERIZADO DE PRODUCTOS ===
// =======================================================
function renderizarProductos(productos, listaProductosElement, filtroAplicado = 'Menú') {
  if (!listaProductosElement) return;

  listaProductosElement.innerHTML = '';
  if (productos.length === 0) {
    listaProductosElement.innerHTML = `<p class="sin-resultados">No se encontraron resultados para: <strong>${filtroAplicado}</strong>.</p>`;
    return;
  }

  productos.forEach(producto => {
    const lugar = producto.lugar || {};
    const stock = lugar.stock ?? 0;
    const estado = stock > 0 ? 'Disponible' : 'No disponible';
    const estadoClase = stock > 0 ? 'estado-disponible' : 'estado-no-disponible';
    const precio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })
      .format(lugar.precio ?? producto.precio ?? 0);
    const imgSrc = producto.imagen ? `${API_URL}/uploads/${producto.imagen}` : 'https://via.placeholder.com/220x150';
    const productoData = JSON.stringify(producto);

    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');
    tarjeta.innerHTML = `
      <img src="${imgSrc}" alt="${producto.nombreProducto}" onerror="this.onerror=null;this.src='https://via.placeholder.com/220x150'">
      <div class="info">
        <div class="nombre-y-accion">
          <h3>${producto.nombreProducto}</h3>
          <div class="acciones-tarjeta">
            <button class="menu-btn"><i data-lucide="more-vertical"></i></button>
            <div class="menu-opciones">
              <button class="detalles-btn" data-producto='${productoData}'>Más Información</button>
            </div>
          </div>
        </div>
        <p class="precio">${precio}</p>
        <p class="lugar">${lugar.nombre || 'Lugar Desconocido'}</p>
        <p>Estado: <span class="disponibilidad ${estadoClase}">${estado}</span></p>
      </div>`;
    listaProductosElement.appendChild(tarjeta);
  });

  try { lucide.createIcons(); } catch (e) {}

  // Eventos de tarjeta
  document.querySelectorAll('.tarjeta').forEach(t => {
    const menuBtn = t.querySelector('.menu-btn');
    const menu = t.querySelector('.menu-opciones');
    menuBtn?.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelectorAll('.menu-opciones').forEach(m => { if (m !== menu) m.classList.remove('show'); });
      menu?.classList.toggle('show');
    });
    t.querySelector('.detalles-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      mostrarModalVerMas(JSON.parse(e.target.dataset.producto));
      menu?.classList.remove('show');
    });
  });

  document.addEventListener('click', () =>
    document.querySelectorAll('.menu-opciones').forEach(m => m.classList.remove('show'))
  );
}


// =======================================================
// === CARGA DE PRODUCTOS ===
// =======================================================
async function cargarProductos(listaProductosElement, inputBuscadorElement) {
  try {
    const res = await fetch(`${API_URL}/api/productos`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const productos = await res.json();
    todosLosProductos = productos.map(mapearProductoParaMenu);
  } catch {
    todosLosProductos = [
      { nombreProducto: 'Desayuno UAM', descripcion: 'Huevos, café y pan.', tipo_menu: 'desayuno', codigo: 'DES001', lugar: { nombre: 'Cafetería UAM', stock: 10, precio: 12000, tipo: 'Cafetería', horario_atencion: '7:00-16:00', dias: 'Lun-Vie', ubicacion: 'Bloque A' } },
      { nombreProducto: 'Sandwich de Queso', descripcion: 'Ideal para la tarde.', tipo_menu: 'onces', codigo: 'ONC003', lugar: { nombre: 'Snack Rápido', stock: 0, precio: 5000, tipo: 'Snack', horario_atencion: '8:00-18:00', dias: 'Lun-Sab', ubicacion: 'Cerca a la Biblioteca' } },
      { nombreProducto: 'Almuerzo Ejecutivo', descripcion: 'Sopa, seco y jugo.', tipo_menu: 'almuerzo', codigo: 'ALM002', lugar: { nombre: 'Restaurante Central', stock: 50, precio: 15000, tipo: 'Restaurante', horario_atencion: '12:00-14:00', dias: 'Lun-Vie', ubicacion: 'Bloque C' } }
    ];
  }
  aplicarFiltros(listaProductosElement, inputBuscadorElement);
}


// =======================================================
// === FILTROS ===
// =======================================================
function aplicarFiltros(listaProductosElement, inputBuscadorElement) {
  if (!inputBuscadorElement) return;

  const filtroActivoBtn = document.querySelector('.filtro-btn.activo');
  const filtroMenu = filtroActivoBtn?.textContent.trim() || 'Todos';
  const textoBusqueda = inputBuscadorElement.value.trim().toLowerCase();

  let filtrados = todosLosProductos;

  if (filtroMenu.toLowerCase() !== 'todos' && filtroMenu.toLowerCase() !== 'menú') {
    const tipoDeseado = filtroMenu.toLowerCase();
    filtrados = filtrados.filter(p =>
      (p.tipo_menu || '').toLowerCase().includes(tipoDeseado) ||
      tipoDeseado.includes((p.tipo_menu || '').toLowerCase())
    );
  }

  if (textoBusqueda) {
    filtrados = filtrados.filter(p =>
      (p.nombreProducto || '').toLowerCase().includes(textoBusqueda) ||
      (p.descripcion || '').toLowerCase().includes(textoBusqueda) ||
      (p.lugar?.nombre || '').toLowerCase().includes(textoBusqueda)
    );
  }

  renderizarProductos(filtrados, listaProductosElement, filtroActivoBtn?.textContent.trim() || 'resultados');
}


// =======================================================
// === SISTEMA DE NOTIFICACIONES ===
// =======================================================
function agregarNotificacion(mensaje, tipo = "info") {
  const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  notificaciones.unshift({ mensaje, tipo, hora });
  actualizarPanelNotificaciones();
}

function actualizarPanelNotificaciones() {
  const listaNotificaciones = document.getElementById("listaNotificaciones");
  const contadorNotificaciones = document.getElementById("contadorNotificaciones");

  if (!listaNotificaciones || !contadorNotificaciones) return;

  listaNotificaciones.innerHTML = "";
  notificaciones.forEach(n => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${n.mensaje}</strong><br><small style="color: gray;">${n.hora}</small>`;
    li.className = n.tipo;
    listaNotificaciones.appendChild(li);
  });
  contadorNotificaciones.textContent = notificaciones.length;
}

function inicializarNotificaciones() {
  // Usa el contenedor .notificaciones para evitar problemas si lucide reemplaza el <i>
  const contenedorNotificaciones = document.querySelector('.notificaciones');
  const campana = document.getElementById("iconoNotificacion");
  const panelNotificaciones = document.getElementById("panelNotificaciones");

  if (!contenedorNotificaciones || !panelNotificaciones) {
    console.warn("⚠️ No se encontró el contenedor o el panel de notificación. Verifica HTML IDs.");
    return;
  }

  // Abrir/cerrar panel: usar delegación segura (closest) para soportar SVG interno de Lucide
  contenedorNotificaciones.addEventListener('click', e => {
    const clickedBell = e.target.closest('#iconoNotificacion');
    if (clickedBell) {
      e.stopPropagation();
      panelNotificaciones.classList.toggle("visible");
      // Forzar estilos de display por si acaso
      panelNotificaciones.style.display = panelNotificaciones.classList.contains('visible') ? 'flex' : '';
    }
  });

  // Cerrar al hacer clic fuera (usar closest para detectar el icono aunque sea SVG)
  document.addEventListener('click', e => {
    const clicDentroPanel = panelNotificaciones.contains(e.target);
    const clicDentroCampana = Boolean(e.target.closest('#iconoNotificacion'));
    if (!clicDentroPanel && !clicDentroCampana) {
      panelNotificaciones.classList.remove('visible');
      panelNotificaciones.style.display = '';
    }
  });
}



// =======================================================
// === INICIO DE LA APLICACIÓN ===
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const listaProductosElement = document.getElementById('lista-productos');
  const botonesFiltroElements = document.querySelectorAll('.filtro-btn');
  const inputBuscadorElement = document.querySelector('.buscador input[type="text"]');

  // Inicializar Notificaciones
  inicializarNotificaciones();

  // Filtros
  botonesFiltroElements.forEach(btn => {
    btn.addEventListener('click', () => {
      botonesFiltroElements.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      aplicarFiltros(listaProductosElement, inputBuscadorElement);
    });
  });

  // Búsqueda
  inputBuscadorElement?.addEventListener('input', () =>
    aplicarFiltros(listaProductosElement, inputBuscadorElement)
  );

     // === CERRAR SESIÓN ===
  const btnCerrarSesion = document.getElementById("btn-cerrar");

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();

      const confirmar = confirm("¿Seguro que deseas cerrar sesión?");
      if (!confirmar) return;

      // 🧹 Limpia datos de sesión (ajusta si usas localStorage o token)
      localStorage.removeItem("usuarioActivo");
      sessionStorage.removeItem("usuarioActivo");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // 🔔 Notificación de cierre
      agregarNotificacion("Sesión cerrada correctamente", "info");

      // 🔁 Redirige al login
      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);
    });
  } else {
    console.warn("⚠️ No se encontró el botón de cerrar sesión (#btn-cerrar).");
  }


  // Ejemplos de notificaciones
  agregarNotificacion("Promoción de PonyMalta 2x1");
  agregarNotificacion("Descuento en fruta fresca 🍎");

  // Cargar productos
  cargarProductos(listaProductosElement, inputBuscadorElement);
});
