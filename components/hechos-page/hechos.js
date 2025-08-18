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

//La lógica para abrir/cerrar se abstrae.
//Si mañana se agrega otro modal, solo hay que llamarlo

// Inicializar modales
initModal("loginModal", "openLoginModal");
initModal("hechoModal", "openHechoModal");

//MANEJO DE ETIQUETAS EN EL FORM CARGAR HECHO
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