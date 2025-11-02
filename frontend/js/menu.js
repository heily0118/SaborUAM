// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

// === SELECCIÓN DE ELEMENTOS ===
const listaProductos = document.getElementById('lista-productos');
const botonesFiltro = document.querySelectorAll('.filtro-btn'); // Selecciona todos los botones de la barra lateral

// 1. === FUNCIÓN PRINCIPAL PARA CARGAR Y MOSTRAR PRODUCTOS ===
// Ahora acepta un parámetro opcional 'filtro'
async function cargarProductosMenu(filtro = 'Todos') {
    try {
        listaProductos.innerHTML = '<p class="cargando">Cargando productos...</p>'; // Mostrar mensaje de carga

        // 1. Petición a la API para obtener todos los productos
        const res = await fetch(`${API_URL}/api/productos`);
        let productos = await res.json();

        // 2. Aplicar el filtro si no es 'Todos'
        if (filtro !== 'Todos') {
            // La propiedad en la base de datos es 'tipo_menu'
            productos = productos.filter(producto => producto.tipo_menu === filtro);
        }

        // 3. Limpiar el contenedor
        listaProductos.innerHTML = "";

        if (productos.length === 0) {
            listaProductos.innerHTML = `<p class="sin-resultados">No hay productos disponibles en la categoría: **${filtro}**.</p>`;
            return;
        }

        // 4. Iterar sobre los productos y crear una tarjeta para cada uno
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
            listaProductos.appendChild(tarjeta);
        });

        // 5. Recargar los íconos de Lucide
        lucide.createIcons();

    } catch (error) {
        console.error('❌ Error al cargar productos en el menú:', error);
        listaProductos.innerHTML = "<p>Hubo un problema de conexión. Intenta más tarde.</p>";
    }
}

// 2. === EVENT LISTENERS PARA LOS BOTONES DE FILTRO ===
botonesFiltro.forEach(btn => {
    btn.addEventListener('click', (event) => {
        // a. Obtener el texto del botón, que es nuestro filtro (Ej: "Desayunos")
        const filtro = event.target.textContent; 

        // b. Remover la clase 'activo' de todos los botones
        botonesFiltro.forEach(b => b.classList.remove('activo'));

        // c. Agregar la clase 'activo' al botón clickeado
        event.target.classList.add('activo');

        // d. Llamar a la función principal con el filtro
        cargarProductosMenu(filtro);
    });
});

// 3. === CARGAR PRODUCTOS AL INICIO DE LA PÁGINA MENÚ ===
window.addEventListener('DOMContentLoaded', () => {
    // La primera vez, carga 'Todos'
    cargarProductosMenu('Todos');
});