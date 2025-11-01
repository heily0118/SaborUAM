import mysql from "mysql2";

// Crear conexión con MySQL
const conexion = mysql.createConnection({
  host: "localhost",    //host
  user: "root",          // usuario MySQL
  password: "#Septiembre18.",          // contraseña 
  database: "saboruam"   // nombre  base de datos
});

// Verificar conexión
conexion.connect((err) => {
  if (err) {
    console.error(" Error al conectar con la base de datos:", err);
  } else {
    console.log("Conexión exitosa con la base de datos");
  }
});

export default conexion;
