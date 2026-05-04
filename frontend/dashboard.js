// 1. Recuperar datos del localStorage
const token = localStorage.getItem("token");
const rol = localStorage.getItem("rol");
const nombre = localStorage.getItem("nombre");

// 2. Seguridad: Si no hay token, mandarlo al login
if (!token) {
    window.location.href = "index.html";
}

// 3. Configurar la interfaz según el ROL
document.addEventListener("DOMContentLoaded", () => {
    const cuerpo = document.getElementById("dash-body");
    const bienvenida = document.getElementById("bienvenida");
    const rolTexto = document.getElementById("rol-texto");

    bienvenida.innerText = `¡Bienvenido, ${nombre}!`;
    rolTexto.innerText = `Nivel de acceso: ${rol.toUpperCase()}`;

    // CAMBIO DE COLORES SEGÚN ROL
    if (rol === 'admin') {
        cuerpo.style.backgroundColor = "#e74c3c"; // Rojo
        cargarUsuariosParaAdmin();
    } else if (rol === 'vendedor') {
        cuerpo.style.backgroundColor = "#27ae60"; // Verde
        document.getElementById("contenido-privado").innerHTML = "<h3>Panel de Ventas Activo</h3><p>Aquí verías tus pedidos.</p>";
    } else {
        cuerpo.style.backgroundColor = "#2980b9"; // Azul
        document.getElementById("contenido-privado").innerHTML = "<h3>Área de Usuario</h3><p>Aquí verías tu perfil personal.</p>";
    }
});

// 4. Función exclusiva para el ADMIN
async function cargarUsuariosParaAdmin() {
    const res = await fetch("http://localhost:3000/api/users");
    const usuarios = await res.json();

    let html = `<h3>Gestión de Usuarios (Admin)</h3>
                <table>
                    <tr><th>Email</th><th>Rol Actual</th><th>Acción</th></tr>`;
    
    usuarios.forEach(u => {
        html += `<tr>
            <td>${u.email}</td>
            <td>${u.rol}</td>
            <td>
                <select onchange="actualizarRol('${u.id}', this.value)">
                    <option value="">Cambiar...</option>
                    <option value="usuario">Usuario</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="admin">Admin</option>
                </select>
            </td>
        </tr>`;
    });
    document.getElementById("contenido-privado").innerHTML = html + "</table>";
}

// 5. Actualizar ROL en la base de datos
async function actualizarRol(id, nuevoRol) {
    if (!nuevoRol) return;
    const res = await fetch("http://localhost:3000/api/update-role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nuevoRol })
    });
    const data = await res.json();
    alert(data.message);
    location.reload(); 
}

// 6. Cerrar Sesión
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}