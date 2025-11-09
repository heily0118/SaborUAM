// menu.js

// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

// === SELECCIÓN DE ELEMENTOS ===
const listaProductos = document.getElementById('lista-productos');
const botonesFiltro = document.querySelectorAll('.filtro-btn');
const btnCerrar = document.querySelector('.btn-cerrar');
const inputBuscador = document.querySelector('.buscador input[type="text"]');

// Almacenará la lista completa de la API
let todosLosProductos = [];

// --- FUNCIONES DE RENDERIZADO Y LÓGICA ---

/**
 * Función para pintar las tarjetas de productos en el HTML.
 * @param {Array} productos - La lista de productos a mostrar.
 * @param {string} filtroAplicado - El filtro (categoría o texto de búsqueda) aplicado.
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
        
        // Objeto de producto limpio para pasar al modal
        const productoData = JSON.stringify(producto);

        // Asumiendo que el campo 'precio' y 'imagen' existen en el objeto producto
        const precioFormateado = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(producto.precio ?? 0);
        
        const imgSrc = producto.imagen ? `${API_URL}/uploads/${producto.imagen}` : 'https://via.placeholder.com/220x150';

        tarjeta.innerHTML = `
            <img src="${imgSrc}" alt="${producto.nombreProducto}">
            <div class="info">
                <h3>${producto.nombreProducto}</h3>
                <p class="precio">${precioFormateado}</p>
                <p class="lugar">${nombreLugar}</p>
                <p class="lugar">Tipo: ${producto.tipo_menu || 'N/A'}</p> 
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
    
    // ==================================================
    // NUEVA LÓGICA: EVENTOS DE BOTONES DE TARJETA Y MODAL
    // ==================================================
    document.querySelectorAll('.tarjeta').forEach(t => {
        const menuBtn = t.querySelector('.menu-btn');
        const menu = t.querySelector('.menu-opciones');
        
        // 1. Mostrar/Ocultar Menú (puntos verticales)
        menuBtn?.addEventListener('click', e => {
            e.stopPropagation();
            // Cierra otros menús abiertos
            document.querySelectorAll('.menu-opciones').forEach(m => { if (m !== menu) m.classList.remove('show'); });
            menu?.classList.toggle('show');
        });

        // 2. Listener para "Más Información"
        t.querySelector('.detalles-btn')?.addEventListener('click', e => { 
            e.stopPropagation(); 
            const productoData = JSON.parse(e.target.dataset.producto);
            mostrarModalVerMas(productoData); // Llama a la función del modal
            menu?.classList.remove('show'); // Oculta el menú después del clic
        });
    });

    // 3. Cerrar cualquier menú al hacer clic en cualquier parte de la ventana
    document.addEventListener('click', () => document.querySelectorAll('.menu-opciones').forEach(m => m.classList.remove('show')));
}

/**
 * Crea la estructura básica del modal (similar a admin.js).
 */
function crearModal(titulo, contenidoHTML, hasClose = true) {
    const m = document.createElement('div');
    m.classList.add('modal', 'activo');
    // El botón 'Cerrar' se reemplaza por el botón 'Cerrar' amarillo en la imagen
    m.innerHTML = `<div class="modal-contenido"><h2>${titulo}</h2><div class="contenido-modal">${contenidoHTML}</div><button class="btn-cerrar-modal">Cerrar</button></div>`;
    document.body.appendChild(m);
    m.querySelector('.btn-cerrar-modal')?.addEventListener('click', () => m.remove());
    return m;
}

/**
 * Muestra el modal con los detalles completos del producto y lugar.
 * @param {Object} producto - El objeto de datos completo del producto.
 */
