const btnAgregar = document.getElementById('btn-agregar');
const modal = document.getElementById('modal-agregar');
const cancelar = document.getElementById('cancelar');

btnAgregar.addEventListener('click', () => {
  modal.style.display = 'flex';
});

cancelar.addEventListener('click', () => {
  modal.style.display = 'none';
});
