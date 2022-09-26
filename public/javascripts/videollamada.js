const socket = io("/");
// const videoGrid = document.getElementById('video-grid')

const myPeer = new Peer(undefined, {});
const myVideo = document.getElementById("you");
const user = document.getElementById("user");
const ROOM_ID = "10f";
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messagesBox = document.getElementById("messages");
myVideo.muted = true;

// Bueno para eso de validar sería tipo: Ponerle una id también a la etiqueta form
// luego haces

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      // const video = document.createElement('video')
      call.on("stream", (userVideoStream) => {
        addVideoStream(user, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
    socket.on("user-disconnected", (userId) => {
      console.log(userId);
    });
  });

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  // const video = document.createElement('video')
  call.on("stream", (userVideoStream) => {
    addVideoStream(user, userVideoStream);
  });
  call.on("close", () => {
    myVideo.pause();
    myVideo.removeAttribute("src"); // empty source
    myVideo.load();
    myVideo.style.background = "#fff";
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  // videoGrid.append(video)
}

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message != "") {
    socket.emit("send-message", { nombreUsuario, message, ROOM_ID });
    messageInput.value = "";
  }
});

socket.on("message-recieved", ({ nombre, message }) => {
  const messageBox = document.createElement("div");
  messageBox.classList.add("mensajeNuevo");
  const user = document.createElement("p");
  user.classList.add("mensajeNombre");
  const mensaje = document.createElement("p");
  mensaje.classList.add("mensajeContenido");
  user.textContent = nombre;
  mensaje.textContent = message;
  messageBox.appendChild(user);
  messageBox.appendChild(mensaje);
  messagesBox.appendChild(messageBox);
});
