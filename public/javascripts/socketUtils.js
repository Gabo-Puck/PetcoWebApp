export function initSocket() {
  var socket = io({ autoConnect: false });
  var sessionID;

  $(() => {
    sessionID = localStorage.getItem("petcoWebAppIDSession");
    if (sessionID) {
      socket.auth = { sessionID };
    }
    socket.connect();
  });

  socket.on("session", ({ sessionID, userID }) => {
    //Al socket de esta sesion le añadimos el sessionID para los proximos intentos de reconexión
    socket.auth = { sessionID };
    //Guardamos en el localStorage el sessionID con la key petcoWebAppIDSession
    localStorage.setItem("petcoWebAppIDSession", sessionID);
    //Guardamos la id del usuario para las comunicaciones
    socket.userID = userID;
  });
  return socket;
}
