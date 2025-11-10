// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

// Selección de elementos del DOM
const listaProductos = document.getElementById('lista-productos');
const botonesFiltro = document.querySelectorAll('.filtro-btn');
const btnCerrar = document.getElementById('btn-cerrar');
const inputBuscador = document.querySelector('.buscador input[type="text"]');

// Notificaciones
const btnNotificaciones = document.getElementById('iconoNotificacion');
const panelNotificaciones = document.getElementById('panelNotificaciones');
const listaNotificaciones = document.getElementById('listaNotificaciones');
const contadorNotificaciones = document.getElementById('contadorNotificaciones');

let todosLosProductos = []; // Variable global para almacenar los productos cargados

// === FUNCIONES DE UTILIDAD ===
function mapearProductoParaMenu(productoPlano) {
  if (productoPlano.lugar && productoPlano.lugar.nombre) return productoPlano;
  const lugar = {
    NIT: productoPlano.NIT || '',
    nombre: productoPlano.NOMBRE_LUGAR || productoPlano.nombreLugar || 'Lugar Desconocido',
    tipo: productoPlano.tipo || '',
    horario_atencion: productoPlano.horario || '',
    dias: productoPlano.dias || '',
    ubicacion: productoPlano.ubicacion || '',
    stock: productoPlano.stock ?? 0,
    precio: productoPlano.precio ?? 0
  };
  return { ...productoPlano, lugar };
}

// === MODAL ===
function crearModal(titulo, contenidoHTML) {
  document.querySelector('.modal')?.remove();
  const m = document.createElement('div');
  m.classList.add('modal', 'activo');
  m.innerHTML = `
      <div class="modal-contenido">
          <h2>${titulo}</h2>
          <div class="contenido-modal">${contenidoHTML}</div>
          <button class="btn-cerrar-modal">Cerrar</button>
      </div>`;
  document.body.appendChild(m);
  m.querySelector('.btn-cerrar-modal')?.addEventListener('click', () => m.remove());
  m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
  return m;
}

function mostrarModalVerMas(producto) {
  const lugarDetalles = producto.lugar || {};
  const precio = lugarDetalles.precio ?? producto.precio ?? 0;
  const stock = lugarDetalles.stock ?? 0;
  const estado = stock > 0 ? 'Disponible' : 'No disponible';
  const precioFormateado = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0
  }).format(precio);

  const contenido = `
      <h3>📜 Información del producto</h3>
      <p><strong>Nombre:</strong> ${producto.nombreProducto || 'N/A'}</p>
      <p><strong>Descripción:</strong> ${producto.descripcion || 'Sin descripción'}</p>
      <p><strong>Tipo:</strong> ${producto.tipo_menu || 'N/A'}</p>
      <p><strong>Precio:</strong> ${precioFormateado}</p>
      <p><strong>Estado:</strong> ${estado}</p>
      <hr>
      <h3>📍 Información del lugar</h3>
      <p><strong>NIT:</strong> ${lugarDetalles.NIT || 'N/A'}</p>
      <p><strong>Nombre:</strong> ${lugarDetalles.nombre || 'Lugar Desconocido'}</p>
      <p><strong>Tipo:</strong> ${lugarDetalles.tipo || 'N/A'}</p>
      <p><strong>Horario:</strong> ${lugarDetalles.horario_atencion || lugarDetalles.horario || 'N/A'}</p>
      <p><strong>Días:</strong> ${lugarDetalles.dias || 'N/A'}</p>
      <p><strong>Ubicación:</strong> ${lugarDetalles.ubicacion || 'N/A'}</p>
  `;
  crearModal('Detalles del producto', contenido);
}

