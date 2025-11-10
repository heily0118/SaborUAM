// menu.js

// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

// === SELECCIÓN DE ELEMENTOS ===
const listaProductos = document.getElementById('lista-productos');
const botonesFiltro = document.querySelectorAll('.filtro-btn');
const btnCerrar = document.getElementById('btn-cerrar');
const inputBuscador = document.querySelector('.buscador input[type="text"]');
const btnNotificaciones = document.getElementById('btn-notificaciones');
const listaNotificaciones = document.getElementById('lista-notificaciones');
const contadorNotificaciones = document.getElementById('contador-notificaciones');

// Almacenará la lista completa de la API
let todosLosProductos = [];

// --- FUNCIONES DE RENDERIZADO Y LÓGICA ---

/**
 * Crea la estructura básica del modal para la vista del cliente.
 */
function crearModal(titulo, contenidoHTML) {
    // Eliminar cualquier modal existente antes de crear uno nuevo
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
    
    // Listener para cerrar el modal con el botón
    m.querySelector('.btn-cerrar-modal')?.addEventListener('click', () => m.remove());
    
    // Listener para cerrar el modal al hacer clic fuera
    m.addEventListener('click', (e) => {
        if (e.target === m) {
            m.remove();
        }
    });
    return m;
}

/**
 * Muestra el modal con los detalles completos del producto y lugar.
 * (Esta función se mantiene con los detalles completos para el modal de "Más Información")
 * @param {Object} producto - El objeto de datos completo del producto.
 */
function mostrarModalVerMas(producto) {
    const productoDetalles = {
        nombreProducto: producto.nombreProducto || 'N/A',
        descripcion: producto.descripcion || 'Sin descripción',
        tipo_menu: producto.tipo_menu || 'N/A',
        precio: producto.precio ?? 'N/A',
        estado: producto.estado || 'Disponible',
        lugar: {
            NIT: producto.NIT || 'N/A',
            nombre: producto.NOMBRE_LUGAR || 'Lugar Desconocido',
            tipo: producto.tipo || 'N/A',
            horario_atencion: producto.horario || 'N/A',
            dias: producto.dias || 'N/A',
            ubicacion: producto.ubicacion || 'N/A',
        }
    };
    
    const precioFormateado = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(productoDetalles.precio ?? 0);
    
    const contenido = `
        <h3>📜 Información del producto</h3>
        <p><strong>Nombre:</strong> ${productoDetalles.nombreProducto}</p>
        <p><strong>Descripción:</strong> ${productoDetalles.descripcion}</p>
        <p><strong>Tipo:</strong> ${productoDetalles.tipo_menu}</p>
        <p><strong>Precio:</strong> ${precioFormateado}</p>
        <p><strong>Estado:</strong> ${productoDetalles.estado}</p>

        <hr style="margin:10px 0;">

        <h3>📍 Información del lugar</h3>
        <p><strong>NIT:</strong> ${productoDetalles.lugar.NIT}</p>
        <p><strong>Nombre:</strong> ${productoDetalles.lugar.nombre}</p>
        <p><strong>Tipo:</strong> ${productoDetalles.lugar.tipo}</p>
        <p><strong>Horario:</strong> ${productoDetalles.lugar.horario_atencion}</p>
        <p><strong>Días:</strong> ${productoDetalles.lugar.dias}</p>
        <p><strong>Ubicación:</strong> ${productoDetalles.lugar.ubicacion}</p>
    `;
    
    crearModal('Detalles del producto', contenido);
}


/**
 * Función para pintar las tarjetas de productos en el HTML. (AJUSTADA)
 */
function renderizarProductos(productos, filtroAplicado = 'Menú') {
    listaProductos.innerHTML = ""; // Limpiar antes de pintar

    if (productos.length === 0) {
        listaProductos.innerHTML = `<p class="sin-resultados">No se encontraron resultados para: <strong>${filtroAplicado}</strong>.</p>`;
        return;
    }

    productos.forEach(producto => {
        const nombreLugar = producto.NOMBRE_LUGAR || 'Lugar Desconocido';
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');
        
        const productoData = JSON.stringify(producto);

        const precioFormateado = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(producto.precio ?? 0);
        
        const imgSrc = producto.imagen ? `${API_URL}/uploads/${producto.imagen}` : 'https://via.placeholder.com/220x150';

        // ESTE ES EL HTML AJUSTADO PARA SER MINIMALISTA
        tarjeta.innerHTML = `
            <img src="${imgSrc}" alt="${producto.nombreProducto}">
            <div class="info">
                <h3>${producto.nombreProducto}</h3>
                <p class="precio">${precioFormateado}</p>
                <p class="lugar">${nombreLugar}</p> 
            </div>
            <div class="acciones-tarjeta">
                <button class="menu-btn"><i data-lucide="more-vertical"></i></button>
                <div class="menu-opciones">
                    <button class="detalles-btn" data-producto='${productoData}'>Más Información</button>
                </div>
            </div>
        `;
        
        // Lógica para registrar consulta al hacer clic (Mantenida)
        tarjeta.addEventListener('click', async () => { /* ... tu lógica de registro ... */ });
        
        listaProductos.appendChild(tarjeta);
    });

    try { lucide.createIcons(); } catch(e) {}
    
    // LÓGICA: EVENTOS DE BOTONES DE TARJETA Y MODAL (MANTENIDA)
    document.querySelectorAll('.tarjeta').forEach(t => {
        const menuBtn = t.querySelector('.menu-btn');
        const menu = t.querySelector('.menu-opciones');
        
        // 1. Mostrar/Ocultar Menú (puntos verticales)
        menuBtn?.addEventListener('click', e => {
            e.stopPropagation();
            document.querySelectorAll('.menu-opciones').forEach(m => { if (m !== menu) m.classList.remove('show'); });
            menu?.classList.toggle('show');
        });

        // 2. Listener para "Más Información"
        t.querySelector('.detalles-btn')?.addEventListener('click', e => { 
            e.stopPropagation(); 
            const productoData = JSON.parse(e.target.dataset.producto);
            mostrarModalVerMas(productoData); 
            menu?.classList.remove('show');
        });
    });

    // 3. Cerrar cualquier menú al hacer clic en cualquier parte de la ventana
    document.addEventListener('click', () => document.querySelectorAll('.menu-opciones').forEach(m => m.classList.remove('show')));
}

