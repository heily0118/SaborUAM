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
    const precio = document.getElementById('precio')?.value.trim();
    const estado = document.getElementById("estadoProducto")?.value;
    const archivo = inputImagen?.files?.[0];

    if (!nombre || !codigo || !tipo_menu || !descripcion || !precio || !archivo || !estado) {
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
  const dias = document.getElementById('dias')?.value.trim(); // <-- capturar días
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
      dias // <-- agregar aquí
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
    formData.append("codigo", codigo);
    formData.append("descripcion", descripcion);
    formData.append("tipo_menu", tipo_menu);
    formData.append("precio", precio);
    formData.append("estado", estadoProducto);
    formData.append("imagen", inputImagen.files[0]);
    formData.append("NIT", nit);

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
      productosGlobal = [
        { nombreProducto:'Desayuno', descripcion:'Huevos, café', tipo_menu:'desayuno', precio:12000, estado:'Disponible', imagen:null, lugar:{ nombre:'Cafetería UAM', NIT:'900123456', tipo:'Cafetería', horario_atencion:'7:00-16:00', dias:'Lun-Vie', ubicacion:'Bloque A' } },
      ];
      mostrarProductos(productosGlobal);
    }
  }

  // ===========================
  // MOSTRAR PRODUCTOS
  // ===========================
  function mostrarProductos(lista) {
    listaProductos.innerHTML = '';
    if (!lista.length) { listaProductos.innerHTML = '<p>No hay productos disponibles.</p>'; return; }

    lista.forEach(producto => {
      const estado = (producto.estado || '').toLowerCase();
      let colorClase = estado==='disponible' ? 'estado-disponible' : estado==='no disponible' ? 'estado-no-disponible' : 'estado-desconocido';
      let estadoTexto = estado==='disponible' ? 'Disponible' : estado==='no disponible' ? 'No disponible' : producto.estado || 'Sin estado';

      const precioFormateado = new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(producto.precio || 0);
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

    try { lucide.createIcons(); } catch(e){}

    // Asignar listeners a botones de tarjeta
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

    document.addEventListener('click', () => document.querySelectorAll('.menu-opciones').forEach(m => m.classList.remove('show')));
  }

  // ===========================
  // MODALES VER MAS / ACTUALIZAR / ELIMINAR
  // ===========================
  function crearModal(titulo, contenidoHTML, hasClose=true) {
    const m = document.createElement('div');
    m.classList.add('modal', 'activo');
    m.innerHTML = `<div class="modal-contenido"><h2>${titulo}</h2><div class="contenido-modal">${contenidoHTML}</div>${hasClose?`<div class="acciones"><button class="btn-cerrar-modal">Cerrar</button></div>`:''}</div>`;
    document.body.appendChild(m);
    hasClose && m.querySelector('.btn-cerrar-modal')?.addEventListener('click', () => m.remove());
    return m;
  }

function mostrarModalVerMas(producto) {
  console.log("Producto recibido:", producto); // <-- depuración

  const contenido = `
    <h3>🛒 Información del producto</h3>
    <p><strong>Nombre:</strong> ${producto.nombreProducto || ''}</p>
    <p><strong>Descripción:</strong> ${producto.descripcion || ''}</p>
    <p><strong>Tipo:</strong> ${producto.tipo_menu || ''}</p>
    <p><strong>Precio:</strong> ${producto.precio || ''}</p>
    <p><strong>Estado:</strong> ${producto.estado || ''}</p>

    <hr style="margin:10px 0;">

    <h3>🏪 Información del lugar</h3>
    <p><strong>NIT:</strong> ${producto.lugar?.NIT || ''}</p>
    <p><strong>Nombre:</strong> ${producto.lugar?.nombre || ''}</p>
    <p><strong>Tipo:</strong> ${producto.lugar?.tipo || ''}</p>
    <p><strong>Horario:</strong> ${producto.lugar?.horario_atencion || ''}</p>
    <p><strong>Días:</strong> ${producto.lugar?.dias || ''}</p>  <!-- ahora sí se muestra -->
    <p><strong>Ubicación:</strong> ${producto.lugar?.ubicacion || ''}</p>
  `;
  crearModal('Detalles del producto', contenido);
}


function mostrarModalActualizar(producto) {
  const contenido = `
    <h3>🛒 Editar producto</h3>
    <label>Nombre</label><input type="text" value="${producto.nombreProducto || ''}">
    <label>Precio</label><input type="number" value="${producto.precio || ''}">
    <label>Tipo</label><input type="text" value="${producto.tipo_menu || ''}">
    <label>Estado</label><input type="text" value="${producto.estado || ''}">

    <hr style="margin:10px 0;">

    <h3>🏪 Información del lugar</h3>
    <label>NIT</label><input type="text" value="${producto.lugar?.NIT || ''}">
    <label>Nombre</label><input type="text" value="${producto.lugar?.nombre || ''}">
    <label>Tipo</label><input type="text" value="${producto.lugar?.tipo || ''}">
    <label>Horario</label><input type="text" value="${producto.lugar?.horario_atencion || ''}">
    <label>Días de atención</label><input type="text" value="${producto.lugar?.dias || ''}">
    <label>Ubicación</label><input type="text" value="${producto.lugar?.ubicacion || ''}">
    <label>Servicio a domicilio</label>
    <input type="text" value="${producto.lugar?.servicio_domicilio ? 'Sí' : 'No'}">

    <div class="acciones" style="margin-top:12px;">
      <button class="btn-simular-actualizar" style="background:#005c99;color:white;">Actualizar</button>
      <button class="btn-cancelar-actualizar" style="background:#d4af37;color:#333;margin-left:8px;">Cancelar</button>
    </div>
  `;

  const modal = crearModal('Editar producto', contenido, false);

  modal.querySelector('.btn-cancelar-actualizar').addEventListener('click', () => modal.remove());
  modal.querySelector('.btn-simular-actualizar').addEventListener('click', () => {
    alert('Simulación: cambios aplicados (no se guardan realmente).');
    modal.remove();
  });
}




  function mostrarModalEliminar(producto) {
    const contenido = `
      <p>¿Deseas eliminar el producto <strong>${producto.nombreProducto || ''}</strong>?</p>
      <div class="acciones" style="margin-top:12px;">
        <button class="btn-confirmar-eliminar" style="background:#c0392b;color:white;">Sí</button>
        <button class="btn-cancelar-eliminar" style="background:#d4af37;color:#333;margin-left:8px;">No</button>
      </div>
    `;
    const modal = crearModal('Confirmar eliminación', contenido, false);

    modal.querySelector('.btn-cancelar-eliminar').addEventListener('click', () => modal.remove());
    modal.querySelector('.btn-confirmar-eliminar').addEventListener('click', () => {
      alert('Simulación: el producto se eliminaría (no se elimina realmente).');
      modal.remove();
    });
  }

  // ===========================
  // NOTIFICACIONES
  // ===========================
  function generarContenidoNotificaciones() {
    const notificacionesSimuladas = [
      { tipo: 'pedido', mensaje: '🍔 Nuevo pedido en Cafetería Principal' },
      { tipo: 'producto', mensaje: '📦 Producto "Empanada" marcado como No disponible' }
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

  function abrirPanelNotificaciones() {
    panelNotificaciones.innerHTML = generarContenidoNotificaciones();
    panelNotificaciones.classList.add('mostrar');
  }

  function cerrarPanelNotificaciones() {
    panelNotificaciones.classList.remove('mostrar');
  }

  campanaContainer?.addEventListener('click', e => {
    e.stopPropagation();
    if (panelNotificaciones?.classList.contains('mostrar')) cerrarPanelNotificaciones();
    else abrirPanelNotificaciones();
  });

  document.addEventListener('click', e => {
    if (panelNotificaciones && !panelNotificaciones.contains(e.target) && (!campanaContainer || !campanaContainer.contains(e.target))) {
      cerrarPanelNotificaciones();
    }
  });

  // ===========================
  // BUSCADOR
  // ===========================
  inputBuscador?.addEventListener('keyup', () => {
    const texto = inputBuscador.value.toLowerCase().trim();
    const filtrados = productosGlobal.filter(p => (p.nombreProducto||'').toLowerCase().includes(texto) || (p.tipo_menu||'').toLowerCase().includes(texto));
    mostrarProductos(filtrados);
  });

  // ===========================
  // FILTROS POR TIPO DE MENÚ
  // ===========================
  document.querySelectorAll('.filtro-btn').forEach(boton => {
    boton.addEventListener('click', () => {
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
      boton.classList.add('activo');

      const tipoSeleccionado = boton.textContent.toLowerCase();
      if (tipoSeleccionado === 'todos') { mostrarProductos(productosGlobal); return; }

      const filtrados = productosGlobal.filter(p => {
        const tipoProducto = (p.tipo_menu||'').toLowerCase();
        return (tipoSeleccionado==='desayunos' && tipoProducto.includes('desayuno')) ||
               (tipoSeleccionado==='almuerzos' && tipoProducto.includes('almuerzo')) ||
               (tipoSeleccionado==='bebidas' && tipoProducto.includes('bebida')) ||
               (tipoSeleccionado==='otros' && tipoProducto.includes('otro'));
      });
      mostrarProductos(filtrados);
    });
  });

  // ===========================
  // CARGA INICIAL
  // ===========================
  cargarProductos();

});
