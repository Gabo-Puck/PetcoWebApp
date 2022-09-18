var socket = io({ autoConnect: false });

var dom = {
  loginScreen: document.querySelector("#login"),
  usersConnectedScreen: document.querySelector("#connected-users"),
  chatScreen: document.querySelector("#chat"),
};

var you;

var loginElements = {
  nickNameInput: dom.loginScreen.querySelector(".nickname"),
  nextButton: dom.loginScreen.querySelector(".loginButton"),
};

var connectedUsersElements = {
  boxUsers: dom.usersConnectedScreen.querySelector("#box-users"),
  userList: dom.usersConnectedScreen
    .querySelector("#box-users")
    .querySelector("ul"),
  inputUser: dom.usersConnectedScreen.querySelector("#user"),
  inputMessage: dom.usersConnectedScreen.querySelector("#msg"),
  sendButton: dom.usersConnectedScreen.querySelector("#send"),
};

dom.chatScreen.style.display = "none";
dom.usersConnectedScreen.style.display = "none";

loginElements.nextButton.addEventListener("click", () => {
  var user = loginElements.nickNameInput.value;
  if (user != "") {
    socket.connect();
    socket.emit("new user", user);
    socket.nickname = user;
    dom.usersConnectedScreen.style.display = "block";
    dom.loginScreen.style.display = "none";
  } else {
    alert("First enter a nickname");
  }
});

connectedUsersElements.sendButton.addEventListener("click", () => {
  let user = connectedUsersElements.inputUser.value;
  let message = connectedUsersElements.inputMessage.value;
  socket.emit("private message", { to: user, message: message, from: you });
});

socket.on("update list", (data) => {
  you = socket.nickname;
  console.log(you);
  dom.usersConnectedScreen.querySelector("h2").textContent = `Hi: ${you}!`;
  delete data[you];
  var userList = connectedUsersElements.userList;
  while (userList.lastElementChild) {
    userList.removeChild(userList.lastElementChild);
  }
  console.log(data);
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      var newUser = document.createElement("li");
      newUser.textContent = key;
      userList.appendChild(newUser);
    }
  }
});

socket.on("private message", ({ message, from }) => {
  console.log("Recieved");
  alert(`${from} says: ${message}`);
});
