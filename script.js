const modal = document.getElementById("loginModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");

openBtn.onclick = () => {
  modal.style.display = "block";
};

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//HTTP POST (crear usuario) -> localhost8080/crear user&contraseña USUARIODTO JSON
//HTTP POST (login usuario) -> localhost8080/login user&contraseña USUARIODTO JSON
//200 ok -> JWT
//GET/POST/PUT USUARIO