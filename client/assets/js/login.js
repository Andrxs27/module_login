document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await res.json();

        if (result.token) {
            // Guardamos todo lo necesario para el dashboard
            localStorage.setItem("token", result.token);
            localStorage.setItem("rol", result.rol);
            localStorage.setItem("nombre", result.nombre);

            // Redirigimos a la nueva página
            window.location.href = "dashboard.html";
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error en login:", error);
    }
});