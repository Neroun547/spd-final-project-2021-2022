import { createElement } from "../../../common/create-element.js";
import { ApiService } from "../../../services/api-call.service.js";

const deleteFriendBtn = document.querySelectorAll(".delete-friend");
const loadMoreFriendsBtn = document.querySelector(".load-more-friends-btn");
const wrapperAbout = document.querySelector(".wrapper__about");
const countFriendsLogo = document.getElementById("count-friends");

const apiService = new ApiService();

for (let i = 0; i < deleteFriendBtn.length; i++) {
    deleteFriendBtn[i].addEventListener("click", async function () {
        countFriendsLogo.innerHTML = String(Number(countFriendsLogo.textContent) - 1);
        
        const idFriend = this.getAttribute("id");
        this.parentElement.parentElement.remove();

        await apiService.apiCall("/my-friends/remove", "DELETE",  JSON.stringify({idFriend: idFriend}))
    });
}

let countFriends = 0;

if(loadMoreFriendsBtn) {

loadMoreFriendsBtn.addEventListener("click", async function () {
    countFriends += 5;
    const api = await apiService.apiCall("/my-friends/load-more-friends", "POST", JSON.stringify({skip: countFriends}));

    const data = await api.json();

    if(data.length < 5) {
        this.remove();
    }

    data.forEach(el => {
            const wrapperItemInvite = createElement(wrapperAbout, "div", { class: "wrapper__item-invite mb-5" });
            const wrapperUsernameAvatar = createElement(wrapperItemInvite, "div", { class: "wrapper__item-invite-username-avatar" });
       
            const wrapperSendMessageDelete = createElement(wrapperItemInvite, "div", { class: "wrapper__item-invite-send-message-delete" });
            const linkSendMessage = createElement(wrapperSendMessageDelete, "a", { href: `/chat/${el.username}` });
            const buttonSendMessage = createElement(linkSendMessage, "button", { class: "button primary send-message-btn" });
            const deleteBtn = createElement(wrapperSendMessageDelete, "button", { class: "button alert mb-5 mt-5 delete-friend border-radius", id: el._id });
            
            deleteBtn.innerHTML = "&#10006;";

            deleteBtn.addEventListener("click", async function() {
                countFriendsLogo.innerHTML = String(Number(countFriendsLogo.textContent) - 1);
        
                const idFriend = this.getAttribute("id");
                this.parentElement.parentElement.remove();
        
                await apiService.apiCall("/my-friends/remove", "DELETE",  JSON.stringify({idFriend: idFriend}))
            });

            createElement(buttonSendMessage, "img", { src: "/img/send-message.png" });

            if(el.idAvatar) {           
                createElement(wrapperUsernameAvatar, "img", { src: `/account-settings/avatar/${el.idAvatar}` });
            } else {
                createElement(wrapperUsernameAvatar, "img", {src: `/img/user.png`});
            }
            createElement(wrapperUsernameAvatar, "a", { href: `/user/photo/${el.username}` }).innerHTML = el.username;
        });
    });
}