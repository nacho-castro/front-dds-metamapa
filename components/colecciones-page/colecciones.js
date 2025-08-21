// Función para cargar colecciones desde la API
async function cargarColecciones() {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  try {
    const response = await fetch("http://localhost:8081/api/colecciones");
    if (!response.ok) throw new Error("Error al obtener colecciones");

    const colecciones = await response.json();

    // Limpiar grid antes de agregar
    grid.innerHTML = "";

    colecciones.forEach(c => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <h3>${c.titulo}</h3>
        <p>${c.descripcion}</p>
        <div class="meta">Algoritmo: ${c.algoritmoConsenso}</div>
         <div class="actions">
          <button onclick="verColeccion(${c.id})">Ver colección</button>
          <button class="delete-btn" onclick="eliminarColeccion(${c.id})">🗑️</button>
           <button onclick="editarColeccion(${c.id})">✏️</button>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    grid.innerHTML = "<p>No hay colecciones disponibles en este momento :( </p>";
  }
}

// Eliminar colección por ID
async function eliminarColeccion(id) {
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

//EDITAR COLECCION POR ID
async function editarColeccion(id) {
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

// Inicializar modal
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

//VALIDAR LOGIN
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

      //guardar el token/JWT o ROL en localStorage si el back lo devuelve
      if (data.rol) {
        localStorage.setItem("rol", data.rol);
      }
      console.log("Rol: " + localStorage.getItem("rol"));

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

// Redirigir a la colección
function verColeccion(id) {
  window.location.href = "../hechos-page/hechos.html?id=" + id;
}

//FORM CARGAR COLECCION
document.getElementById("coleccionForm").addEventListener("submit", async function (e) {
  e.preventDefault();

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

  // Enviar al backend
  try {
    const response = await fetch("http://localhost:8081/api/colecciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coleccionData)
    });

    if (response.ok) {
      alert("Colección creada con éxito ✅");
      cargarColecciones(); // refresca la grilla
    } else {
      alert("❌ Error al crear la colección");
    }
  } catch (err) {
    console.error("Error:", err);
  }
});


//CARGAR FUENTES EN MODAL
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

  // Evento para eliminar una fuente
  fuenteDiv.querySelector(".removeFuenteBtn").addEventListener("click", () => {
    container.removeChild(fuenteDiv);
  });
});

// Inicialización
initModal("loginModal", "openLoginModal");
initModal("coleccionModal", "openColeccionModal");
cargarColecciones();
