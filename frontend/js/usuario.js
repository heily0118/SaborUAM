// --- LOGIN ---
const modalLogin = document.getElementById('modal-login');
const btnLogin = document.getElementById('btn-login');
const cerrarLogin = document.getElementById('cerrar-login');

if (btnLogin && modalLogin) {
  btnLogin.addEventListener('click', () => modalLogin.classList.add('activo'));
}
if (cerrarLogin && modalLogin) {
  cerrarLogin.addEventListener('click', () => modalLogin.classList.remove('activo'));
}

// --- REGISTRO ---
const modalRegistro = document.getElementById('modal-registro');
const btnRegistro = document.getElementById('btn-registro');
const cerrarRegistro = document.getElementById('cerrar-registro');

if (btnRegistro && modalRegistro) {
  btnRegistro.addEventListener('click', () => modalRegistro.classList.add('activo'));
}
if (cerrarRegistro && modalRegistro) {
  cerrarRegistro.addEventListener('click', () => modalRegistro.classList.remove('activo'));
}

// --- Cerrar modal si se hace clic fuera ---
window.addEventListener('click', (e) => {
  if (e.target === modalRegistro) modalRegistro.classList.remove('activo');
  if (e.target === modalLogin) modalLogin.classList.remove('activo');
});