/**
 * Aplica los filtros (Menú y Búsqueda) y llama al renderizado.
 */
function aplicarFiltros() {
    // 1. Obtener filtros activos
    const filtroActivoBtn = document.querySelector('.filtro-btn.activo');
    const filtroMenu = filtroActivoBtn ? filtroActivoBtn.textContent.trim() : 'Todos';
    const textoBusqueda = inputBuscador.value.trim().toLowerCase();
    
    // 2. Filtrar por menú (categoría)
    let productosFiltrados = todosLosProductos;
    
    if (filtroMenu.toLowerCase() !== 'todos') {
        const tipoDeseado = filtroMenu.toLowerCase();
        
        productosFiltrados = productosFiltrados.filter(producto => {
            const tipoProducto = (producto.tipo_menu || '').toLowerCase();
            
            if (tipoDeseado === 'desayunos' && tipoProducto.includes('desayuno')) return true;
            if (tipoDeseado === 'almuerzos' && tipoProducto.includes('almuerzo')) return true;
            if (tipoDeseado === 'bebidas' && tipoProducto.includes('bebida')) return true;
            if (tipoDeseado === 'otros' && (tipoProducto.includes('otro') || tipoProducto.includes('varios') || tipoProducto === '')) return true;
            
            return tipoProducto === tipoDeseado; 
        });
    }
    
    // 3. Filtrar por búsqueda de texto
    if (textoBusqueda) {
        productosFiltrados = productosFiltrados.filter(producto => {
            const nombre = producto.nombreProducto ? producto.nombreProducto.toLowerCase() : '';
            const descripcion = producto.descripcion ? producto.descripcion.toLowerCase() : '';
            return nombre.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
        });
    }

    const filtroMostrado = textoBusqueda ? `"${textoBusqueda}"` : filtroMenu;
    renderizarProductos(productosFiltrados, filtroMostrado);
}


// === FUNCIÓN PRINCIPAL: CARGAR PRODUCTOS INICIALMENTE ===
async function cargarDatosIniciales() {
    try {
        listaProductos.innerHTML = '<p class="cargando">Cargando productos...</p>';
        
        const res = await fetch(`${API_URL}/api/productos`);
        todosLosProductos = await res.json();
        
        aplicarFiltros(); 
        
    } catch (error) {
        console.error('❌ Error al cargar productos iniciales:', error);
        listaProductos.innerHTML = "<p>Hubo un problema al cargar los productos. Por favor, verifica tu conexión.</p>";
    }
}


// --- EVENT LISTENERS ---

// 1. EVENTO DE FILTRO POR TIPO DE MENÚ
botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        boton.classList.add('activo');
        aplicarFiltros();
    });
});

// 2. EVENTO DE BÚSQUEDA
inputBuscador?.addEventListener('keyup', aplicarFiltros);
inputBuscador?.addEventListener('change', aplicarFiltros);

// 3. CERRAR SESIÓN
if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
        localStorage.removeItem('usuario_num');
        window.location.href = 'usuario.html';
    });
}




// === INICIO DE LA APLICACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
  // Cargar productos
  cargarDatosIniciales();

  // === NOTIFICACIONES ===
  // === Notificaciones ===

// Referencias a elementos
const iconoNotificacion = document.getElementById("iconoNotificacion");
const panelNotificaciones = document.getElementById("panelNotificaciones");
const contadorNotificaciones = document.getElementById("contadorNotificaciones");
const listaNotificaciones = document.getElementById("listaNotificaciones");

// Ejemplo de lista de notificaciones
let notificaciones = [
  "Nuevo producto disponible: Empanada de pollo",
  "Promoción: Café gratis con tu desayuno",
  "Recordatorio: Tu pedido está listo para recoger"
];

// Muestra las notificaciones y actualiza el contador
function cargarNotificaciones() {
  listaNotificaciones.innerHTML = "";

  if (notificaciones.length > 0) {
    contadorNotificaciones.style.display = "flex";
    contadorNotificaciones.textContent = notificaciones.length;

    notificaciones.forEach(msg => {
      const li = document.createElement("li");
      li.textContent = msg;
      listaNotificaciones.appendChild(li);
    });
  } else {
    contadorNotificaciones.style.display = "none";
    const li = document.createElement("li");
    li.textContent = "No hay notificaciones nuevas.";
    listaNotificaciones.appendChild(li);
  }
}

// Mostrar / ocultar panel al hacer clic en la campana
iconoNotificacion.addEventListener("click", () => {
  panelNotificaciones.classList.toggle("activo");
});

// Ocultar el panel si haces clic fuera de él
document.addEventListener("click", (event) => {
  if (!event.target.closest(".notificaciones")) {
    panelNotificaciones.classList.remove("activo");
  }
});

// Cargar notificaciones al inicio
cargarNotificaciones();

});
