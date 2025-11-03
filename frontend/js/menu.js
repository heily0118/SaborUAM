// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

// === SELECCIÓN DE ELEMENTOS ===
const listaProductos = document.getElementById('lista-productos');
const botonesFiltro = document.querySelectorAll('.filtro-btn');
const btnCerrar = document.querySelector('.btn-cerrar'); // Corregido el selector (es una clase)
const inputBuscador = document.querySelector('.buscador input[type="text"]');
// No necesitamos seleccionar el botón de búsqueda si usamos el evento 'keyup' en el input

// Almacenará la lista completa de la API, cargada solo una vez
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
}

/**
 * Aplica los filtros (Menú y Búsqueda) y llama al renderizado.
 */
function aplicarFiltros() {
    // 1. Obtener filtros activos
    const filtroActivoBtn = document.querySelector('.filtro-btn.activo');
    const filtroMenu = filtroActivoBtn ? filtroActivoBtn.textContent : 'Todos';
    const textoBusqueda = inputBuscador.value.trim().toLowerCase();
    
    // 2. Filtrar por menú (categoría)
    let productosFiltrados = todosLosProductos;
    if (filtroMenu !== 'Todos') {
        productosFiltrados = productosFiltrados.filter(
            producto => producto.tipo_menu === filtroMenu
        );
    }
    
    // 3. Filtrar por búsqueda de texto
    if (textoBusqueda) {
        productosFiltrados = productosFiltrados.filter(producto => {
            const nombre = producto.nombreProducto ? producto.nombreProducto.toLowerCase() : '';
            const descripcion = producto.descripcion ? producto.descripcion.toLowerCase() : '';
            
            // Buscar coincidencia en nombre o descripción
            return nombre.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
        });
    }

    // 4. Determinar qué texto mostrar en caso de no haber resultados
    const filtroMostrado = textoBusqueda ? `"${textoBusqueda}"` : filtroMenu;

    // 5. Renderizar los resultados
    renderizarProductos(productosFiltrados, filtroMostrado);
}


// === FUNCIÓN PRINCIPAL: CARGAR PRODUCTOS INICIALMENTE ===
async function cargarDatosIniciales() {
    try {
        listaProductos.innerHTML = '<p class="cargando">Cargando productos...</p>';
        
        // Carga los datos solo la primera vez desde la API
        const res = await fetch(`${API_URL}/api/productos`);
        todosLosProductos = await res.json();
        
        // Llama a aplicarFiltros para mostrar los datos iniciales ('Todos')
        aplicarFiltros(); 
        
    } catch (error) {
        console.error('❌ Error al cargar productos iniciales:', error);
        listaProductos.innerHTML = "<p>Hubo un problema al cargar los productos. Por favor, verifica tu conexión.</p>";
    }
}


// --- EVENT LISTENERS ---

// 1. EVENTOS DE FILTRO DE MENÚ (Barra lateral)
botonesFiltro.forEach(btn => {
    btn.addEventListener('click', e => {
        // Desactivar todos y activar el clicado
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        e.target.classList.add('activo');
        
        // Volver a aplicar filtros (esto incluye la búsqueda actual)
        aplicarFiltros(); 
    });
});

// 2. EVENTO DE BÚSQUEDA (Al escribir en el input)
inputBuscador.addEventListener('keyup', aplicarFiltros);
inputBuscador.addEventListener('change', aplicarFiltros); // Por si pega el texto

// 3. CERRAR SESIÓN
if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
        localStorage.removeItem('usuario_num');
        window.location.href = 'usuario.html';
    });
}

// 4. CARGAR PRODUCTOS AL INICIO
window.addEventListener('DOMContentLoaded', cargarDatosIniciales);