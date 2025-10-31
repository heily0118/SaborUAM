// --- LOGIN ---
document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email-login').value;
  const password = document.getElementById('password-login').value;

  try {
    const res = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert('Login: ' + data.mensaje); // Muestra mensaje del backend
  } catch (err) {
    alert('Error al conectar con el backend');
    console.error(err);
  }
});

// --- REGISTRO ---
document.getElementById('form-registro').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById('nombre-registro').value;
  const email = document.getElementById('email-registro').value;
  const password = document.getElementById('password-registro').value;

  try {
    const res = await fetch('http://localhost:3000/api/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const data = await res.json();
    alert('Registro: ' + data.mensaje); // Muestra mensaje del backend
  } catch (err) {
    alert('Error al conectar con el backend');
    console.error(err);
  }
});
