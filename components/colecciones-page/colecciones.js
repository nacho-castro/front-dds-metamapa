// =========================
// CARGAR COLECCIONES
// =========================
async function cargarColecciones() {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  try {
    const response = await fetch("http://localhost:8081/api/colecciones");
    if (!response.ok) throw new Error("Error al obtener colecciones");

    const colecciones = await response.json();

    // Limpiar grid antes de agregar
    grid.innerHTML = "";

    const rol = localStorage.getItem("rol");

    colecciones.forEach(c => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <h3>${c.titulo}</h3>
        <p>${c.descripcion}</p>
        <div class="meta">Algoritmo: ${c.algoritmoConsenso}</div>
      `;

      const actions = document.createElement("div");
      actions.classList.add("actions");

      // Ver colección (siempre visible)
      const btnVer = document.createElement("button");
      btnVer.textContent = "Ver colección";
      btnVer.addEventListener("click", () => verColeccion(c.id));
      actions.appendChild(btnVer);

      // Acciones solo si ADMINISTRADOR
      if (rol === "ADMINISTRADOR") {
        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("delete-btn");
        btnEliminar.textContent = "🗑️";
        btnEliminar.addEventListener("click", () => eliminarColeccion(c.id));

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️";
        btnEditar.addEventListener("click", () => editarColeccion(c.id));

        actions.appendChild(btnEliminar);
        actions.appendChild(btnEditar);
      }

      card.appendChild(actions);
      grid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    grid.innerHTML = "<p>No hay colecciones disponibles en este momento :( </p>";
  }
}

// =========================
// ELIMINAR COLECCIÓN
// =========================
async function eliminarColeccion(id) {
  const rol = localStorage.getItem("rol");
  if (rol !== "ADMINISTRADOR") {
    alert("No tenés permisos para eliminar colecciones.");
    return;
  }

  if (!confirm("¿Seguro que deseas eliminar esta colección?")) return;

  try {
    const response = await fetch(`http://localhost:8081/api/colecciones/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Colección eliminada ✅");
      cargarColecciones(); // refresca la grilla
    } else {
      alert("❌ Error al eliminar la colección");
    }
  } catch (error) {
    console.error("Error eliminando:", error);
    alert("Error al intentar eliminar la colección");
  }
}

