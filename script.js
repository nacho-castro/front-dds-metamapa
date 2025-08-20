function initModal(modalId, openBtnId) {
  const modal = document.getElementById(modalId);
  const openBtn = document.getElementById(openBtnId);
  if (!modal || !openBtn) return; // si no existe, no hace nada

  const closeBtn = modal.querySelector(".close");
  const modalContent = modal.querySelector(".modal-content");

  // Abrir
  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // evita scroll de fondo
  });

  // Cerrar con la X
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.style.overflow = "";
    });
  }

  // Cerrar clic fuera del contenido
  modal.addEventListener("mousedown", (e) => {
    if (!modalContent.contains(e.target)) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Tomar los datos del formulario
  const formData = new FormData(this);
  const loginData = {
    usuario: formData.get("usuario"),
    password: formData.get("password")
  };

  try {
    const response = await fetch("http://localhost:8080/api/dinamica/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login exitoso ✅", data);

      // acá podrías guardar el token/JWT en localStorage si el back lo devuelve
      // localStorage.setItem("token", data.token);

      alert("Login correcto, bienvenido " + data.nombre);

      // Cerrar modal
      document.getElementById("loginModal").style.display = "none";
      document.body.style.overflow = "";
    } else {
      alert("❌ Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error en login:", error);
    alert("Error al intentar conectar con el servidor");
  }
});

//La lógica para abrir/cerrar se abstrae.
//Si mañana se agrega otro modal, solo hay que llamarlo
// Inicializar modales
initModal("loginModal", "openLoginModal");
