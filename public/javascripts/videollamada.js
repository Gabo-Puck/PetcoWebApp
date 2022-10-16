const socket = io("/");
// const videoGrid = document.getElementById('video-grid')

const myPeer = new Peer(undefined, {});
const myVideo = document.getElementById("you");
const user = document.getElementById("user");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messagesBox = document.getElementById("messages");

const activeButton = "btn-light";
const deactiveButton = "btn-warning";

const microphoneButton = document.getElementById("buttonMicrophone");
const cameraButton = document.getElementById("buttonCamera");

const iconMicrophoneActive = "fa-microphone";
const iconMicrophoneDeactive = "fa-microphone-slash";

const iconCameraActive = "fa-video";
const iconCameraDeactive = "fa-video-slash";

var isVideo = false;
var isAudio = false;
myVideo.muted = true;

navigator.permissions.query({ name: "camera" }).then((result) => {
  if (result.state === "granted") {
    cameraButton.classList.remove("isActive");
    isVideo = true;
  }
  if (result.state === "denied") {
    cameraButton.classList.add("isActive");
  }
  buttonControlDevices(cameraButton, iconCameraActive, iconCameraDeactive);
});

navigator.permissions.query({ name: "microphone" }).then((result) => {
  if (result.state === "granted") {
    microphoneButton.classList.remove("isActive");
    isAudio = true;
  }
  if (result.state === "denied") {
    microphoneButton.classList.add("isActive");
  }
});
buttonControlDevices(
  microphoneButton,
  iconMicrophoneActive,
  iconMicrophoneDeactive
);

// Bueno para eso de validar sería tipo: Ponerle una id también a la etiqueta form
// luego haces
let videoStreamClient;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
    videoStreamClient = stream;
    // if (!microphoneButton.classList.contains("isActive")) {
    microphoneButton.classList.add("isActive");
    //   microphoneButton.classList.add(iconMicrophoneActive);

    // }
    // if(!cameraButton.classList.contains("isActive")){
    cameraButton.classList.add("isActive");
    //   cameraButton.classList.add(iconCameraActive);
    // }
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
  })
  .catch((error) => console.log(error));

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function buttonControlDevices(controlButton, iconActivate, iconDeactivate) {
  if (controlButton.classList.contains("isActive")) {
    //shit para desactivar audio y cambiar icono y color del boton
    controlButton.classList.remove(activeButton);
    controlButton.classList.add(deactiveButton);
    controlButton.classList.remove("isActive");
    controlButton.querySelector("i").classList.remove(iconActivate);
    controlButton.querySelector("i").classList.add(iconDeactivate);
  } else {
    //shit para activar audio y cambiar icono y color del boton
    controlButton.classList.add("isActive");
    controlButton.classList.remove(deactiveButton);
    controlButton.classList.add(activeButton);
    controlButton.querySelector("i").classList.remove(iconDeactivate);
    controlButton.querySelector("i").classList.add(iconActivate);
  }
}

microphoneButton.addEventListener("click", (e) => {
  const enabled = videoStreamClient.getAudioTracks()[0].enabled;
  buttonControlDevices(
    microphoneButton,
    iconMicrophoneActive,
    iconMicrophoneDeactive
  );
  if (enabled) {
    videoStreamClient.getAudioTracks()[0].enabled = false;
  } else {
    videoStreamClient.getAudioTracks()[0].enabled = true;
  }
});

cameraButton.addEventListener("click", (e) => {
  const enabled = videoStreamClient.getVideoTracks()[0].enabled;
  // if (cameraButton.classList.contains("isActive")) {
  //   //shit para desactivar video y cambiar icono y color del boton
  //   cameraButton.classList.remove("isActive");
  //   cameraButton.classList.remove(activeButton);
  //   cameraButton.classList.add(deactiveButton);
  //   cameraButton.querySelector("i").classList.remove(iconCameraActive);
  //   cameraButton.querySelector("i").classList.add(iconCameraDeactive);
  // } else {
  //   //shit para activar video y cambiar icono y color del boton
  //   cameraButton.classList.add("isActive");
  //   cameraButton.classList.remove(deactiveButton);
  //   cameraButton.classList.add(activeButton);
  //   cameraButton.querySelector("i").classList.remove(iconCameraDeactive);
  //   cameraButton.querySelector("i").classList.add(iconCameraActive);
  // }
  buttonControlDevices(cameraButton, iconCameraActive, iconCameraDeactive);
  if (enabled) {
    videoStreamClient.getVideoTracks()[0].enabled = false;
  } else {
    videoStreamClient.getVideoTracks()[0].enabled = true;
  }
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
  messagesBox.scrollTop = messagesBox.scrollHeight;
});
