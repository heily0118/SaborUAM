// admin.js (reemplaza tu archivo actual con esto)

// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

// === Encapsulamos todo hasta que el DOM esté listo ===
document.addEventListener('DOMContentLoaded', () => {
  console.info('[admin.js] DOM listo');

  // 🟢 Variable global (necesaria para filtros/búsqueda)
  let productosGlobal = [];

  // === SELECCIÓN DE ELEMENTOS (AHORA CON SEGURIDAD) ===
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

  // NOTIFICACIONES
  const campanaContainer = document.getElementById('campana-container');
  const iconoCampana = document.getElementById('iconoCampana');
  const panelNotificaciones = document.getElementById('panel-notificaciones');

  if (!listaProductos) console.warn('[admin.js] lista-productos no encontrada');
  if (!inputBuscador) console.warn('[admin.js] buscador no encontrado');

  // === FALLBACK (datos simulados) ===
  function mostrarProductosSimulados() {
    console.info('[admin.js] usando datos simulados');
    productosGlobal = [
      { nombreProducto:'Desayuno clásico', descripcion:'Huevos, arepa y café', tipo_menu:'desayuno', precio:12000, estado:'Disponible', imagen:null, lugar:{ nombre:'Cafetería UAM', NIT:'900123456', tipo:'Cafetería', horario_atencion:'7:00-16:00', dias:'Lun-Vie', ubicacion:'Bloque A' } },
      { nombreProducto:'Almuerzo ejecutivo', descripcion:'Carne + guarnición', tipo_menu:'almuerzo', precio:22000, estado:'No disponible', imagen:null, lugar:{ nombre:'Comedor Central', tipo:'Comedor', horario_atencion:'12:00-14:30', dias:'Lun-Sab', ubicacion:'Bloque B' } },
      { nombreProducto:'Jugo natural', descripcion:'Naranja 400ml', tipo_menu:'bebida', precio:6000, estado:'Disponible', imagen:null, lugar:{ nombre:'Kiosko Salud', tipo:'Kiosko', horario_atencion:'8:00-18:00', dias:'Todos', ubicacion:'Plaza' } },
      { nombreProducto:'Postre del día', descripcion:'Porción pequeña', tipo_menu:'postre', precio:5000, estado:'Disponible', imagen:null, lugar:{ nombre:'Dulcería', tipo:'Tienda', horario_atencion:'9:00-19:00', dias:'Todos', ubicacion:'Bloque C' } },
    ];
    mostrarProductos(productosGlobal);
  }

  // === CARGAR PRODUCTOS (y asegurar set de productosGlobal) ===
  async function cargarProductos() {
    console.info('[admin.js] cargando productos desde', API_URL);
    try {
      const res = await fetch(`${API_URL}/api/productos`, { cache: "no-store" });
      if (!res.ok) {
        console.warn('[admin.js] fetch devolvió status', res.status, res.statusText);
        mostrarProductosSimulados();
        return;
      }
      const productos = await res.json();
      if (!Array.isArray(productos)) {
        console.warn('[admin.js] respuesta no es array, usando simulados');
        mostrarProductosSimulados();
        return;
      }
      // ⚠️ importante: guardar en la variable global para filtros/búsqueda
      productosGlobal = productos;
      console.info(`[admin.js] ${productosGlobal.length} productos cargados`);
      mostrarProductos(productosGlobal);
    } catch (error) {
      console.error('[admin.js] Error al cargar productos:', error);
      mostrarProductosSimulados();
    }
  }

  // === Renderizado de tarjetas ===
  function mostrarProductos(lista) {
    if (!listaProductos) {
      console.warn('[admin.js] mostrarProductos: listaProductos no existe');
      return;
    }
    listaProductos.innerHTML = '';

    if (!Array.isArray(lista) || lista.length === 0) {
      listaProductos.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }

    lista.forEach(producto => {
      const estado = (producto.estado || '').toLowerCase().trim();
      let colorClase = '';
      let estadoTexto = '';

      if (estado === 'disponible') { colorClase = 'estado-disponible'; estadoTexto = 'Disponible'; }
      else if (estado === 'no disponible') { colorClase = 'estado-no-disponible'; estadoTexto = 'No disponible'; }
      else { colorClase = 'estado-desconocido'; estadoTexto = producto.estado || 'Sin estado'; }

      const precioNumerico = parseFloat(producto.precio) || 0;
      const precioFormateado = new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', minimumFractionDigits:0 }).format(precioNumerico);

      const tarjeta = document.createElement('div');
      tarjeta.classList.add('tarjeta');

      const imgSrc = producto.imagen ? `${API_URL}/uploads/${producto.imagen}` : 'https://via.placeholder.com/220x150';
      tarjeta.innerHTML = `
        <img src="${imgSrc}" alt="${producto.nombreProducto || 'producto'}">
        <div class="info">
          <h3>${producto.nombreProducto || ''}</h3>
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
      tarjeta.dataset.producto = JSON.stringify(producto);
      listaProductos.appendChild(tarjeta);
    });

    // recrear iconos lucide si están cargados
    try { lucide.createIcons(); } catch (e) {}

    // asignar listeners a tarjetas creadas
    document.querySelectorAll('.tarjeta').forEach(t => {
      const menuBtn = t.querySelector('.menu-btn');
      const menu = t.querySelector('.menu-opciones');
      const prod = t.dataset.producto ? JSON.parse(t.dataset.producto) : null;

      if (menuBtn && menu) {
        menuBtn.addEventListener('click', e => {
          e.stopPropagation();
          document.querySelectorAll('.menu-opciones').forEach(m => { if (m !== menu) m.classList.remove('show'); });
          menu.classList.toggle('show');
        });
      }

      if (prod) {
        const ver = t.querySelector('.ver-btn');
        const editar = t.querySelector('.editar-btn');
        const eliminar = t.querySelector('.eliminar-btn');

        if (ver) ver.addEventListener('click', ev => { ev.stopPropagation(); mostrarModalVerMas(prod); menu && menu.classList.remove('show'); });
        if (editar) editar.addEventListener('click', ev => { ev.stopPropagation(); mostrarModalActualizar(prod); menu && menu.classList.remove('show'); });
        if (eliminar) eliminar.addEventListener('click', ev => { ev.stopPropagation(); mostrarModalEliminar(prod); menu && menu.classList.remove('show'); });
      }
    });

    // cerrar menús al click fuera
    document.addEventListener('click', () => {
      document.querySelectorAll('.menu-opciones').forEach(menu => menu.classList.remove('show'));
    });
  }

  // ===== MODALES SIMULADOS =====
  function crearModal(titulo, contenidoHTML, hasClose = true) {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'activo');
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>${titulo}</h2>
        <div class="contenido-modal">${contenidoHTML}</div>
        ${ hasClose ? `<div class="acciones"><button class="btn-cerrar-modal">Cerrar</button></div>` : '' }
      </div>
    `;
    document.body.appendChild(modal);
    if (hasClose) modal.querySelector('.btn-cerrar-modal').addEventListener('click', () => modal.remove());
    return modal;
  }

  function mostrarModalVerMas(producto) {
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
      <p><strong>Días:</strong> ${producto.lugar?.dias || ''}</p>
      <p><strong>Ubicación:</strong> ${producto.lugar?.ubicacion || ''}</p>
    `;
    crearModal('Detalles del producto', contenido);
  }

  function mostrarModalActualizar(producto) {
    const contenido = `
      <h3>🛒 Editar producto</h3>
      <label>Nombre</label><input type="text" class="m-edit-nombre" value="${producto.nombreProducto || ''}">
      <label>Precio</label><input type="number" class="m-edit-precio" value="${producto.precio || ''}">
      <label>Tipo</label><input type="text" class="m-edit-tipo" value="${producto.tipo_menu || ''}">
      <label>Estado</label><input type="text" class="m-edit-estado" value="${producto.estado || ''}">
      <hr style="margin:10px 0;">
      <h3>🏪 Información del lugar</h3>
      <label>NIT</label><input type="text" class="m-edit-lugar-nit" value="${producto.lugar?.NIT || ''}">
      <label>Nombre</label><input type="text" class="m-edit-lugar-nombre" value="${producto.lugar?.nombre || ''}">
      <label>Horario</label><input type="text" class="m-edit-lugar-horario" value="${producto.lugar?.horario_atencion || ''}">
      <label>Ubicación</label><input type="text" class="m-edit-lugar-ubicacion" value="${producto.lugar?.ubicacion || ''}">
      <div class="acciones" style="margin-top:12px;">
        <button class="btn-simular-actualizar" style="background:#005c99;color:white;">Actualizar</button>
        <button class="btn-cancelar-actualizar" style="background:#d4af37;color:#333;margin-left:8px;">Cancelar</button>
      </div>
    `;
    const modal = crearModal('Editar producto ', contenido, false);

    modal.querySelector('.btn-cancelar-actualizar').addEventListener('click', () => modal.remove());
    modal.querySelector('.btn-simular-actualizar').addEventListener('click', () => {
      // Opcional: reflejar los cambios en pantalla sin guardar (maquetación)
      const nuevoNombre = modal.querySelector('.m-edit-nombre').value;
      const nuevoPrecio = modal.querySelector('.m-edit-precio').value;
      const nuevoTipo = modal.querySelector('.m-edit-tipo').value;
      const nuevoEstado = modal.querySelector('.m-edit-estado').value;

      // Actualizamos visualmente el objeto en productosGlobal (solo front)
      const i = productosGlobal.findIndex(p => p.nombreProducto === producto.nombreProducto && (p.precio == producto.precio));
      if (i !== -1) {
        productosGlobal[i] = {
          ...productosGlobal[i],
          nombreProducto: nuevoNombre,
          precio: nuevoPrecio,
          tipo_menu: nuevoTipo,
          estado: nuevoEstado
        };
        mostrarProductos(productosGlobal);
      } else {
        console.warn('[admin.js] no se encontró índice para actualizar visualmente');
      }

      alert('Simulación: cambios aplicados (no persistidos en backend).');
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
      // Solo simulación front: eliminar del array visual
      productosGlobal = productosGlobal.filter(p => !(p.nombreProducto === producto.nombreProducto && p.precio == producto.precio));
      mostrarProductos(productosGlobal);
      alert('Simulación: producto eliminado (no persistido).');
      modal.remove();
    });
  }

  // ======= NOTIFICACIONES (panel lateral) =======
  function generarContenidoNotificaciones() {
    const notificacionesSimuladas = [
      { tipo: 'pedido', mensaje: '🍔 Nuevo pedido en Cafetería Principal' },
      { tipo: 'producto', mensaje: '📦 Producto "Empanada" marcado como No disponible' }
    ];
    let html = '<h3>🎉 Notificaciones</h3>';
    if (notificacionesSimuladas.length === 0) html += '<ul><li>No hay notificaciones nuevas.</li></ul>';
    else {
      html += '<ul>';
      notificacionesSimuladas.forEach(n => { html += `<li>${n.mensaje}</li>`; });
      html += '</ul>';
    }
    return html;
  }

  function abrirPanelNotificaciones() {
    if (!panelNotificaciones) return;
    panelNotificaciones.innerHTML = generarContenidoNotificaciones();
    panelNotificaciones.classList.add('mostrar');
    panelNotificaciones.setAttribute('aria-hidden', 'false');
  }

  function cerrarPanelNotificaciones() {
    if (!panelNotificaciones) return;
    panelNotificaciones.classList.remove('mostrar');
    panelNotificaciones.setAttribute('aria-hidden', 'true');
  }

  if (campanaContainer) {
    campanaContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      const abierto = panelNotificaciones && panelNotificaciones.classList.contains('mostrar');
      if (abierto) cerrarPanelNotificaciones();
      else abrirPanelNotificaciones();
    });
  }

  document.addEventListener('click', (e) => {
    if (!panelNotificaciones) return;
    if (!panelNotificaciones.contains(e.target) && (!campanaContainer || !campanaContainer.contains(e.target))) {
      cerrarPanelNotificaciones();
    }
  });
  if (panelNotificaciones) panelNotificaciones.addEventListener('click', (e) => e.stopPropagation());

  // ======= MODAL AGREGAR (botones del formulario) =======
  if (btnAgregar) {
    btnAgregar.addEventListener('click', () => {
      if (!modal) return;
      modal.style.display = 'flex';
      if (paso1) paso1.style.display = 'block';
      if (paso2) paso2.style.display = 'none';
    });
  }
  if (btnCancelar) btnCancelar.addEventListener('click', () => { if (modal) modal.style.display = 'none'; if (formProducto) formProducto.reset(); });
  if (btnSiguiente) btnSiguiente.addEventListener('click', () => {
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
    if (paso1) paso1.style.display = 'none';
    if (paso2) paso2.style.display = 'block';
  });
  if (btnAtras) btnAtras.addEventListener('click', () => { if (paso2) paso2.style.display = 'none'; if (paso1) paso1.style.display = 'block'; });

  // búsqueda
  if (inputBuscador) {
    inputBuscador.addEventListener('keyup', () => {
      const texto = inputBuscador.value.toLowerCase().trim();
      const filtrados = productosGlobal.filter(p => {
        const nombre = (p.nombreProducto || "").toLowerCase();
        const tipo = (p.tipo_menu || "").toLowerCase();
        return nombre.includes(texto) || tipo.includes(texto);
      });
      mostrarProductos(filtrados);
    });
    inputBuscador.addEventListener('change', () => inputBuscador.dispatchEvent(new Event('keyup')));
  }

  // MENÚ CONTEXTUAL (global)
  document.addEventListener('click', () => {
    document.querySelectorAll('.menu-opciones').forEach(menu => menu.classList.remove('show'));
  });

  // FILTRO POR TIPO DE MENÚ
  document.querySelectorAll('.filtro-btn').forEach(boton => {
    boton.addEventListener('click', e => {
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
      boton.classList.add('activo');

      const tipoSeleccionado = boton.textContent.trim().toLowerCase();
      if (tipoSeleccionado === 'todos') {
        mostrarProductos(productosGlobal);
        return;
      }
      const filtrados = productosGlobal.filter(p => {
        const tipoProducto = (p.tipo_menu || '').toLowerCase().trim();
        return (
          (tipoSeleccionado === 'desayunos' && tipoProducto.includes('desayuno')) ||
          (tipoSeleccionado === 'almuerzos' && tipoProducto.includes('almuerzo')) ||
          (tipoSeleccionado === 'bebidas' && tipoProducto.includes('bebida')) ||
          (tipoSeleccionado === 'otros' && tipoProducto.includes('otro'))
        );
      });
      mostrarProductos(filtrados);
    });
  });

  // FUNCIÓN APLICAR FILTROS (reutilizable)
  function aplicarFiltros() {
    const texto = inputBuscador?.value?.toLowerCase().trim() || '';
    const filtrados = productosGlobal.filter(p => {
      const nombre = (p.nombreProducto || '').toLowerCase();
      const tipo = (p.tipo_menu || '').toLowerCase();
      return nombre.includes(texto) || tipo.includes(texto);
    });
    mostrarProductos(filtrados);
  }

  if (inputBuscador) {
    inputBuscador.addEventListener('keyup', aplicarFiltros);
    inputBuscador.addEventListener('change', aplicarFiltros);
  }

  // CARGA INICIAL
  cargarProductos();
});
