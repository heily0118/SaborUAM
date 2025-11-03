// === CONFIGURACIÓN BASE ===
const API_URL = "http://localhost:3000";

// === SELECCIÓN DE ELEMENTOS ===
const listaProductos = document.getElementById('lista-productos');
const botonesFiltro = document.querySelectorAll('.filtro-btn');
const btnCerrar = document.getElementById('btn-cerrar');

// === FUNCIÓN PRINCIPAL: CARGAR PRODUCTOS ===
async function cargarProductosMenu(filtro = 'Todos') {
  try {
    listaProductos.innerHTML = '<p class="cargando">Cargando productos...</p>';

    const res = await fetch(`${API_URL}/api/productos`);
    let productos = await res.json();

    // FILTRAR
    if (filtro !== 'Todos') {
      productos = productos.filter(p => p.tipo_menu === filtro);
    }

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML = `<p class="sin-resultados">No hay productos en la categoría: <strong>${filtro}</strong>.</p>`;
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

      // 💾 Registrar consulta al hacer clic
      tarjeta.addEventListener('click', async () => {
        const usu_num = localStorage.getItem('usuario_num');
        if (!usu_num) {
          alert("Inicia sesión para registrar consultas.");
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
  } catch (error) {
    console.error('❌ Error al cargar productos:', error);
    listaProductos.innerHTML = "<p>Hubo un problema al cargar los productos.</p>";
  }
}

// === EVENTOS DE FILTRO ===
botonesFiltro.forEach(btn => {
  btn.addEventListener('click', e => {
    const filtro = e.target.textContent;
    botonesFiltro.forEach(b => b.classList.remove('activo'));
    e.target.classList.add('activo');
    cargarProductosMenu(filtro);
  });
});

// === CERRAR SESIÓN ===
btnCerrar.addEventListener('click', () => {
  localStorage.removeItem('usuario_num');
  window.location.href = 'usuario.html';
});

// === CARGAR PRODUCTOS AL INICIO ===
window.addEventListener('DOMContentLoaded', () => {
  cargarProductosMenu('Todos');
});