// === RENDERIZADO ===
function renderizarProductos(productos, filtroAplicado = 'Menú') {
  if (!listaProductos) return;
  listaProductos.innerHTML = "";

  if (!productos || productos.length === 0) {
    listaProductos.innerHTML = `<p class="sin-resultados">No se encontraron resultados para: <strong>${filtroAplicado}</strong>.</p>`;
    return;
  }

  productos.forEach(producto => {
    const nombreLugar = producto.lugar?.nombre || 'Lugar Desconocido';
    const precio = producto.lugar?.precio ?? producto.precio ?? 0;
    const stock = producto.lugar?.stock ?? 0;
    const estado = stock > 0 ? 'Disponible' : 'No disponible';
    const estadoClase = stock > 0 ? 'estado-disponible' : 'estado-no-disponible';

    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');
    const productoData = JSON.stringify(producto);

    const precioFormateado = new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(precio);

    const imgSrc = producto.imagen
      ? `${API_URL}/uploads/${producto.imagen}`
      : 'https://via.placeholder.com/220x150';

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
            <p class="precio">${precioFormateado}</p>
            <p class="lugar">${nombreLugar}</p>
            <p>Estado: <span class="disponibilidad ${estadoClase}">${estado}</span></p>
        </div>
    `;
    listaProductos.appendChild(tarjeta);
  });

  try { lucide.createIcons(); } catch {}

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
      const productoData = JSON.parse(e.target.dataset.producto);
      mostrarModalVerMas(productoData);
      menu?.classList.remove('show');
    });
  });

  document.addEventListener('click', () =>
    document.querySelectorAll('.menu-opciones').forEach(m => m.classList.remove('show'))
  );
}

// === CARGAR PRODUCTOS ===
async function cargarProductos() {
  try {
    const res = await fetch(`${API_URL}/api/productos`, { cache: "no-store" });
    if (!res.ok) throw new Error('Error al cargar productos');
    const productos = await res.json();
    todosLosProductos = productos.map(p => mapearProductoParaMenu(p));
    aplicarFiltros();
  } catch {
    todosLosProductos = [
      {
        nombreProducto: 'Desayuno UAM',
        descripcion: 'Huevos, café y pan.',
        tipo_menu: 'desayuno',
        codigo: 'DES001',
        lugar: { nombre: 'Cafetería UAM', stock: 10, precio: 12000 }
      },
      {
        nombreProducto: 'Sandwich de Queso',
        descripcion: 'Ideal para la tarde.',
        tipo_menu: 'onces',
        codigo: 'ONC003',
        lugar: { nombre: 'Snack Rápido', stock: 0, precio: 5000 }
      }
    ];
    aplicarFiltros();
  }
}

// === FILTRADO ===
function aplicarFiltros() {
  const filtroActivoBtn = document.querySelector('.filtro-btn.activo');
  const filtroMenu = filtroActivoBtn ? filtroActivoBtn.textContent.trim() : 'Todos';
  const textoBusqueda = (inputBuscador?.value || '').trim().toLowerCase();

  let productosFiltrados = todosLosProductos;

  if (filtroMenu.toLowerCase() !== 'todos') {
    const tipoDeseado = filtroMenu.toLowerCase();
    productosFiltrados = productosFiltrados.filter(producto => {
      const tipoProducto = (producto.tipo_menu || '').toLowerCase();
      if (tipoDeseado === 'desayunos' && tipoProducto.includes('desayuno')) return true;
      if (tipoDeseado === 'almuerzos' && tipoProducto.includes('almuerzo')) return true;
      if (tipoDeseado === 'bebidas' && tipoProducto.includes('bebida')) return true;
      if (tipoDeseado === 'otros' && tipoProducto.includes('otro')) return true;
      return false;
    });
  }

  if (textoBusqueda) {
    productosFiltrados = productosFiltrados.filter(p =>
      (p.nombreProducto || '').toLowerCase().includes(textoBusqueda) ||
      (p.descripcion || '').toLowerCase().includes(textoBusqueda) ||
      (p.lugar?.nombre || '').toLowerCase().includes(textoBusqueda)
    );
  }

  renderizarProductos(productosFiltrados, filtroActivoBtn?.textContent.trim() || 'Resultados');
}

// === NOTIFICACIONES ===
let notificaciones = [];

function agregarNotificacion(mensaje, tipo = "info") {
  notificaciones.unshift({ mensaje, tipo, fecha: new Date().toLocaleTimeString() });
  actualizarNotificaciones();
}

function actualizarNotificaciones() {
  if (!listaNotificaciones || !contadorNotificaciones) return;
  listaNotificaciones.innerHTML = "";
  notificaciones.forEach(n => {
    const li = document.createElement("li");
    li.classList.add("notificacion", n.tipo);
    li.textContent = `${n.mensaje} (${n.fecha})`;
    listaNotificaciones.appendChild(li);
  });
  contadorNotificaciones.textContent = String(notificaciones.length);
}

// === PANEL DE NOTIFICACIONES ===
const contenedorNotificaciones = document.querySelector('.notificaciones');
if (contenedorNotificaciones && panelNotificaciones) {
  contenedorNotificaciones.addEventListener('click', function (e) {
    e.stopPropagation();
    panelNotificaciones.classList.toggle('visible');
  });

  document.addEventListener('click', (e) => {
    if (!panelNotificaciones.contains(e.target) && !contenedorNotificaciones.contains(e.target)) {
      panelNotificaciones.classList.remove('visible');
    }
  });
}

// === MENÚ 3 PUNTOS EN TARJETAS ===
document.addEventListener('click', () =>
  document.querySelectorAll('.menu-opciones').forEach(m => m.classList.remove('show'))
);

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
    const productoData = JSON.parse(e.target.dataset.producto);
    mostrarModalVerMas(productoData);
    menu?.classList.remove('show');
  });
});


// === EVENTOS GLOBALES ===
botonesFiltro.forEach(btn => {
  btn.addEventListener('click', () => {
    botonesFiltro.forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    aplicarFiltros();
  });
});

inputBuscador?.addEventListener('input', aplicarFiltros);
btnCerrar?.addEventListener('click', () => window.location.href = "inicio.html");

document.addEventListener('DOMContentLoaded', cargarProductos);
