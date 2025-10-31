// --- MODAL AGREGAR --- 
var modalAgregar = document.getElementById('modal-agregar');
var btnAbrirAgregar = document.getElementById('btn-agregar'); 
var btnCerrarAgregar = document.getElementById('cancelar');   

if (btnAbrirAgregar && modalAgregar) {
  btnAbrirAgregar.addEventListener('click', function() {
    modalAgregar.classList.add('activo');
  });
}

if (btnCerrarAgregar && modalAgregar) {
  btnCerrarAgregar.addEventListener('click', function() {
    modalAgregar.classList.remove('activo');
  });
}

window.addEventListener('click', function(e) {
  if (e.target === modalAgregar) {
    modalAgregar.classList.remove('activo');
  }
});

// --- FILTROS LATERALES ---
var botones = document.querySelectorAll('.btn-filtro');

botones.forEach(function(boton) {
  boton.addEventListener('click', function() {
    var activo = document.querySelector('.btn-filtro.activo');
    if (activo) activo.classList.remove('activo');

    boton.classList.add('activo');

    var categoria = boton.getAttribute('data-categoria');
    console.log("Filtrando por:", categoria);
  });
});
