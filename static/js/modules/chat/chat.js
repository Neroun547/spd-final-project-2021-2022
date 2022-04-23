import { createElement } from "../../common/createElement.js";
import { ApiService } from "../../services/api-call.service.js";
import { socket } from "./socketConnect.js";
import { config } from "../../config/config.js";

const wrapperMessageContent = document.querySelector(".wrapper__messages-content-single");
const noMessageLogo = document.querySelector(".no-message-logo");
const loadMoreMessages = document.querySelector(".load-more-messages");
const wrapperMessageForm = document.querySelector(".wrapper__send-message-form");
const messagesRight = document.querySelectorAll(".message-right");
const apiService = new ApiService();
let count = 0;

//Warning
alert("If you use Cyrillic letters in username chat will not work !");

/* Send message on server */

wrapperMessageForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (noMessageLogo) {
        noMessageLogo.remove();
    }
    const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const id = randLetter + Date.now();

    const wrapperMessage = createElement(wrapperMessageContent, "div", { class: "message-right", id: id });
    wrapperMessage.innerHTML = e.target[0].value;

    socket.emit("message", {message: e.target[0].value, idMessage: id});
    e.target[0].value = "";

    createElement(wrapperMessage, "button", { class: "delete-message-btn"});

    wrapperMessage.addEventListener("mousemove", function (e) {
        const deleteMessageBtn = this.querySelector(".delete-message-btn");
        deleteMessageBtn.style.display = "block";
        deleteMessageBtn.innerHTML = "&#10006;";
        // Onclick because addEventListener don't work in this -_-
        deleteMessageBtn.onclick = function () {  
            deleteMessageBtn.parentElement.remove();
            count-=1;
            socket.emit("delete-message", deleteMessageBtn.parentElement.getAttribute("id"));
        };
    });

    wrapperMessage.addEventListener("mouseleave", function () {
        const deleteMessageBtn = this.querySelector(".delete-message-btn");
        deleteMessageBtn.style.display = "none";
    });
});

/* Chat with user now. Get message. Delete message */

socket.on("message", data => {
    const parseData = JSON.parse(data);

    if (noMessageLogo) {
        noMessageLogo.remove();
    }

    if(document.getElementById(parseData.idMessage)) {
        return;
    }
    const wrapperMessage = createElement(wrapperMessageContent, "div", { class: "message-left", id: parseData.idMessage });
    wrapperMessage.innerHTML = parseData.message;
});

socket.on("delete-message", (id) => {
    const deleteMessage = document.getElementById(id);
    
    if(deleteMessage) {
        count-=1;
        document.getElementById(id).remove();
    }
});

/* Load more block */

if (loadMoreMessages) {
    loadMoreMessages.addEventListener("click", async function () {
        count += 10;

        if(count < 0) {
            count = 0;
        }
        const chatUser = document.location.href.replace(`${config.protocol}://${config.host}:${config.port}/chat/`, "").replace("messages-user/", "");
        const api = await apiService.apiCall("/chat/load-more-messages", "POST", JSON.stringify({ getter: chatUser, skip: count }));

        const messages = await api.json();

        if (!messages.length) {
            this.remove();
            return;
        }

        messages.forEach((el) => {
            if(document.getElementById(el.idMessage)) {
                return;
            }
        
            if (el.sender) {
                const wrapperMessage = createElement(wrapperMessageContent, "div", { class: "message-right", id: el.idMessage }, wrapperMessageContent.children[0]);
                wrapperMessage.innerHTML = el.message;

                createElement(wrapperMessage, "button", { class: "delete-message-btn"});

                wrapperMessage.addEventListener("mousemove", function (e) {
                    const deleteMessageBtn = this.querySelector(".delete-message-btn");
                    deleteMessageBtn.style.display = "block";
                    deleteMessageBtn.innerHTML = "&#10006;";
                    
                    deleteMessageBtn.onclick = function () { 
                        count-=1;
                        deleteMessageBtn.parentElement.remove();                       
                        socket.emit("delete-message", this.parentElement.getAttribute("id"));
                    };
                });
            
                wrapperMessage.addEventListener("mouseleave", function () {
                    const deleteMessageBtn = this.querySelector(".delete-message-btn");
                    deleteMessageBtn.style.display = "none";
                });

                return;
            }

            const wrapperMessage = createElement(wrapperMessageContent, "div", { class: "message-left", id: el.idMessage }, wrapperMessageContent.children[0]);
            wrapperMessage.innerHTML = el.message;
        })
    });
}

/* Delete message btn login in render message */

for(let i = 0; i < messagesRight.length; i++) {
    messagesRight[i].addEventListener("mousemove", function (e) {
        const deleteMessageBtn = this.querySelector(".delete-message-btn");
        deleteMessageBtn.style.display = "block";

        deleteMessageBtn.onclick = function () {
            count-=1;
            this.parentElement.remove();
            socket.emit("delete-message", this.parentElement.getAttribute("id"));
        };
    });

    messagesRight[i].addEventListener("mouseleave", function () {
        const deleteMessageBtn = this.querySelector(".delete-message-btn");
        deleteMessageBtn.style.display = "none";
    });
}
