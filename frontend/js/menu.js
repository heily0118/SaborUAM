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

let todosLosProductos = [];

// --- FUNCIONES DE UTILIDAD DE DATOS ---

/**
 * Mapea los productos si vienen en formato 'plano' (sin la propiedad 'lugar') 
 * al formato anidado (con la propiedad 'lugar'), esperado por ambos scripts.
 */
function mapearProductoParaMenu(productoPlano) {
    // Si ya tiene la estructura anidada, la devuelve.
    if (productoPlano.lugar && productoPlano.lugar.nombre) {
        return productoPlano; 
    }

    // Si viene plano, crea la estructura anidada 'lugar'
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
    
    // Retorna el producto con la información anidada
    return {
        ...productoPlano,
        lugar: lugar,
    };
}

// --- FUNCIONES DE MODAL Y DETALLE ---

/**
 * Crea la estructura básica del modal (VENTANA EMERGENTE).
 */
function crearModal(titulo, contenidoHTML) {
    document.querySelector('.modal')?.remove(); 
    
    const m = document.createElement('div');
    m.classList.add('modal', 'activo');
    
    // Estructura del modal de detalles completo
    m.innerHTML = `
        <div class="modal-contenido">
            <h2>${titulo}</h2>
            <div class="contenido-modal">${contenidoHTML}</div>
            <button class="btn-cerrar-modal">Cerrar</button>
        </div>`;
    
    document.body.appendChild(m);
    
    m.querySelector('.btn-cerrar-modal')?.addEventListener('click', () => m.remove());
    m.addEventListener('click', (e) => {
        if (e.target === m) {
            m.remove();
        }
    });
    return m;
}

/**
 * Muestra el modal con los detalles completos del producto y lugar.
 * Utiliza la estructura anidada (producto.lugar) para la información.
 */
