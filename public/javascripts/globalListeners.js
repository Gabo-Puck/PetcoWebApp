export function notificacionNueva() {
  socket.on("notificacion-nueva", (notificacion) => {
    console.log("Nueva notificacion", notificacion);
  });
}