function mostrarModalVerMas(producto) {
    // Replicamos la estructura de datos del admin.js para asegurar compatibilidad
    const productoDetalles = {
        nombreProducto: producto.nombreProducto || 'N/A',
        descripcion: producto.descripcion || 'Sin descripción',
        tipo_menu: producto.tipo_menu || 'N/A',
        precio: producto.precio ?? 'N/A',
        estado: producto.estado || 'Disponible', // Asumimos disponible si no hay estado
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
 * Aplica los filtros (Menú y Búsqueda) y llama al renderizado.
 */
function aplicarFiltros() {
    // 1. Obtener filtros activos
    const filtroActivoBtn = document.querySelector('.filtro-btn.activo');
    // Obtenemos el texto del botón (Todos, Desayunos, Almuerzos, etc.)
    const filtroMenu = filtroActivoBtn ? filtroActivoBtn.textContent.trim() : 'Todos';
    const textoBusqueda = inputBuscador.value.trim().toLowerCase();
    
    // 2. Filtrar por menú (categoría)
    let productosFiltrados = todosLosProductos;
    
    if (filtroMenu.toLowerCase() !== 'todos') {
        const tipoDeseado = filtroMenu.toLowerCase();
        
        productosFiltrados = productosFiltrados.filter(producto => {
            const tipoProducto = (producto.tipo_menu || '').toLowerCase();
            
            // Lógica de coincidencia parcial/inclusiva:
            if (tipoDeseado === 'desayunos' && tipoProducto.includes('desayuno')) return true;
            if (tipoDeseado === 'almuerzos' && tipoProducto.includes('almuerzo')) return true;
            if (tipoDeseado === 'bebidas' && tipoProducto.includes('bebida')) return true;
            if (tipoDeseado === 'otros' && (tipoProducto.includes('otro') || tipoProducto.includes('varios') || tipoProducto === '')) return true;
            
            // Coincidencia estricta si el tipo de menú en DB es igual al botón
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

    // 4. Determinar qué texto mostrar
    const filtroMostrado = textoBusqueda ? `"${textoBusqueda}"` : filtroMenu;

    // 5. Renderizar los resultados
    renderizarProductos(productosFiltrados, filtroMostrado);
}


// === FUNCIÓN PRINCIPAL: CARGAR PRODUCTOS INICIALMENTE ===
async function cargarDatosIniciales() {
    try {
        listaProductos.innerHTML = '<p class="cargando">Cargando productos...</p>';
        
        const res = await fetch(`${API_URL}/api/productos`);
        // Asegúrate de que el backend devuelva un array de productos con campo 'tipo_menu'
        todosLosProductos = await res.json();
        
        // Muestra por defecto todos los productos al cargar
        aplicarFiltros(); 
        
    } catch (error) {
        console.error('❌ Error al cargar productos iniciales:', error);
        listaProductos.innerHTML = "<p>Hubo un problema al cargar los productos. Por favor, verifica tu conexión.</p>";
    }
}


// --- EVENT LISTENERS ---

// 1. EVENTO DE FILTRO POR TIPO DE MENÚ (CORREGIDO)
botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
        // Manejo de la clase 'activo'
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        boton.classList.add('activo');

        // Llama a la función unificada de filtrado
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

// 4. CARGAR PRODUCTOS AL INICIO
window.addEventListener('DOMContentLoaded', cargarDatosIniciales);

// ===============================================
// === FUNCIONALIDAD DE NOTIFICACIONES (MANTENIDA) ===
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    // === SELECCIÓN DE ELEMENTOS DE NOTIFICACIÓN ===
    const btnNotificaciones = document.getElementById('btn-notificaciones');
    const listaNotificaciones = document.getElementById('lista-notificaciones');
    const contadorNotificaciones = document.getElementById('contador-notificaciones');

    // 1. Datos Fijos SOLICITADOS (Basados en la imagen)
    const promocionesFijas = [
        {
            titulo: "Nuevo pedido en Cafetería Principal",
            descripcion: "Pendiente de confirmación.",
            detalle: "Ahora"
        },
        {
            titulo: "Producto 'Empanada' no disponible",
            descripcion: "El artículo ha sido marcado como no disponible.",
            detalle: "Cafetería Principal"
        }
    ];

    // 2. Función para cargar los datos quemados con estilo de título
    function cargarPromocionesQuemadas() {
        if (!listaNotificaciones) return;

        // Inserta el título "Notificaciones"
        listaNotificaciones.innerHTML = `<h3>Notificaciones</h3>`; 

        promocionesFijas.forEach(promo => {
            const item = document.createElement('div');
            item.className = 'notificacion-item';
            // Estructura para mostrar el punto y el texto
            item.innerHTML = `
                <span class="punto-notificacion"></span> 
                <strong>${promo.titulo}</strong>
                <p>${promo.descripcion}</p>
                <small>${promo.detalle}</small>
            `;
            listaNotificaciones.appendChild(item);
        });
        
        // Inicializa el contador (será 2)
        if (contadorNotificaciones) {
            contadorNotificaciones.textContent = promocionesFijas.length; 
            contadorNotificaciones.style.display = 'block';
        }
    }
    
    // 3. Manjeador del Clic en la Campana
    if (btnNotificaciones && listaNotificaciones) {
        // Cargar los datos al inicio
        cargarPromocionesQuemadas();

        btnNotificaciones.addEventListener('click', (e) => {
            e.stopPropagation(); 
            // Mostrar/ocultar el panel
            listaNotificaciones.classList.toggle('activo');

            // Ocultar el contador al abrir
            if (listaNotificaciones.classList.contains('activo')) {
                   if (contadorNotificaciones) {
                       contadorNotificaciones.style.display = 'none';
                   }
            } else {
                // Mostrar el contador al cerrar
                   if (contadorNotificaciones && parseInt(contadorNotificaciones.textContent) > 0) {
                        contadorNotificaciones.style.display = 'block';
                   }
            }
        });

        // 4. Cerrar el panel al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (listaNotificaciones.classList.contains('activo') && 
                !listaNotificaciones.contains(e.target) && 
                !btnNotificaciones.contains(e.target)) {
                
                listaNotificaciones.classList.remove('activo');
            }
        });
    }
});