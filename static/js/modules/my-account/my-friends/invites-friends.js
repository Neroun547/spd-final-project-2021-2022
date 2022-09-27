import { createElement } from "../../../common/createElement.js";
import { ApiService } from "../../../services/api-call.service.js";

const loadMoreInvitesBtn = document.querySelector(".load-more-invites");
const wrapperAbout = document.querySelector(".wrapper__about");
const deleteInvites = document.querySelectorAll(".delete-invite");

let countInvites = 0;

const apiService = new ApiService();

if(loadMoreInvitesBtn) {
    loadMoreInvitesBtn.addEventListener("click", async function () {
        countInvites+=5;
        const api = await apiService.apiCall("/add-friend/load-more", "POST", JSON.stringify({skip: countInvites}));

        const data = await api.json();

        data.forEach(el => {
            const wrapperItemInvite = createElement(wrapperAbout, "div", { class: "wrapper__item-invite mb-10 mt-10" });
            createElement(wrapperItemInvite, "img", { src: el.idAvatar ? `/my-account/avatar/${el.idAvatar}` : "/img/user.png"});
            createElement(wrapperItemInvite, "span").innerHTML = el.username;
            const linkAccept = createElement(wrapperItemInvite, "a", { href: `/add-friend/accept-invite/${el.username}` });
            createElement(linkAccept, "button", { class: "button primary border-radius" }).innerHTML = "Accept invite";

            createElement(wrapperItemInvite, "button", { class: "delete-invite" }).innerHTML = "&#10006;";
        }); 

        if(!data.length < 5) {
            this.remove();
        }
    });
}

if(deleteInvites.length) {
    for(let i = 0; i < deleteInvites.length; i++) {
        deleteInvites[i].addEventListener("click", async function () {
            await apiService.apiCall(`/add-friend/delete-invite/${this.getAttribute("id")}`, "DELETE");

            this.parentElement.remove();
        });
    }
}

