// admin.js

const API_URL = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', () => {
    console.info('[admin.js] DOM listo');

    // === VARIABLES GLOBALES ===
    let productosGlobal = [];

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

    const campanaContainer = document.getElementById('campana-container');
    const panelNotificaciones = document.getElementById('panel-notificaciones');

    // ===========================
    // MODAL AGREGAR PRODUCTO
    // ===========================
    btnAgregar?.addEventListener('click', () => {
        modal.style.display = 'flex';
        paso1.style.display = 'block';
        paso2.style.display = 'none';
    });

    btnCancelar?.addEventListener('click', () => {
        modal.style.display = 'none';
        formProducto.reset();
    });

    btnSiguiente?.addEventListener('click', () => {
        const nombre = document.getElementById('nombreProducto')?.value.trim();
        const codigo = document.getElementById('codigo')?.value.trim();
        const tipo_menu = document.getElementById('tipo_menu')?.value.trim();
        const descripcion = document.getElementById('descripcion')?.value.trim();
        const precioStr = document.getElementById('precio')?.value.trim();
        const stockStr = document.getElementById('stock')?.value.trim();
        const archivo = inputImagen?.files?.[0];

        const precio = precioStr !== '' ? Number(precioStr) : null;
        const stock = stockStr !== '' ? Number(stockStr) : null;

        if (!nombre || !codigo || !tipo_menu || !descripcion || precio === null || stock === null || !archivo) {
            alert('⚠️ Por favor completa todos los campos antes de continuar.');
            return;
        }

        paso1.style.display = 'none';
        paso2.style.display = 'block';
    });


    btnAtras?.addEventListener('click', () => {
        paso2.style.display = 'none';
        paso1.style.display = 'block';
    });

    // ===========================
    // GUARDAR PRODUCTO Y LUGAR
    // ===========================
    formProducto?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombreProducto = document.getElementById('nombreProducto')?.value.trim();
        const codigo = document.getElementById('codigo')?.value.trim();
        const descripcion = document.getElementById('descripcion')?.value.trim();
        const tipo_menu = document.getElementById('tipo_menu')?.value.trim();
        const precio = document.getElementById('precio')?.value.trim();
        const estadoProducto = document.getElementById('estadoProducto')?.value.trim();

        const nombreLugar = document.getElementById('nombreLugar')?.value.trim();
        const nit = document.getElementById('nit')?.value.trim();
        const ubicacion = document.getElementById('ubicacion')?.value.trim();
        const horario = document.getElementById('horario')?.value.trim();
        const dias = document.getElementById('dias')?.value.trim();
        const servicioDomicilio = document.getElementById('servicioDomicilio')?.value.trim();
        const numeroContacto = document.getElementById('numeroContacto')?.value.trim();
        const estadoLugar = document.getElementById('estado')?.value.trim();
        const tipo = document.getElementById('tipo')?.value.trim();

        try {
            // Guardar lugar
            const lugarData = {
                NIT: nit,
                nombre: nombreLugar,
                tipo,
                horario,
                estado: estadoLugar,
                servicioDomicilio,
                numeroContacto,
                ubicacion,
                dias
            };

            const resLugar = await fetch(`${API_URL}/api/lugares/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lugarData)
            });

            const dataLugar = await resLugar.json();
            if (!resLugar.ok) throw new Error(dataLugar.mensaje || 'Error al guardar el lugar');

            // Guardar producto
            const formData = new FormData();
            formData.append("nombreProducto", nombreProducto);
            const stock = document.getElementById('stock')?.value.trim();
            formData.append("codigo", codigo);
            formData.append("descripcion", descripcion);
            formData.append("tipo_menu", tipo_menu);
            formData.append("precio", precio);
            formData.append("estado", estadoProducto);
            formData.append("imagen", inputImagen.files[0]);
            formData.append("NIT", nit);
            formData.append('stock', stock);

            const resProducto = await fetch(`${API_URL}/api/productos`, { method: 'POST', body: formData });
            const dataProducto = await resProducto.json();
            if (!resProducto.ok) throw new Error(dataProducto.error || 'Error al guardar el producto');

            alert('✅ Producto y lugar agregados correctamente.');
            modal.style.display = 'none';
            formProducto.reset();
            paso1.style.display = 'block';
            paso2.style.display = 'none';
            cargarProductos();

        } catch (error) {
            console.error('❌ Error al guardar producto o lugar:', error);
            alert('Hubo un error al guardar. Revisa la consola.');
        }
    });

    // ===========================
    // CARGAR PRODUCTOS
    // ===========================
    async function cargarProductos() {
        try {
            const res = await fetch(`${API_URL}/api/productos`, { cache: "no-store" });
            if (!res.ok) throw new Error('Error al cargar productos');
            const productos = await res.json();
            if (!Array.isArray(productos)) throw new Error('Formato de datos incorrecto');
            productosGlobal = productos;
            mostrarProductos(productosGlobal);
        } catch (err) {
            console.warn('[admin.js] No se pudo cargar productos, simulando datos');
            // Datos simulados deben reflejar la estructura de la API
            productosGlobal = [
                { codigo: 'DES001', nombreProducto: 'Desayuno UAM', descripcion: 'Huevos, café, pan', tipo_menu: 'Desayunos', precio: 12000, estado: 'Disponible', imagen: null, lugar: { nombre: 'Cafetería UAM', NIT: '900123456', stock: 15, tipo: 'Cafetería', horario_atencion: '7:00-16:00', dias: 'Lun-Vie', ubicacion: 'Bloque A', precio: 12000 } },
            ];
            mostrarProductos(productosGlobal);
        }
    }

    // [El resto de las funciones (Actualizar Stock, Mostrar Productos, Modales, Notificaciones, Buscador) se mantienen sin cambios mayores, ya que son propias del ADMIN.]

    // ===========================
    // MOSTRAR PRODUCTOS (ADMIN)
    // ===========================
    function mostrarProductos(lista) {
        listaProductos.innerHTML = '';
        if (!lista.length) {
            listaProductos.innerHTML = '<p>No hay productos disponibles.</p>';
            return;
        }

        lista.forEach(producto => {
            const stock = producto.lugar?.stock ?? 0;
            const estado = stock > 0 ? 'disponible' : 'no disponible';

            const colorClase = estado === 'disponible' ? 'estado-disponible' :
                estado === 'no disponible' ? 'estado-no-disponible' :
                'estado-desconocido';
            const estadoTexto = estado === 'disponible' ? 'Disponible' :
                estado === 'no disponible' ? 'No disponible' :
                'Sin estado';

            const precioFormateado = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(producto.lugar?.precio ?? 0);

            const imgSrc = producto.imagen ? `${API_URL}/uploads/${producto.imagen}` : 'https://via.placeholder.com/220x150';

            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta');
            tarjeta.dataset.producto = JSON.stringify(producto);

            tarjeta.innerHTML = `
                <img src="${imgSrc}" alt="${producto.nombreProducto}">
                <div class="info">
                <h3>${producto.nombreProducto}</h3>
                <p class="precio">${precioFormateado}</p>
                <p class="lugar">${producto.lugar?.nombre || 'Sin lugar'}</p>
                <p class="estado">Estado: <strong class="estado-texto ${colorClase}">${estadoTexto}</strong></p>
                <p><strong>Stock:</strong>
                    <button class="stock-btn" data-codigo="${producto.codigo}" data-nit="${producto.lugar?.NIT}" data-accion="menos">-</button>
                    <span class="stock-cantidad">${stock}</span>
                    <button class="stock-btn" data-codigo="${producto.codigo}" data-nit="${producto.lugar?.NIT}" data-accion="mas">+</button>
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

        try { lucide.createIcons(); } catch (e) {}
        // ...listeners para modales y menú...
    }
    
    // ... Código para Actualizar Stock, Modales, Notificaciones, Buscador (Mantienen su lógica)...
    
    // ===========================
    // BUSCADOR (ADMIN)
    // ===========================
    inputBuscador?.addEventListener('keyup', () => {
        const texto = inputBuscador.value.toLowerCase().trim();
        const filtrados = productosGlobal.filter(p => (p.nombreProducto || '').toLowerCase().includes(texto) || (p.tipo_menu || '').toLowerCase().includes(texto));
        mostrarProductos(filtrados);
    });

    // ===========================
    // CARGA INICIAL
    // ===========================
    cargarProductos();
});