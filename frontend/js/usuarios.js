// frontend/js/usuarios.js

document.addEventListener('DOMContentLoaded', () => {
  const formRegistro = document.getElementById('formRegistro');

  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura de los campos del formulario
    const tipo_de_documento = document.getElementById('tipo_de_documento').value.trim();
    const numero_de_documento = document.getElementById('numero_de_documento').value.trim();
    const nombre_completo = document.getElementById('nombre_completo').value.trim();
    const correo_electronico = document.getElementById('correo_electronico').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();

    try {
      // Envío de datos al backend
      const res = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_de_documento,
          numero_de_documento,
          nombre_completo,
          correo_electronico,
          contrasena,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Usuario registrado correctamente');
        console.log('Respuesta del backend:', data);
        formRegistro.reset();
      } else {
        alert('Error: ' + (data.message || 'No se pudo registrar el usuario'));
      }

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Hubo un error al conectar con el servidor');
    }
  });
});
