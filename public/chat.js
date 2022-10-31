const room = window.location.pathname.replace(/\//g, "");
const socket = io(`http://localhost:3000/${room}`);
let user = null;
let btn_message = document.getElementById("btn");
let btn_user = document.getElementById("btnUser");

socket.on("updateMessages", (data) => {
  let messages = data.messages;
  console.log(messages);
  updateMessages(messages);
});

socket.on("loggedUser", async (data) => {
  let user = data.user;
  let warnings = document.getElementById("warnings");

  let warning = `<h5 class="text-center text-warning warning" id="${user}" >User ${user} logged in</h5>`;

  warnings.innerHTML += warning;
  let current = document.getElementById(`${user}`);
  setTimeout(() => {
    current.style.opacity = "0";
  }, 1000);
  setTimeout(() => {
    warnings.removeChild(current);
  }, 3000);
});

function updateMessages(messages) {
  let chat = document.getElementById("chat");

  let listMessages = "<ul class='m-0 p-0 d-flex flex-column'>";
  messages.forEach((message) => {
    if (message.room == room) {
      listMessages += `<li name="${message.user}"  class="p-2 m-2 w-50 rounded ">${message.user}: ${message.message}</li>`;
    }
  });
  listMessages += "</ul>";

  chat.innerHTML = listMessages;

  let myMessages = document.getElementsByName(`${user}`);
  myMessages.forEach((item) => {
    item.classList.add("align-self-end");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  let form_message = document.getElementById("form_message");
  form_message.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  let form_user = document.getElementById("form_user");
  form_user.addEventListener("submit", (e) => {
    e.preventDefault();
  });
});

btn_user.addEventListener("click", () => {
  let userName = document.getElementById("user");

  if (!userName.value) {
    alert("You not filled the user!");
  } else {
    socket.emit("warning", { user: userName.value });
  }
});

socket.on("exists", () => {
  alert("This user is logged in!");
});

socket.on("delete", () => {
  let userName = document.getElementById("user");
  user = userName.value;
  let form_user = document.querySelector("#form_user");
  form_user.remove();
});

btn_message.addEventListener("click", () => {
  let message = document.getElementById("msg");

  if (message.value) {
    socket.emit("createMessage", { message: message.value, user, room });
    message.value = null;
  } else {
    alert("You not filled the message!");
  }
});
