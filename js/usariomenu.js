
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
