let isCorrect;
const notificacionesIconNavbar = document.querySelector(
  "#notificacionesIconNavbar"
);

notificacionesIconNavbar.addEventListener("click", (e) => {
  marcarLeidoNotificaciones();
});

const offCavnasNotificaciones = document.getElementById(
  "notificacionesOffCanvas"
);
offCavnasNotificaciones.addEventListener("hidden.bs.offcanvas", (event) => {
  // do something...

  console.log("doing something");
  if (isCorrect) {
    const notificacionesSinLeerCountSpan = document.querySelector(
      "#notificacionesSinLeerCount"
    );
    console.log("is correct");
    countNotificacionesNoLeidas = 0;
    idNotificacionesNoLeidas = [];
    notificacionesSinLeerCountSpan.classList.add("d-none");
    notificacionesSinLeerCountSpan.textContent = "";
    notificacionesNoLeidasRef.forEach((ref) => {
      ref.classList.remove("list-group-item-warning");
      ref.classList.add("list-group-item-light");
    });
  }
});

function marcarLeidoNotificaciones() {
  if (countNotificacionesNoLeidas > 0) {
    fetch("/petco/notificaciones/leido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idNotificaciones: idNotificacionesNoLeidas }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res == "ok") {
          isCorrect = true;
        } else {
          isCorrect = false;
        }
      });
  }
}
