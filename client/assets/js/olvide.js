document.getElementById("formOlvide").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const mensajeDiv = document.getElementById("mensaje");

    mensajeDiv.textContent = "Enviando...";

    try {
        const res = await fetch("http://localhost:3000/api/recovery", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        });

        const result = await res.json();
        mensajeDiv.textContent = result.message;

    } catch (e) {
        mensajeDiv.textContent = "Error al conectar con el servidor";
        console.log(e);
    }
});