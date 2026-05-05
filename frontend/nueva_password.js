const params = new URLSearchParams(window.location.search);
const token = params.get("token");

document.getElementById("formNuevaPassword").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const password = form.password.value;
    const confirmar = form.confirmar.value;
    const mensajeDiv = document.getElementById("mensaje");

    if (password !== confirmar) {
        mensajeDiv.textContent = "Las contraseñas no coinciden";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/nueva-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: token, password: password })
        });

        const result = await res.json();
        mensajeDiv.textContent = result.message;

        if (res.ok) {
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        }

    } catch (e) {
        mensajeDiv.textContent = "Error al conectar con el servidor";
        console.log(e);
    }
});