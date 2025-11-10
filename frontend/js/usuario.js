// Archivo: frontend/js/usuarios.js

document.addEventListener('DOMContentLoaded', () => {
  //  === Se captura el formulario de registro ===
  const formRegistro = document.getElementById('form-registro'); 

  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // === Se capturan los valores de cada campo del formulario ===
    const tipo_de_documento = document.getElementById('tipo_de_documento').value.trim();
    const numero_de_documento = document.getElementById('numero_de_documento').value.trim();
    const nombre_completo = document.getElementById('nombre_completo').value.trim();
    const correo_electronico = document.getElementById('correo_electronico').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();

    if (
      !tipo_de_documento ||
      !numero_de_documento ||
      !nombre_completo ||
      !correo_electronico ||
      !contrasena
    ) {
      alert('Por favor completa todos los campos.');
      return; // Detiene la ejecución si falta algún campo
    }

    try {
      // == Se Envian los datos al backend ===
      // Se realiza una petición POST al endpoint del servidor para registrar el usuario.
      const res = await fetch('http://localhost:3000/api/usuarios/registro', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Indicamos que se envía JSON
        body: JSON.stringify({
          tipo_de_documento,
          numero_de_documento,
          nombre_completo,
          correo_electronico,
          contrasena,
        }),
      });

      // === Se procesamos la respuesta del servidor ===
      const data = await res.json(); // Se combierte la respuesta en JSON

      if (res.ok) {
        // Si el registro fue exitoso
        alert('Usuario registrado correctamente');
        console.log('Respuesta del backend:', data);
        formRegistro.reset(); // Limpia los campos del formulario
      } else {
        // Si hubo un error en el registro (por ejemplo, usuario ya existe)
        alert('Error de registro: ' + (data.mensaje || 'No se pudo registrar el usuario'));
      }

    } catch (error) {
      // === Manejo de errores de conexión o problemas con el servidor ===
      console.error('Error al registrar usuario:', error);
      alert('Hubo un error al conectar con el servidor');
    }
  });
});