function mostrarModalVerMas(producto) {
    // Asume la estructura anidada: producto.lugar
    const lugarDetalles = producto.lugar || {}; 
    const precioParaMostrar = lugarDetalles.precio ?? producto.precio ?? 0;
    const estado = (lugarDetalles.stock ?? 0) > 0 ? 'Disponible' : 'No disponible';
    
    const precioFormateado = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(precioParaMostrar);
    
    const contenido = `
        <h3>📜 Información del producto</h3>
        <p><strong>Nombre:</strong> ${producto.nombreProducto || 'N/A'}</p>
        <p><strong>Descripción:</strong> ${producto.descripcion || 'Sin descripción'}</p>
        <p><strong>Tipo:</strong> ${producto.tipo_menu || 'N/A'}</p>
        <p><strong>Precio:</strong> ${precioFormateado}</p>
        <p><strong>Estado:</strong> ${estado}</p>

        <hr style="margin:10px 0;">

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

// --- FUNCIONES DE RENDERIZADO, LÓGICA Y CARGA ---

/**
 * Función para pintar las tarjetas de productos en el HTML.
 * Utiliza la estructura anidada (producto.lugar) para precio y nombre del lugar.
 */
function renderizarProductos(productos, filtroAplicado = 'Menú') {
    listaProductos.innerHTML = ""; 

    if (productos.length === 0) {
        listaProductos.innerHTML = `<p class="sin-resultados">No se encontraron resultados para: <strong>${filtroAplicado}</strong>.</p>`;
        return;
    }

    productos.forEach(producto => {
        // Usa la estructura anidada producto.lugar
        const nombreLugar = producto.lugar?.nombre || 'Lugar Desconocido';
        const precioDelLugar = producto.lugar?.precio ?? producto.precio ?? 0;
        
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');
        
        // Se almacena el objeto completo con la estructura anidada para el modal.
        const productoData = JSON.stringify(producto);

        const precioFormateado = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(precioDelLugar);
        
        const imgSrc = producto.imagen ? `${API_URL}/uploads/${producto.imagen}` : 'https://via.placeholder.com/220x150';

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
            </div>
        `;
        
        listaProductos.appendChild(tarjeta);
    });

    try { lucide.createIcons(); } catch(e) {}
    
    // LÓGICA: EVENTOS DE BOTONES DE TARJETA (3 PUNTOS y Más Información)
    document.querySelectorAll('.tarjeta').forEach(t => {
        const menuBtn = t.querySelector('.menu-btn');
        const menu = t.querySelector('.menu-opciones');
        
        // 1. Mostrar/Ocultar Menú (al hacer clic en los 3 puntos)
        menuBtn?.addEventListener('click', e => {
            e.stopPropagation();
            // Cierra otros menús antes de abrir el actual
            document.querySelectorAll('.menu-opciones').forEach(m => { 
                if (m !== menu) m.classList.remove('show'); 
            });
            menu?.classList.toggle('show');
        });

        // 2. Listener para el botón "Más Información"
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
 * Carga los productos desde el servidor y aplica el mapeo.
 */
async function cargarProductos() {
    try {
        const res = await fetch(`${API_URL}/api/productos`, { cache: "no-store" });
        if (!res.ok) throw new Error('Error al cargar productos');
        
        const productos = await res.json();
        if (!Array.isArray(productos)) throw new Error('Formato de datos incorrecto');
        
        // APLICA EL MAPEO: Transforma los datos al formato anidado si es necesario.
        todosLosProductos = productos.map(p => mapearProductoParaMenu(p));
        
        aplicarFiltros(); // Renderiza la vista inicial con todos los productos
    } catch (err) {
        console.error('❌ Error cargando productos, usando datos simulados:', err);
        
        // SIMULACIÓN DE DATOS con la estructura anidada esperada (similar a admin.js)
        todosLosProductos = [
            { 
                nombreProducto: 'Desayuno UAM', 
                descripcion: 'Huevos, café y pan.', 
                tipo_menu: 'desayuno', 
                codigo: 'DES001',
                estado: 'Disponible', 
                imagen: null, 
                lugar: { 
                    nombre: 'Cafetería UAM', 
                    NIT: '900123456', 
                    tipo: 'Cafetería', 
                    horario_atencion: '7:00-16:00', 
                    dias: 'Lun-Vie', 
                    ubicacion: 'Bloque A', 
                    stock: 10, 
                    precio: 12000 
                } 
            },
            { 
                nombreProducto: 'Almuerzo Ejecutivo', 
                descripcion: 'Sopa, seco y jugo.', 
                tipo_menu: 'almuerzo', 
                codigo: 'ALM002',
                estado: 'Disponible', 
                imagen: null, 
                lugar: { 
                    nombre: 'Restaurante Central', 
                    NIT: '900654321', 
                    tipo: 'Restaurante', 
                    horario_atencion: '12:00-14:00', 
                    dias: 'Lun-Vie', 
                    ubicacion: 'Bloque C', 
                    stock: 50, 
                    precio: 15000 
                } 
            }
        ];
        aplicarFiltros(); 
    }
}

/**
 * Aplica los filtros (Menú y Búsqueda) y llama al renderizado.
 * ✅ CORRECCIÓN: Se ajusta la lógica de 'includes' para manejar plurales/singulares.
 */
function aplicarFiltros() {
    const filtroActivoBtn = document.querySelector('.filtro-btn.activo');
    const filtroMenu = filtroActivoBtn ? filtroActivoBtn.textContent.trim() : 'Todos';
    const textoBusqueda = inputBuscador.value.trim().toLowerCase();
    
    let productosFiltrados = todosLosProductos;
    
    // Filtrado por tipo de menú
    if (filtroMenu.toLowerCase() !== 'todos' && filtroMenu.toLowerCase() !== 'menú') {
        
        const tipoDeseado = filtroMenu.toLowerCase(); 
        
        productosFiltrados = productosFiltrados.filter(producto => {
            
            const tipoProducto = (producto.tipo_menu || '').toLowerCase();
            
            // Lógica corregida: Si el texto del producto ('desayuno') está incluido en el botón ('desayunos'), o viceversa.
            return tipoProducto.includes(tipoDeseado) || tipoDeseado.includes(tipoProducto);
        });
    }
    
    // Filtrado por búsqueda de texto
    if (textoBusqueda) {
        productosFiltrados = productosFiltrados.filter(p => 
            (p.nombreProducto || '').toLowerCase().includes(textoBusqueda) || 
            (p.descripcion || '').toLowerCase().includes(textoBusqueda) ||
            (p.lugar?.nombre || '').toLowerCase().includes(textoBusqueda) 
        );
    }
    
    // Renderiza los productos que cumplen ambos filtros
    renderizarProductos(productosFiltrados, filtroActivoBtn?.textContent.trim() || 'resultados');
}

// --- EVENT LISTENERS ---

// Filtros de menú
botonesFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        aplicarFiltros();
    });
});

// Buscador
inputBuscador?.addEventListener('keyup', aplicarFiltros);


<<<<<<< HEAD



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
=======
// Carga inicial al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    console.info('[menu.js] DOM listo');
    cargarProductos();
    
    // Lógica para cerrar la sesión (si existe un botón de cerrar)
    btnCerrar?.addEventListener('click', () => {
        alert('Simulación: Cerrando sesión...');
        // Aquí iría el código real para cerrar la sesión (ej: limpiar tokens, redirigir)
    });
});
>>>>>>> 05d428526d1af14fa072a151f51880e2416af733
