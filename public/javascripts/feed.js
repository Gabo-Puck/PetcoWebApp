import { initSocket } from "/javascripts/socketUtils.js"; //Importamos la función para inicilizar el socket
socket = initSocket(init);
function init() {}
import { notificacionNueva } from "/javascripts/globalListeners.js"; //Importamos la función para inicilizar el socket
notificacionNueva();
