// admin.js (reemplaza tu archivo actual con esto)

// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

// === Encapsulamos todo hasta que el DOM esté listo ===
document.addEventListener('DOMContentLoaded', () => {
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
  const campanaContainer = document.getElementById('campana-container'); // contenedor clickeable
  const iconoCampana = document.getElementById('iconoCampana');         // icono (opcional)
  const panelNotificaciones = document.getElementById('panel-notificaciones');

  // seguridad: si no encuentra elementos críticos, muestra warning y evita errores
  if (!listaProductos) console.warn('lista-productos no encontrada');
  if (!inputBuscador) console.warn('buscador no encontrado');

  // === FUNCIONES UTILES ===

  async function cargarProductos() {
    try {
      const res = await fetch(`${API_URL}/api/productos`);
      if (!res.ok) {
        console.warn('No se pudieron obtener productos desde la API (simulando).');
        mostrarProductosSimulados(); // fallback
        return;
      }
      const productos = await res.json();
      mostrarProductos(productos);
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
      mostrarProductosSimulados(); // fallback local para pruebas
    }
  }



  // Renderizado de tarjetas — espera lista de objetos con tus campos reales
  function mostrarProductos(lista) {
    if (!listaProductos) return;
    listaProductos.innerHTML = "";

    if (!Array.isArray(lista) || lista.length === 0) {
      listaProductos.innerHTML = "<p>No hay productos disponibles.</p>";
      return;
    }

    lista.forEach(producto => {
      const estado = (producto.estado || '').toLowerCase().trim();
      let colorClase = '';
      let estadoTexto = '';

      if (estado === 'disponible') {
        colorClase = 'estado-disponible';
        estadoTexto = 'Disponible';
      } else if (estado === 'no disponible') {
        colorClase = 'estado-no-disponible';
        estadoTexto = 'No disponible';
      } else {
        colorClase = 'estado-desconocido';
        estadoTexto = producto.estado || 'Sin estado';
      }

      const precioNumerico = parseFloat(producto.precio) || 0;
      const precioFormateado = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(precioNumerico);

      const tarjeta = document.createElement('div');
      tarjeta.classList.add('tarjeta');

      const imgSrc = producto.imagen ? `${API_URL}/uploads/${producto.imagen}` : 'https://via.placeholder.com/220x150';
      tarjeta.innerHTML = `
        <img src="${imgSrc}" alt="${producto.nombreProducto}">
        <div class="info">
          <h3>${producto.nombreProducto}</h3>
          <p class="precio">${precioFormateado}</p>
          <p class="lugar">${producto.NOMBRE_LUGAR || 'Sin lugar'}</p>
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

      // anexar producto original al elemento para usarlo en modales
      tarjeta.dataset.producto = JSON.stringify(producto);

      listaProductos.appendChild(tarjeta);
    });

    // recrear iconos y asignar listeners (después de appendar las tarjetas)
    try { lucide.createIcons(); } catch (e) { /* lucide puede bloquearse por prevención de tracking en algunos navegadores */ }

    // menú contextual: abrir/cerrar y asignar acciones
    document.querySelectorAll(".tarjeta").forEach(t => {
      const menuBtn = t.querySelector('.menu-btn');
      const menu = t.querySelector('.menu-opciones');

      if (menuBtn && menu) {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          // cerrar otros menús
          document.querySelectorAll(".menu-opciones").forEach(m => {
            if (m !== menu) m.classList.remove('show');
          });
          menu.classList.toggle('show');
        });
      }

      // asignar acciones: extraer objeto producto del dataset
      const prod = t.dataset.producto ? JSON.parse(t.dataset.producto) : null;
      if (prod) {
        const ver = t.querySelector('.ver-btn');
        const editar = t.querySelector('.editar-btn');
        const eliminar = t.querySelector('.eliminar-btn');

        if (ver) ver.addEventListener('click', (ev) => { ev.stopPropagation(); mostrarModalVerMas(prod); menu && menu.classList.remove('show'); });
        if (editar) editar.addEventListener('click', (ev) => { ev.stopPropagation(); mostrarModalActualizar(prod); menu && menu.classList.remove('show'); });
        if (eliminar) eliminar.addEventListener('click', (ev) => { ev.stopPropagation(); mostrarModalEliminar(prod); menu && menu.classList.remove('show'); });
      }
    });

    // cerrar menús al click fuera
    document.addEventListener('click', () => {
      document.querySelectorAll(".menu-opciones").forEach(menu => menu.classList.remove("show"));
    });
  }

  // ======= MODALES SIMULADOS =======

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

    if (hasClose) {
      modal.querySelector('.btn-cerrar-modal').addEventListener('click', () => modal.remove());
    }
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
    <label>Nombre</label><input type="text" value="${producto.nombreProducto || ''}">
    <label>Precio</label><input type="number" value="${producto.precio || ''}">
    <label>Tipo</label><input type="text" value="${producto.tipo_menu || ''}">
    <label>Estado</label><input type="text" value="${producto.estado || ''}">

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

  const modal = crearModal('Editar producto ', contenido, false);

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

  // ======= NOTIFICACIONES (panel lateral) =======
  function generarContenidoNotificaciones() {
    const notificacionesSimuladas = [
      { tipo: 'pedido', mensaje: '🍔 Nuevo pedido en Cafetería Principal' },
      { tipo: 'producto', mensaje: '📦 Producto "Empanada" marcado como No disponible' }
    ];

    let html = '<h3>🎉 Notificaciones</h3>';
    if (notificacionesSimuladas.length === 0) {
      html += '<ul><li>No hay notificaciones nuevas.</li></ul>';
    } else {
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

  if (panelNotificaciones) {
    panelNotificaciones.addEventListener('click', (e) => e.stopPropagation());
  }

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

  // ==== Iniciar carga inicial ====
  cargarProductos();
}); // end DOMContentLoaded
