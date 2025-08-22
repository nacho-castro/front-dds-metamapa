function initModal(modalId, openBtnId, rolesPermitidos = []) {
  const modal = document.getElementById(modalId);
  const openBtn = document.getElementById(openBtnId);
  if (!modal || !openBtn) return;

  const closeBtn = modal.querySelector(".close");
  const modalContent = modal.querySelector(".modal-content");

  // Abrir (solo si el rol está permitido)
  openBtn.addEventListener("click", () => {
    const rol = localStorage.getItem("rol");
    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rol)) {
      alert("No tenés permisos para acceder a esta función.");
      return;
    }

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  });

  // Cerrar con la X
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.style.overflow = "";
    });
  }

  // Cerrar clic fuera
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
// MANEJO DE SESIÓN HECHOS
// =========================
function manejarSesionHechos() {
  const rol = localStorage.getItem("rol");
  const isLogged = localStorage.getItem("isLogged") === "true";

  const btnCargarHecho = document.getElementById("openHechoModal");

  if (btnCargarHecho) {
    btnCargarHecho.style.display = "none"; // ocultar por defecto
    if (isLogged && (rol === "ADMINISTRADOR" || rol === "CONTRIBUYENTE")) {
      btnCargarHecho.style.display = "inline-block"; // mostrar solo a roles válidos
    }
  }
}

// =========================
// INICIALIZAR MODALES
// =========================
initModal("loginModal", "openLoginModal");
initModal("hechoModal", "openHechoModal", ["ADMINISTRADOR", "CONTRIBUYENTE"]);

// =========================
// MANEJO DE ETIQUETAS
// =========================
const tagInputContainer = document.getElementById("tagInput");
const tagInputField = tagInputContainer.querySelector("input");
let tags = [];

function addTag(text) {
  const tagText = text.trim();
  if (tagText !== "" && !tags.includes(tagText)) {
    tags.push(tagText);

    const tagEl = document.createElement("span");
    tagEl.classList.add("tag");
    tagEl.textContent = tagText;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.innerHTML = "&times;";
    removeBtn.onclick = () => {
      tags = tags.filter(t => t !== tagText);
      tagEl.remove();
    };

    tagEl.appendChild(removeBtn);
    tagInputContainer.insertBefore(tagEl, tagInputField);
  }
  tagInputField.value = "";
}

tagInputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === "," || e.key === " ") {
    e.preventDefault();
    addTag(tagInputField.value);
  }
});

// Para usar en el envío del formulario
function getTags() {
  return tags.map(t => ({ nombre: t })); // formato para tu DTO
}

// =========================
// INICIO
// =========================
window.addEventListener("DOMContentLoaded", () => {
  manejarSesionHechos();
});

