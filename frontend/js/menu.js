// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

// === SELECCIÓN DE ELEMENTOS ===
const listaProductos = document.getElementById('lista-productos');
const botonesFiltro = document.querySelectorAll('.filtro-btn');
<<<<<<< HEAD
const btnCerrar = document.querySelector('.btn-cerrar'); // Corregido el selector (es una clase)
const inputBuscador = document.querySelector('.buscador input[type="text"]');
// No necesitamos seleccionar el botón de búsqueda si usamos el evento 'keyup' en el input
=======
const btnCerrar = document.getElementById('btn-cerrar');
const inputBuscador = document.querySelector('.buscador input[type="text"]');
const btnNotificaciones = document.getElementById('btn-notificaciones');
const listaNotificaciones = document.getElementById('lista-notificaciones');
const contadorNotificaciones = document.getElementById('contador-notificaciones');
>>>>>>> 40c6d38413096433a274940800496808027d8704

// Almacenará la lista completa de la API, cargada solo una vez
let todosLosProductos = []; 

// --- FUNCIONES DE MODAL Y DETALLE ---

/**
 * Crea la estructura básica del modal para la vista del cliente.
 */
<<<<<<< HEAD
function renderizarProductos(productos, filtroAplicado = 'Menú') {
    listaProductos.innerHTML = ""; // Limpiar antes de pintar

    if (productos.length === 0) {
        // Mostrar mensaje si no hay resultados
        listaProductos.innerHTML = `<p class="sin-resultados">No se encontraron resultados para: <strong>${filtroAplicado}</strong>.</p>`;
        return;
    }

    // MOSTRAR TARJETAS
    productos.forEach(producto => {
        const nombreLugar = producto.NOMBRE_LUGAR || 'Lugar Desconocido';
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');
        tarjeta.innerHTML = `
            <img src="${API_URL}/uploads/${producto.imagen}" alt="${producto.nombreProducto}">
            <div class="info">
                <h3>${producto.nombreProducto}</h3>
                <p class="precio">$${producto.precio}</p>
                <p class="lugar">${nombreLugar}</p>
            </div>
            <div class="acciones-tarjeta">
                <i data-lucide="more-vertical"></i>
            </div>
        `;

        // Registrar consulta al hacer clic (Mantenido tu lógica original)
        tarjeta.addEventListener('click', async () => {
            const usu_num = localStorage.getItem('usuario_num');
            if (!usu_num) {
                // No bloquear la navegación, solo el registro
                console.log("Usuario no logueado. No se registra la consulta.");
                return;
            }

            try {
                await fetch(`${API_URL}/api/consultas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        usu_num: usu_num,
                        pro_cod: producto.codigo
                    })
                });
                console.log(`✅ Consulta registrada para ${producto.nombreProducto}`);
            } catch (error) {
                console.error("❌ Error al registrar consulta:", error);
            }
        });

        listaProductos.appendChild(tarjeta);
    });

    lucide.createIcons();
=======
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
 * Utiliza los nombres de campos que vienen directamente del API (ej: NOMBRE_LUGAR, horario).
 */
function mostrarModalVerMas(producto) {
    const productoDetalles = {
        // Información del Producto
        nombreProducto: producto.nombreProducto || 'N/A',
        descripcion: producto.descripcion || 'Sin descripción',
        tipo_menu: producto.tipo_menu || 'N/A',
        precio: producto.precio ?? 'N/A',
        estado: producto.estado || 'Disponible',
        
        // Información del Lugar (Usando los nombres exactos del API)
        lugar: {
            NIT: producto.NIT || 'N/A',
            nombre: producto.NOMBRE_LUGAR || 'Lugar Desconocido', // <--- CORREGIDO (usa NOMBRE_LUGAR)
            tipo: producto.tipo || 'N/A',
            horario_atencion: producto.horario || 'N/A', // <--- CORREGIDO (usa horario)
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
>>>>>>> 40c6d38413096433a274940800496808027d8704
}

// --- FUNCIONES DE RENDERIZADO Y LÓGICA ---

/**
 * Función para pintar las tarjetas de productos en el HTML (Estilo minimalista con menú interno).
 */
function renderizarProductos(productos, filtroAplicado = 'Menú') {
    listaProductos.innerHTML = ""; 

    if (productos.length === 0) {
        listaProductos.innerHTML = `<p class="sin-resultados">No se encontraron resultados para: <strong>${filtroAplicado}</strong>.</p>`;
        return;
    }

    productos.forEach(producto => {
        // CORREGIDO: Usar NOMBRE_LUGAR que viene del API
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

        tarjeta.innerHTML = `
            <img src="${imgSrc}" alt="${producto.nombreProducto}" onerror="this.onerror=null;this.src='https://via.placeholder.com/220x150'">
            
            <div class="info">
                <!-- Seccion que contiene el nombre y el botón de acción a la derecha -->
                <div class="nombre-y-accion">
                    <h3>${producto.nombreProducto}</h3>
                    <!-- Botón de los 3 puntos con su menú desplegable -->
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
        
        // Nota: Se elimina el listener de 'click' de la tarjeta para evitar conflictos con los botones internos.
        // Si necesitas un registro, debe estar aquí o en el botón específico.
        
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
 * Aplica los filtros (Menú y Búsqueda) y llama al renderizado.
 */
function aplicarFiltros() {
    const filtroActivoBtn = document.querySelector('.filtro-btn.activo');
<<<<<<< HEAD
    const filtroMenu = filtroActivoBtn ? filtroActivoBtn.textContent : 'Todos';
=======
    const filtroMenu = filtroActivoBtn ? filtroActivoBtn.textContent.trim() : 'Todos';
>>>>>>> 40c6d38413096433a274940800496808027d8704
    const textoBusqueda = inputBuscador.value.trim().toLowerCase();
    
    let productosFiltrados = todosLosProductos;
<<<<<<< HEAD
    if (filtroMenu !== 'Todos') {
        productosFiltrados = productosFiltrados.filter(
            producto => producto.tipo_menu === filtroMenu
        );
=======
    
    if (filtroMenu.toLowerCase() !== 'todos') {
        const tipoDeseado = filtroMenu.toLowerCase();
        
        productosFiltrados = productosFiltrados.filter(producto => {
            const tipoProducto = (producto.tipo_menu || '').toLowerCase();
            
            if (tipoDeseado === 'desayunos' && tipoProducto.includes('desayuno')) return true;
            if (tipoDeseado === 'almuerzos' && tipoProducto.includes('almuerzo')) return true;
            if (tipoDeseado === 'bebidas' && tipoProducto.includes('bebida')) return true;
            
            // Asume que si no es ninguno de los anteriores, y no coincide exactamente, puede ir en 'Otros'
            if (tipoDeseado === 'otros' && 
                !tipoProducto.includes('desayuno') &&
                !tipoProducto.includes('almuerzo') &&
                !tipoProducto.includes('bebida')) return true;

            // Filtro por coincidencia exacta si no cayó en las categorías amplias de arriba
            return tipoProducto === tipoDeseado; 
        });
>>>>>>> 40c6d38413096433a274940800496808027d8704
    }
    
    if (textoBusqueda) {
        productosFiltrados = productosFiltrados.filter(producto => {
            const nombre = producto.nombreProducto ? producto.nombreProducto.toLowerCase() : '';
            const descripcion = producto.descripcion ? producto.descripcion.toLowerCase() : '';
            
            // Buscar coincidencia en nombre o descripción
            return nombre.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
        });
    }

<<<<<<< HEAD
    // 4. Determinar qué texto mostrar en caso de no haber resultados
=======
>>>>>>> 40c6d38413096433a274940800496808027d8704
    const filtroMostrado = textoBusqueda ? `"${textoBusqueda}"` : filtroMenu;
    renderizarProductos(productosFiltrados, filtroMostrado);
}


// === FUNCIÓN PRINCIPAL: CARGAR PRODUCTOS INICIALMENTE ===
async function cargarDatosIniciales() {
    try {
        listaProductos.innerHTML = '<p class="cargando">Cargando productos...</p>';
        
        // Carga los datos solo la primera vez desde la API
        const res = await fetch(`${API_URL}/api/productos`);
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        todosLosProductos = await res.json();
        
<<<<<<< HEAD
        // Llama a aplicarFiltros para mostrar los datos iniciales ('Todos')
=======
>>>>>>> 40c6d38413096433a274940800496808027d8704
        aplicarFiltros(); 
        
    } catch (error) {
        console.error('❌ Error al cargar productos iniciales:', error);
        listaProductos.innerHTML = "<p>Hubo un problema al cargar los productos. Por favor, verifica el estado del servidor API.</p>";
    }
}


// --- EVENT LISTENERS ---

<<<<<<< HEAD
// 1. EVENTOS DE FILTRO DE MENÚ (Barra lateral)
botonesFiltro.forEach(btn => {
    btn.addEventListener('click', e => {
        // Desactivar todos y activar el clicado
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        e.target.classList.add('activo');
        
        // Volver a aplicar filtros (esto incluye la búsqueda actual)
        aplicarFiltros(); 
=======
// 1. EVENTO DE FILTRO POR TIPO DE MENÚ
botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        boton.classList.add('activo');
        aplicarFiltros();
>>>>>>> 40c6d38413096433a274940800496808027d8704
    });
});

// 2. EVENTO DE BÚSQUEDA (Al escribir en el input)
inputBuscador.addEventListener('keyup', aplicarFiltros);
inputBuscador.addEventListener('change', aplicarFiltros); // Por si pega el texto

// 3. CERRAR SESIÓN (Mantiene la funcionalidad de autenticación local)
if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
        localStorage.removeItem('usuario_num');
        window.location.href = 'usuario.html';
    });
}

// 4. CARGAR PRODUCTOS AL INICIO
<<<<<<< HEAD
window.addEventListener('DOMContentLoaded', cargarDatosIniciales)
=======
window.addEventListener('DOMContentLoaded', cargarDatosIniciales);

// ===============================================
// === FUNCIONALIDAD DE NOTIFICACIONES ===
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
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

    function cargarPromocionesQuemadas() {
        if (!listaNotificaciones) return;

        listaNotificaciones.innerHTML = `<h3>Notificaciones</h3>`; 

        promocionesFijas.forEach(promo => {
            const item = document.createElement('div');
            item.className = 'notificacion-item';
            item.innerHTML = `
                <span class="punto-notificacion"></span> 
                <strong>${promo.titulo}</strong>
                <p>${promo.descripcion}</p>
                <small>${promo.detalle}</small>
            `;
            listaNotificaciones.appendChild(item);
        });
        
        if (contadorNotificaciones) {
            contadorNotificaciones.textContent = promocionesFijas.length; 
            contadorNotificaciones.style.display = 'block';
        }
    }
    
    if (btnNotificaciones && listaNotificaciones) {
        cargarPromocionesQuemadas();

        btnNotificaciones.addEventListener('click', (e) => {
            e.stopPropagation(); 
            listaNotificaciones.classList.toggle('activo');

            if (listaNotificaciones.classList.contains('activo')) {
                   if (contadorNotificaciones) {
                       contadorNotificaciones.style.display = 'none';
                   }
            } else {
                   if (contadorNotificaciones && parseInt(contadorNotificaciones.textContent) > 0) {
                        contadorNotificaciones.style.display = 'block';
                   }
            }
        });

        window.addEventListener('click', (e) => {
            if (listaNotificaciones.classList.contains('activo') && 
                !listaNotificaciones.contains(e.target) && 
                !btnNotificaciones.contains(e.target)) {
                
                listaNotificaciones.classList.remove('activo');
            }
        });
    }
});
>>>>>>> 40c6d38413096433a274940800496808027d8704
