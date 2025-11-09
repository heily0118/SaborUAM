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
                <i data-lucide="more-vertical"></i>
            </div>
        `;
        
        // Lógica para registrar consulta al hacer clic (Mantenida)
        tarjeta.addEventListener('click', async () => { /* ... tu lógica de registro ... */ });
        
        listaProductos.appendChild(tarjeta);
    });

    try { lucide.createIcons(); } catch(e) {}
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
            // Desayunos coincide con 'desayuno' o 'desayunos'
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
// === FUNCIONALIDAD DE NOTIFICACIONES (DATOS FIJOS SOLICITADOS) ===
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