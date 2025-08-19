document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Obtener los datos del formulario
    const formData = new FormData(this);
    const userData = {
        email: formData.get('email'),
        nombre: formData.get('nombre'),
        password: formData.get('password'),
        edad: parseInt(formData.get('edad')),
        rol: "Contribuyente"
    };

    // Validaciones básicas
    if (!userData.nombre || !userData.email || !userData.password || !userData.edad) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    if (userData.password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    try {
        // Enviar datos al backend (POST)
        const response = await fetch("http://localhost:8080/api/dinamica/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Error al crear usuario: " + response.status);
        }

        const nuevoUsuario = await response.json();
        console.log("Usuario creado:", nuevoUsuario);
        alert("¡Cuenta creada exitosamente!");

        // Limpiar el formulario
        this.reset();

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo crear el usuario. Intenta nuevamente.");
    }
});

// Mejorar la experiencia del usuario
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentNode.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function () {
        this.parentNode.style.transform = 'scale(1)';
    });
});

