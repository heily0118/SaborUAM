// frontend/js/consultas.js
const registrarConsulta = async (usu_num, pro_cod) => {
  try {
    const respuesta = await fetch("http://localhost:3000/api/consultas/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usu_num, pro_cod })
    });

    const data = await respuesta.json();
    console.log(data.mensaje);
  } catch (error) {
    console.error("Error al registrar consulta:", error);
  }
};

// Ejemplo de uso:
registrarConsulta("12345", "P001");