// =========================
// EDITAR COLECCIÓN
// =========================
async function editarColeccion(id) {
  const rol = localStorage.getItem("rol");
  if (rol !== "ADMINISTRADOR") {
    alert("No tenés permisos para editar colecciones.");
    return;
  }

  const nuevoTitulo = prompt("Nuevo título:");
  const nuevaDescripcion = prompt("Nueva descripción:");

  if (!nuevoTitulo || !nuevaDescripcion) return;

  const data = {
    titulo: nuevoTitulo,
    descripcion: nuevaDescripcion,
  };

  try {
    const response = await fetch(`http://localhost:8081/api/colecciones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("Colección actualizada ✅");
      cargarColecciones();
    } else {
      alert("❌ Error al actualizar");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

// =========================
// MODAL GENÉRICO
// =========================
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

// =========================
// LOGIN
// =========================
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const loginData = {
    usuario: formData.get("usuario"),
    password: formData.get("password")
  };

  try {
    const response = await fetch("http://localhost:8080/api/dinamica/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login exitoso ✅", data);

      //guardar datos en localStorage
      localStorage.setItem("rol", data.rol.toUpperCase());
      localStorage.setItem("nombre", data.nombre);
      localStorage.setItem("isLogged", "true");

      alert("Login correcto, bienvenido " + data.nombre);

      // Cerrar modal
      document.getElementById("loginModal").style.display = "none";
      document.body.style.overflow = "";

      manejarSesion();
      cargarColecciones();
    } else {
      alert("❌ Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error en login:", error);
    alert("Error al intentar conectar con el servidor");
  }
});

// =========================
// LOGOUT
// =========================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  alert("Sesión cerrada ✅");
  manejarSesion();
  cargarColecciones();
});

// =========================
// MANEJO DE SESIÓN
// =========================
function manejarSesion() {
  const rol = localStorage.getItem("rol");
  const isLogged = localStorage.getItem("isLogged") === "true";

  const btnLogin = document.getElementById("openLoginModal");
  const btnLogout = document.getElementById("logoutBtn");
  const btnCargarColeccion = document.getElementById("openColeccionModal");

  // ocultar todo por defecto
  if (btnLogin) btnLogin.style.display = "inline-block";
  if (btnLogout) btnLogout.style.display = "none";
  if (btnCargarColeccion) btnCargarColeccion.style.display = "none";

  if (isLogged) {
    if (btnLogin) btnLogin.style.display = "none";
    if (btnLogout) btnLogout.style.display = "inline-block";

    if (rol === "ADMINISTRADOR" && btnCargarColeccion) {
      btnCargarColeccion.style.display = "inline-block";
    }
  }
}

// =========================
// VER COLECCIÓN
// =========================
function verColeccion(id) {
  window.location.href = "../hechos-page/hechos.html?id=" + id;
}

// =========================
// FORM CREAR COLECCIÓN
// =========================
document.getElementById("coleccionForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const rol = localStorage.getItem("rol");
  if (rol !== "ADMINISTRADOR") {
    alert("No tenés permisos para crear colecciones.");
    return;
  }

  const formData = new FormData(this);

  const coleccionData = {
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion"),
    algoritmoConsenso: formData.get("algoritmo"),
    fuentes: []
  };

  // Tomar las fuentes
  document.querySelectorAll("#fuentesContainer .fuente-item").forEach(fuenteDiv => {
    const fuente = {
      tipoFuente: fuenteDiv.querySelector('select[name="tipoFuente"]').value,
      path: fuenteDiv.querySelector('input[name="path"]').value,
      pathInfo: fuenteDiv.querySelector('input[name="pathInfo"]').value
    };
    coleccionData.fuentes.push(fuente);
  });

  console.log("JSON a enviar:", coleccionData);

  try {
    const response = await fetch("http://localhost:8081/api/colecciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coleccionData)
    });

    if (response.ok) {
      alert("Colección creada con éxito ✅");
      cargarColecciones();
    } else {
      alert("❌ Error al crear la colección");
    }
  } catch (err) {
    console.error("Error:", err);
  }
});

// =========================
// CARGAR FUENTES EN FORM
// =========================
document.getElementById("addFuenteBtn").addEventListener("click", () => {
  const container = document.getElementById("fuentesContainer");

  const fuenteDiv = document.createElement("div");
  fuenteDiv.classList.add("fuente-item");

  fuenteDiv.innerHTML = `
  <div class="fuente-fields">
    <div class="field-group">
      <label>Tipo de Fuente</label>
      <select name="tipoFuente" required>
        <option value="">-- Seleccione --</option>
        <option value="DINAMICA">Dinámica</option>
        <option value="ESTATICA">Estática</option>
        <option value="PROXY">Proxy</option>
      </select>
    </div>

    <div class="field-group">
      <label>Path</label>
      <input type="text" name="path" required>
    </div>

    <div class="field-group">
      <label>Path Info</label>
      <input type="text" name="pathInfo" required>
    </div>

    <button type="button" class="removeFuenteBtn">❌ Quitar</button>
  </div>
  <hr>
`;

  container.appendChild(fuenteDiv);

  fuenteDiv.querySelector(".removeFuenteBtn").addEventListener("click", () => {
    container.removeChild(fuenteDiv);
  });
});

// =========================
// INICIO
// =========================
initModal("loginModal", "openLoginModal");
initModal("coleccionModal", "openColeccionModal");
window.addEventListener("DOMContentLoaded", () => {
  manejarSesion();
  cargarColecciones();
});
