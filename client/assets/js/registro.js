document.getElementById("registroForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;

    const data = {
        nombre: form.nombre.value,
        lastname: form.lastname.value,
        email: form.email.value,
        password: form.password.value,
        document: form.document.value,
        type_document: form.type_document.value,
        phone: form.phone.value,
        address: form.address.value,
        age: form.age.value,
        departamento: form.departamento.value,
        ciudad: form.ciudad.value,
        sexo: form.sexo.value,
        born: form.born.value
    };

    const res = await fetch(`${url}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message);
});