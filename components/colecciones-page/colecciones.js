// Función para cargar colecciones desde la API
async function cargarColecciones() {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  try {
    const response = await fetch("http://localhost:8080/api/colecciones");
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
        <button onclick="verColeccion(${c.id})">Ver colección</button>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    grid.innerHTML = "<p>No hay colecciones disponibles en este momento :( </p>";
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

// Redirigir a la colección
function verColeccion(id) {
  window.location.href = "../hechos-page/hechos.html?id=" + id;
}

// Inicialización
initModal("loginModal", "openLoginModal");
cargarColecciones();
