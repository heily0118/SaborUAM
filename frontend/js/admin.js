// admin.js

// Es la dirección del servidor donde se conectan las peticiones.
const API_URL = "http://localhost:3000";

// Se encarga de que todo el HTML se haya cargado antes de ejecutar el código.
document.addEventListener('DOMContentLoaded', () => {
    console.info('[admin.js] DOM listo');

    // Variables globales
    let productosGlobal = [];

    // Se crean variables para acceder a los elementos que están en el HTML.
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

    // Modal agregar producto
    // Cuando se hace click en el botón "+" se abre el modal para agregar el nuevo producto.
    btnAgregar?.addEventListener('click', () => {
        modal.style.display = 'flex'; // Sirve para mostrar el modal.
        paso1.style.display = 'block'; // Sirve para mostrar el primer paso (Datos del producto).
        paso2.style.display = 'none'; // Sirve para ocultar el segundo paso (Datos del lugar).
    });

    // Cuando se hace click en el botón "Cancelar" se cierra el modal y limpia los campos.
    btnCancelar?.addEventListener('click', () => {
        modal.style.display = 'none';
        formProducto.reset();
    });

     // Al presionar el botón "Siguiente", se validan los datos del primer paso.
    btnSiguiente?.addEventListener('click', () => {
        const nombre = document.getElementById('nombreProducto')?.value.trim();
        const codigo = document.getElementById('codigo')?.value.trim();
        const tipo_menu = document.getElementById('tipo_menu')?.value.trim();
        const descripcion = document.getElementById('descripcion')?.value.trim();
        const precioStr = document.getElementById('precio')?.value.trim();
        const stockStr = document.getElementById('stock')?.value.trim();
        const archivo = inputImagen?.files?.[0];

        // Convierte los valores a números.
        const precio = precioStr !== '' ? Number(precioStr) : null;
        const stock = stockStr !== '' ? Number(stockStr) : null;

        // Si falta algún campo por llenar, se muestra el mensaje.
        if (!nombre || !codigo || !tipo_menu || !descripcion || precio === null || stock === null || !archivo) {
            alert('⚠️ Por favor completa todos los campos antes de continuar.');
            return;
        }

        // Si todo sale bien, se muestra el segundo paso (Datos del lugar).
        paso1.style.display = 'none';
        paso2.style.display = 'block';
    });


    // Si se apreta el botón "Atrás" se devuelve al primero paso (Datos del producto).
    btnAtras?.addEventListener('click', () => {
        paso2.style.display = 'none';
        paso1.style.display = 'block';
    });

    // Guardar producto y lugar
    // Cuando el formulario se envía, se guarda la información en la base de datos.
    formProducto?.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Se obtienen todos los valores de los campos del formulario.
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
        const dias = document.getElementById('dias')?.value.trim(); // <-- capturar días
        const servicioDomicilio = document.getElementById('servicioDomicilio')?.value.trim();
        const numeroContacto = document.getElementById('numeroContacto')?.value.trim();
        const estadoLugar = document.getElementById('estado')?.value.trim();
        const tipo = document.getElementById('tipo')?.value.trim();

        try {
            // Se guardar la información del lugar.
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

            // Se le hace una petición al backend para agregar el nuevo lugar y "fetch" se utiliza para enviar y recibir datos del servidor. 
            const resLugar = await fetch(`${API_URL}/api/lugares/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lugarData)
            });

            // Sirve para recibir la respuesta del servidor.
            const dataLugar = await resLugar.json();

            // Si el servidor responde tiene un error, se lanzará el mensaje de advertencia.
            if (!resLugar.ok) throw new Error(dataLugar.mensaje || 'Error al guardar el lugar');

            // Se crea un objeto FormData para enviar los datos del producto.
            const formData = new FormData();

            // Se agrega el nombre del producto al objeto FormData.
            formData.append("nombreProducto", nombreProducto);

            // Se obtiene el valor del "Stock" del formulario y se eliminan espacios en blanco.
            const stock = document.getElementById('stock')?.value.trim();

            // Se agregan los datos del producto al FormData.
            formData.append("codigo", codigo);
            formData.append("descripcion", descripcion);
            formData.append("tipo_menu", tipo_menu);
            formData.append("precio", precio);
            formData.append("estado", estadoProducto);
            formData.append("imagen", inputImagen.files[0]);
            formData.append("NIT", nit);
            formData.append('stock', stock);

            // Se envia el producto al servidor usando fetch con método POST, luego el FormData se pasa en el cuerpo de la solicitud para incluir texto e imágenes.
            const resProducto = await fetch(`${API_URL}/api/productos`, { method: 'POST', body: formData });
            
            // Se convierte la respuesta del servidor a formato JSON para poder leerla.
            const dataProducto = await resProducto.json();
            
            // Se verifica si la respuesta no fue exitosa y se lanza un error con el mensaje recibido.
            if (!resProducto.ok) throw new Error(dataProducto.error || 'Error al guardar el producto');

            // Si todo sale bien, se actualiza la vista
            alert('✅ Producto y lugar agregados correctamente.');
            modal.style.display = 'none';
            formProducto.reset();
            paso1.style.display = 'block';
            paso2.style.display = 'none';
            cargarProductos();

        // Si algo sale mal, me lanza el error al guardar el producto o lugar.
        } catch (error) {
            console.error('❌ Error al guardar producto o lugar:', error);
            alert('Hubo un error al guardar. Revisa la consola.');
        }
    });

    // Cargar productos
    // Se carga los productos desde el servidor o muestra datos ingresados.
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
            productosGlobal = [
                { nombreProducto: 'Desayuno', descripcion: 'Huevos, café', tipo_menu: 'desayuno', precio: 12000, estado: 'Disponible', imagen: null, lugar: { nombre: 'Cafetería UAM', NIT: '900123456', tipo: 'Cafetería', horario_atencion: '7:00-16:00', dias: 'Lun-Vie', ubicacion: 'Bloque A', stock: 10, precio: 12000 } },
            ];
            mostrarProductos(productosGlobal);
        }
    }

    // Actualizar stock
    // Permite modificar el stock de los productos.
    document.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('stock-btn')) return;

        const btn = e.target;
        const codigo = btn.dataset.codigo;
        const nit = btn.dataset.nit;
        const accion = btn.dataset.accion;

        const tarjeta = btn.closest('.tarjeta');
        const spanCantidad = tarjeta.querySelector('.stock-cantidad');
        let stockActual = parseInt(spanCantidad.textContent);

        // Actualizar valor en frontend inmediatamente (stock).
        stockActual = accion === 'mas' ? stockActual + 1 : Math.max(0, stockActual - 1);
        spanCantidad.textContent = stockActual;

        // Actualizar el estado dinámicamente.
        const estado = stockActual > 0 ? 'disponible' : 'no disponible';
        const estadoTexto = estado === 'disponible' ? 'Disponible' : 'No disponible';
        const colorClase = estado === 'disponible' ? 'estado-disponible' : 'estado-no-disponible';

        // Actualizar el estado en la tarjeta.
        const estadoElemento = tarjeta.querySelector('.estado-texto');
        estadoElemento.textContent = estadoTexto;
        estadoElemento.classList.remove('estado-disponible', 'estado-no-disponible');
        estadoElemento.classList.add(colorClase);

        // Actualizar en backend.
        try {
            const res = await fetch(`${API_URL}/api/productos/stock`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo, nit, stock: stockActual })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al actualizar stock');
            console.log(`Stock de ${codigo} actualizado a ${stockActual}`);
        } catch (err) {
            console.error(err);
            alert('❌ No se pudo actualizar el stock en el servidor.');
        }
    });


    // Mostrar productos

    /**
     * Muestra dinámicamente las tarjetas de los productos en la interfaz.
     * @param {*} lista Es un arreglo que contiene los productos desde la base de datos.
     * @returns No retorna nungún valor, modifica el DOM actual.
     */
    function mostrarProductos(lista) {
        listaProductos.innerHTML = '';
        if (!lista.length) {
            listaProductos.innerHTML = '<p>No hay productos disponibles.</p>';
            return;
        }

        lista.forEach(producto => {
            // Ayuda a determinar el estado según el stock.
            const stock = producto.lugar?.stock ?? 0;
            const estado = stock > 0 ? 'disponible' : 'no disponible';

            const colorClase = estado === 'disponible' ? 'estado-disponible' :
                estado === 'no disponible' ? 'estado-no-disponible' :
                'estado-desconocido';
            const estadoTexto = estado === 'disponible' ? 'Disponible' :
                estado === 'no disponible' ? 'No disponible' :
                'Sin estado';

            // Ayuda a formatear el precio en pesos colombianos.
            const precioFormateado = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(producto.lugar?.precio ?? 0);

            const imgSrc = producto.imagen ? `${API_URL}/uploads/${producto.imagen}` : 'https://via.placeholder.com/220x150';

            // Crear una tarjeta HTML para cada producto.
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

        // Inicializa los iconos.
        try { lucide.createIcons(); } catch (e) {}

        // Asignar listeners o eventos a los botones del menú de cada tarjeta.
        document.querySelectorAll('.tarjeta').forEach(t => {
            const menuBtn = t.querySelector('.menu-btn');
            const menu = t.querySelector('.menu-opciones');
            const prod = t.dataset.producto ? JSON.parse(t.dataset.producto) : null;

            menuBtn?.addEventListener('click', e => {
                e.stopPropagation();
                document.querySelectorAll('.menu-opciones').forEach(m => { if (m !== menu) m.classList.remove('show'); });
                menu?.classList.toggle('show');
            });

            t.querySelector('.ver-btn')?.addEventListener('click', e => { e.stopPropagation(); mostrarModalVerMas(prod); menu?.classList.remove('show'); });
            t.querySelector('.editar-btn')?.addEventListener('click', e => { e.stopPropagation(); mostrarModalActualizar(prod); menu?.classList.remove('show'); });
            t.querySelector('.eliminar-btn')?.addEventListener('click', e => { e.stopPropagation(); mostrarModalEliminar(prod); menu?.classList.remove('show'); });
        });

        // Ayuda a cerrar los menús al hacer click fuera de ellos.
        document.addEventListener('click', () => document.querySelectorAll('.menu-opciones').forEach(m => m.classList.remove('show')));
    }

    // Modales de ver, editar y eliminar.

    // Ayuda a crear dinámicamente una ventana modal en el Dom.
    /**
     * Crea y muestra dinámicamente una ventana modal en el DOM.
     * @param {*} titulo Es el título en el modal o página.
     * @param {*} contenidoHTML Es el contenido HTML que se pondrá dentro del cuerpo del modal o página.
     * @param {*} hasClose Indica si el modal incluirá un botón de cierre.
     * @returns Retorna el elemento <div> al modal o página creada.
     */
    function crearModal(titulo, contenidoHTML, hasClose = true) {
        const m = document.createElement('div');
        m.classList.add('modal', 'activo');
        m.innerHTML = `<div class="modal-contenido"><h2>${titulo}</h2><div class="contenido-modal">${contenidoHTML}</div>${hasClose?`<div class="acciones"><button class="btn-cerrar-modal">Cerrar</button></div>`:''}</div>`;
        document.body.appendChild(m);
        hasClose && m.querySelector('.btn-cerrar-modal')?.addEventListener('click', () => m.remove());
        return m;
    }

    /**
     * Muestra un modal con la información completa de un producto.
     * @param {*} producto Es el objeto que contiene toda la información del producto.
     */
    // Muestra la información completa de un producto.
    function mostrarModalVerMas(producto) {
        // Actualizar el stock y estado dinámicamente.
        const stock = producto.lugar?.stock ?? 0;
        const estado = stock > 0 ? 'Disponible' : 'No disponible';

        // Contenido HTML del modal con toda la información.
        const contenido = `
            <h3>🛒 Información del producto</h3>
            <p><strong>Nombre:</strong> ${producto.nombreProducto || ''}</p>
            <p><strong>Descripción:</strong> ${producto.descripcion || ''}</p>
            <p><strong>Tipo:</strong> ${producto.tipo_menu || ''}</p>
            <p><strong>Precio:</strong> ${producto.lugar?.precio ?? ''}</p>
            <p><strong>Estado:</strong> ${estado}</p>

            <hr style="margin:10px 0;">

            <h3> Información del lugar</h3>
            <p><strong>NIT:</strong> ${producto.lugar?.NIT || ''}</p>
            <p><strong>Nombre:</strong> ${producto.lugar?.nombre || ''}</p>
            <p><strong>Tipo:</strong> ${producto.lugar?.tipo || ''}</p>
            <p><strong>Horario:</strong> ${producto.lugar?.horario_atencion || ''}</p>
            <p><strong>Días:</strong> ${producto.lugar?.dias || ''}</p>
            <p><strong>Ubicación:</strong> ${producto.lugar?.ubicacion || ''}</p>
        `;

        // Llama a la función que genera el modal.
        crearModal('Detalles del producto', contenido);
    }


    /**
     * Crea un modal de edición para la actualización de un producto.
     * @param {*} producto Es el objeto del producto a editar.
     */
    function mostrarModalActualizar(producto) {
        const contenido = `
            <h3>🛒 Editar producto</h3>
            <label>Nombre</label><input type="text" value="${producto.nombreProducto || ''}">
            <label>Precio</label><input type="number" value="${producto.lugar?.precio || ''}">
            <label>Tipo</label><input type="text" value="${producto.tipo_menu || ''}">

            <hr style="margin:10px 0;">

            <h3>🏪 Información del lugar</h3>
            <label>NIT</label><input type="text" value="${producto.lugar?.NIT || ''}">
            <label>Nombre</label><input type="text" value="${producto.lugar?.nombre || ''}">
            <label>Horario</label><input type="text" value="${producto.lugar?.horario_atencion || ''}">
            <label>Ubicación</label><input type="text" value="${producto.lugar?.ubicacion || ''}">

            <div class="acciones" style="margin-top:12px;">
                <button class="btn-simular-actualizar" style="background:#005c99;color:white;">Actualizar</button>
                <button class="btn-cancelar-actualizar" style="background:#d4af37;color:#333;margin-left:8px;">Cancelar</button>
            </div>
        `;

        // Se crea el modal con el contenido del producto y el lugar.
        const modal = crearModal('Editar producto ', contenido, false);

        // Cierra el modal de cancelar.
        modal.querySelector('.btn-cancelar-actualizar').addEventListener('click', () => modal.remove());

        // Actualiza el contenido al hacer click en "Actualizar".
        modal.querySelector('.btn-simular-actualizar').addEventListener('click', () => {
            alert('Simulación: cambios aplicados (no se guardan realmente).');
            modal.remove();
        });
    }



    /**
     *  Muestra un modal de confirmación para eliminar un producto.
     * @param {*} producto Es el objeto del producto a eliminar.
     */
    function mostrarModalEliminar(producto) {
        const contenido = `
            <p>¿Deseas eliminar el producto <strong>${producto.nombreProducto || ''}</strong>?</p>
            <div class="acciones" style="margin-top:12px;">
                <button class="btn-confirmar-eliminar" style="background:#c0392b;color:white;">Sí</button>
                <button class="btn-cancelar-eliminar" style="background:#d4af37;color:#333;margin-left:8px;">No</button>
            </div>
        `;
        const modal = crearModal('Confirmar eliminación', contenido, false);

        // Cierra o simula la eliminación.
        modal.querySelector('.btn-cancelar-eliminar').addEventListener('click', () => modal.remove());
        modal.querySelector('.btn-confirmar-eliminar').addEventListener('click', () => {
            alert('Simulación: el producto se eliminaría (no se elimina realmente).');
            modal.remove();
        });
    }
    
    // Notificaciones

    /**
     * Genera el contenido del HTML de las notificaciones.
     * @returns Retorna el HTML de la lista de notificaciones.
     */
    function generarContenidoNotificaciones() {
        const notificacionesSimuladas = [
            { tipo: 'pedido', mensaje: 'No quedan más Hamburguesas en el stock' },
            { tipo: 'producto', mensaje: 'El producto vence el 10/11/2025' }
        ];
        let html = '<h3>🎉 Notificaciones</h3>';
        if (!notificacionesSimuladas.length) html += '<ul><li>No hay notificaciones nuevas.</li></ul>';
        else {
            html += '<ul>';
            notificacionesSimuladas.forEach(n => html += `<li>${n.mensaje}</li>`);
            html += '</ul>';
        }
        return html;
    }

    /**
     * Abre el panel de notificaciones.
     */
    function abrirPanelNotificaciones() {
        panelNotificaciones.innerHTML = generarContenidoNotificaciones();
        panelNotificaciones.classList.add('mostrar');
    }

    /**
     * Cierra el panel de notificaciones.
     */
    function cerrarPanelNotificaciones() {
        panelNotificaciones.classList.remove('mostrar');
    }

    // Ayuda a controlar la apertura y cierre del panel al hacer click en la campana.
    campanaContainer?.addEventListener('click', e => {
        e.stopPropagation();
        if (panelNotificaciones?.classList.contains('mostrar')) cerrarPanelNotificaciones();
        else abrirPanelNotificaciones();
    });

    // Ayuda al cerrar el panel si se hace click fuera de él.
    document.addEventListener('click', e => {
        if (panelNotificaciones && !panelNotificaciones.contains(e.target) && (!campanaContainer || !campanaContainer.contains(e.target))) {
            cerrarPanelNotificaciones();
        }
    });

    // Buscador
    // Ayuda a filtrar los productos según lo que el administrador ingresa en el buscador.
    inputBuscador?.addEventListener('keyup', () => {
        const texto = inputBuscador.value.toLowerCase().trim();
        const filtrados = productosGlobal.filter(p => (p.nombreProducto || '').toLowerCase().includes(texto) || (p.tipo_menu || '').toLowerCase().includes(texto));
        mostrarProductos(filtrados);
    });

    // Carga inicial 
    // Llama a la función qque carga los productos cuando se inicia la página.
    cargarProductos();

});