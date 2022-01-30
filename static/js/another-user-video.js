import { createElement } from "./modules/createElement.js";
import { ApiService } from "./services/api-call.service.js"; 

const loadMoreVideoBtn = document.querySelector(".load-more-video-btn");
const wrapperVideoContent = document.querySelector(".wrapper__video-content");
const toggleButtons = document.querySelectorAll(".columns__photo-description-toggle-btn");

const apiService = new ApiService();

for(let i = 0; i < toggleButtons.length; i++){
    toggleButtons[i].addEventListener("click", function () {
        this.nextElementSibling.classList.toggle("show-description");
    });
}

let skipVideo = 0;

if(loadMoreVideoBtn) {
loadMoreVideoBtn.addEventListener("click", async function () {
    skipVideo += 2;
    const user = this.getAttribute("id");
    
    const api = await apiService.apiCall("/user/load-more-video", "POST", JSON.stringify({skip: skipVideo,username: user})); 

    const dataVideo = await api.json();

    if (dataVideo.length < 2) {
        this.remove();
    }

    dataVideo.forEach((el) => {
        const wrapperVideoContentItem = createElement(wrapperVideoContent, "div", { class: "wrapper__video-content-item" });
        wrapperVideoContentItem.setAttribute("id", el.idVideo);

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
        }
        const columnsPhotoDescription = createElement(wrapperVideoContentItem, "div", { class: "columns__photo-description" });
        columnsPhotoDescription.innerHTML = el.description;
    });
});
}