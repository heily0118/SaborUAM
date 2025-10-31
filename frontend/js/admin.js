// --- Abrir y cerrar modal ---
const modal = document.getElementById('modal-agregar');
const btnAbrir = document.getElementById('btn-agregar'); // botón con el círculo dorado "+"
const btnCerrar = document.getElementById('cancelar');   // botón dentro del modal

// Abrir modal al presionar el botón "+"
if (btnAbrir && modal) {
  btnAbrir.addEventListener('click', () => {
    modal.classList.add('activo');
  });
}

// Cerrar modal al presionar "Cancelar"
if (btnCerrar && modal) {
  btnCerrar.addEventListener('click', () => {
    modal.classList.remove('activo');
  });
}

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('activo');
  }
});

// --- Filtros laterales ---
const botones = document.querySelectorAll('.btn-filtro');

botones.forEach(boton => {
  boton.addEventListener('click', () => {
    document.querySelector('.btn-filtro.activo')?.classList.remove('activo');
    boton.classList.add('activo');

    const categoria = boton.getAttribute('data-categoria');
    console.log("Filtrando por:", categoria);
  });
});
