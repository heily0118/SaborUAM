import express from 'express';
const router = express.Router();

// Rutas de prueba
router.post('/login', (req, res) => {
  console.log('Login recibido:', req.body);
  res.json({ mensaje: '¡Login recibido correctamente!' });
});

router.post('/registro', (req, res) => {
  console.log('Registro recibido:', req.body);
  res.json({ mensaje: '¡Registro recibido correctamente!' });
});

export default router;
// --- REGISTRO ---

const modalRegistro = document.getElementById('modal-registro');
const btnRegistro = document.getElementById('btn-registro');
const cerrarRegistro = document.getElementById('cerrar-registro');


// --- Formulario REGISTRO ---
const formRegistro = document.getElementById('form-registro');
const inputNombre = document.getElementById('reg-nombre');
const inputCedula = document.getElementById('reg-cedula'); 
const inputEmail = document.getElementById('reg-email');
const inputPassword = document.getElementById('reg-password');


function setError(inputElement, message) {
    const formControl = inputElement.parentElement;
    const errorDisplay = formControl.querySelector('.error-text');

    formControl.classList.add('error');
    if (errorDisplay) {
        errorDisplay.innerText = message;
    }
}

function clearError(inputElement) {
    const formControl = inputElement.parentElement;
    formControl.classList.remove('error');
    const errorDisplay = formControl.querySelector('.error-text');
    if (errorDisplay) {
        errorDisplay.innerText = '';
    }
}


/**
 * Valida los campos del formulario de REGISTRO (nombre, cédula, email, password).
 * @returns {boolean} - true si es válido, false si hay errores.
 */
function validarRegistro() {
    let esValido = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regex para 5 a 10 dígitos numéricos
    const cedulaRegex = /^[0-9]{5,10}$/; 

    // Nombre
    if (inputNombre.value.trim() === '') {
        setError(inputNombre, 'El nombre es obligatorio.');
        esValido = false;
    } else {
        clearError(inputNombre);
    }
    
    // Cédula
    if (inputCedula.value.trim() === '') {
        setError(inputCedula, 'La cédula es obligatoria.');
        esValido = false;
    } else if (!cedulaRegex.test(inputCedula.value.trim())) {
        setError(inputCedula, 'Debe contener entre 5 y 10 dígitos numéricos.');
        esValido = false;
    } else {
        clearError(inputCedula);
    }

    // Email
    if (inputEmail.value.trim() === '') {
        setError(inputEmail, 'El email es obligatorio.');
        esValido = false;
    } else if (!emailRegex.test(inputEmail.value.trim())) {
        setError(inputEmail, 'El formato del email no es válido.');
        esValido = false;
    } else {
        clearError(inputEmail);
    }

    // Contraseña
    if (inputPassword.value.length < 6) {
        setError(inputPassword, 'La contraseña debe tener al menos 6 caracteres.');
        esValido = false;
    } else {
        clearError(inputPassword);
    }

    return esValido;
}

function toggleModal(modal, action) {
    if (modal) modal.classList[action]('activo');
}

// Abrir/Cerrar Registro
if (btnRegistro) btnRegistro.addEventListener('click', () => toggleModal(modalRegistro, 'add'));
if (cerrarRegistro) cerrarRegistro.addEventListener('click', () => toggleModal(modalRegistro, 'remove'));

// Cerrar modal si se hace clic fuera
window.addEventListener('click', (e) => {
    if (e.target === modalRegistro) toggleModal(modalRegistro, 'remove');
});


// enviar registro
if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Ejecutar la validación
        if (validarRegistro()) { 
            const nombre = inputNombre.value.trim();
            const cedula = inputCedula.value.trim(); 
            const email = inputEmail.value.trim();
            const password = inputPassword.value;

            try {
                // 2. FETCH al Back-end
                const res = await fetch('http://localhost:3000/api/usuarios/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Se envía el objeto completo con la CÉDULA
                    body: JSON.stringify({ nombre, cedula, email, password }) 
                });

                const data = await res.json();

                // 3. Manejo de respuesta del servidor
                if (res.ok) { 
                    alert('Registro exitoso: ' + data.mensaje);
                    // Llama a la función para cerrar el modal
                    if (typeof toggleModal === 'function') {
                        toggleModal(modalRegistro, 'remove'); 
                    }
                    formRegistro.reset();
                } else { 
                    // Muestra el mensaje de error que viene del servidor (ej: usuario ya existe)
                    alert(' Error de Registro: ' + data.mensaje);
                }

            } catch (err) {
                // Este error se dispara si el servidor no está corriendo o hay un problema de CORS
                alert(' Error de conexión. El servidor no responde.');
                console.error('Error de conexión:', err);
            }
        }
    });
}
