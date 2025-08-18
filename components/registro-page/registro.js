document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtener los datos del formulario
    const formData = new FormData(this);
    const userData = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        password: formData.get('password'),
        edad: parseInt(formData.get('edad'))
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

    //Enviar los datos al backend
    console.log('Datos del usuario:', userData);
    alert('¡Cuenta creada exitosamente!');

    // Redirigir o limpiar el formulario
    this.reset();
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