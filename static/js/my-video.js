import { createElement } from "./modules/createElement.js";
import { ApiService } from "./services/api-call.service.js";

const loadMoreVideoBtn = document.querySelector(".load-more-video-btn");
const wrapperVideoContent = document.querySelector(".wrapper__video-content");
const deleteVideoBtn = document.querySelectorAll(".delete-video-btn");
const toggleButtons = document.querySelectorAll(".columns__photo-description-toggle-btn");

for(let i = 0; i < toggleButtons.length; i++){
    toggleButtons[i].addEventListener("click", function () {
        this.nextElementSibling.classList.toggle("show-description");
    });
}

let skipVideo = 0;

const apiService = new ApiService();

if(loadMoreVideoBtn) {
    loadMoreVideoBtn.addEventListener("click", async function () {
        skipVideo += 2;
        const api = await apiService.apiCall("/my-video/load-more", "POST",  JSON.stringify({skip: skipVideo}));
        const dataVideo = await api.json();

        if (dataVideo.length < 2) {
            this.remove();
        }

        dataVideo.forEach((el) => {
            const wrapperVideoContentItem = createElement(wrapperVideoContent, "div", { class: "wrapper__video-content-item" });
            wrapperVideoContentItem.setAttribute("id", el.idVideo);

            const deleteVideoBtn = createElement(wrapperVideoContentItem, "button", { class: "delete-video-btn button alert mb-5" });
            deleteVideoBtn.innerHTML = "Delete";

            deleteVideoBtn.addEventListener("click", async function () {
                await apiService.apiCall(`/my-video/delete/${this.parentElement.getAttribute("id")}`, "DELETE");
                this.parentElement.remove();
            });

            createElement(wrapperVideoContentItem, "video", {
                "data-role": "video-player",
                "data-src": `"/my-video/${el.idVideo}"`
            });

            if(el.description) {
                const buttonShowDescription = createElement(wrapperVideoContentItem, "button", { class: "columns__photo-description-toggle-btn mt-2 w-100 button primary" });
                buttonShowDescription.innerHTML = "Show description";
                buttonShowDescription.addEventListener("click", function () {
                    this.nextElementSibling.classList.toggle("show-description");
                });

                const columnsPhotoDescription = createElement(wrapperVideoContentItem, "div", { class: "columns__photo-description" });
                columnsPhotoDescription.innerHTML = el.description;
            }
        });
    });
}

for (let i = 0; i < deleteVideoBtn.length; i++) {
    deleteVideoBtn[i].addEventListener("click", async function () {
        await apiService.apiCall(`/my-video/delete/${this.parentElement.getAttribute("id")}`, "DELETE");
        this.parentElement.remove();
    });
}
