import { createElement } from "./modules/createElement.js";
import { ApiService } from "./services/api-call.service.js";

const loadMoreVideoBtn = document.querySelector(".load-more-video-btn");
const loadMorePrivateVideoBtn = document.querySelector(".load-more-private-video-btn");
const wrapperVideoContent = document.querySelector(".wrapper__video-content");
const makePrivateVideoBtn = document.querySelectorAll(".make-private-video-btn");
const makePublicVideoBtn = document.querySelectorAll(".make-public-video-btn");
const deleteVideoBtn = document.querySelectorAll(".delete-video-btn");
const toggleButtons = document.querySelectorAll(".columns__photo-description-toggle-btn");
const itemVideoMenuToggle = document.querySelectorAll(".wrapper__video-content-item-decoration-menu"); 

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
        const api = await apiService.apiCall(`/my-video/load-more/${skipVideo}`, "GET");
        const dataVideo = await api.json();

        if (dataVideo.length < 2) {
            this.remove();
        }

        dataVideo.forEach((el) => {
            const wrapperVideoContentItem = createElement(wrapperVideoContent, "div", { class: "wrapper__video-content-item" });
            wrapperVideoContentItem.setAttribute("id", el.idVideo);

            const titleVideo = createElement(wrapperVideoContentItem, "h4");
            titleVideo.innerHTML = el.name;

            const menuAndDelBtnContainer = createElement(wrapperVideoContentItem, "div", { class: "wrapper__video-content-item-container-del-btn-menu" });
            const videoMenuDecorationContainer = createElement(menuAndDelBtnContainer, "div", { class: "wrapper__video-content-item-decoration-menu" });

            createElement(videoMenuDecorationContainer, "div", { class: "wrapper__video-content-item-decoration-menu-decoration" });
            createElement(videoMenuDecorationContainer, "div", { class: "wrapper__video-content-item-decoration-menu-decoration" });
            createElement(videoMenuDecorationContainer, "div", { class: "wrapper__video-content-item-decoration-menu-decoration" });

            const menu = createElement(menuAndDelBtnContainer, "ul", { class: "wrapper__video-content-item-menu-hide" });

            if(window.location.href.includes("private-video")) {
                const menuItemVideo = createElement(menu, "li");
                const makePublicVideoBtn = createElement(menuItemVideo, "button");

                makePublicVideoBtn.innerHTML = "Make public video";
                makePublicVideoBtn.setAttribute("id", el.idVideo);

                makePublicVideoBtn.addEventListener("click", async function () {
                    await apiService.apiCall(`/my-video/make-public-video/${this.getAttribute("id")}`, "PUT");
                    skipVideo-=1;
                    this.parentElement.parentElement.parentElement.parentElement.remove();
                });
            } else {
                const menuItemPrivateVideo = createElement(menu, "li");
                const makePrivateVideoBtn = createElement(menuItemPrivateVideo, "button");

                makePrivateVideoBtn.setAttribute("id", el.idVideo);
                makePrivateVideoBtn.innerHTML = "Make private video";

                makePrivateVideoBtn.addEventListener("click", async function () {
                    await apiService.apiCall(`/my-video/make-private-video/${this.getAttribute("id")}`, "PUT");
                    skipVideo-=1;
                    this.parentElement.parentElement.parentElement.parentElement.remove();
                });
            }
            const menuItemChangeParamVideo = createElement(menu, "li");
            const changeParamsVideoLink = createElement(menuItemChangeParamVideo, "a", { href: `/my-video/change-params-video/${el.idVideo}` });

            const changeParamVideoBtn = createElement(changeParamsVideoLink, "button");
            changeParamVideoBtn.innerHTML = "Change params video";

            const menuItemDeleteVideo = createElement(menu, "li");
            const deleteVideoBtn = createElement(menuItemDeleteVideo, "button", {class: "delete-video-btn", id: el.idVideo});
            deleteVideoBtn.innerHTML = "Delete video";

            deleteVideoBtn.addEventListener("click", async function () {
                await apiService.apiCall(`/my-video/delete/${this.getAttribute("id")}`, "DELETE", JSON.stringify({ isPrivate: false }));
                this.parentElement.parentElement.parentElement.parentElement.remove();
                skipVideo-=1;
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

            videoMenuDecorationContainer.addEventListener("click", function () {
                this.nextElementSibling.classList.toggle("wrapper__video-content-item-menu-show");
            });
            
        });
    });
} 

if(loadMorePrivateVideoBtn) {
    loadMorePrivateVideoBtn.addEventListener("click", async function () {
        skipVideo += 2;
        const api = await apiService.apiCall(`/my-video/load-more-private/${skipVideo}`, "GET");
        const dataVideo = await api.json();

        if (dataVideo.length < 2) {
            this.remove();
        }

        dataVideo.forEach((el) => {
            const wrapperVideoContentItem = createElement(wrapperVideoContent, "div", { class: "wrapper__video-content-item" });
            wrapperVideoContentItem.setAttribute("id", el.idVideo);

            const titleVideo = createElement(wrapperVideoContentItem, "h4");
            titleVideo.innerHTML = el.name;

            const menuAndDelBtnContainer = createElement(wrapperVideoContentItem, "div", { class: "wrapper__video-content-item-container-del-btn-menu" });
            const videoMenuDecorationContainer = createElement(menuAndDelBtnContainer, "div", { class: "wrapper__video-content-item-decoration-menu" });

            createElement(videoMenuDecorationContainer, "div", { class: "wrapper__video-content-item-decoration-menu-decoration" });
            createElement(videoMenuDecorationContainer, "div", { class: "wrapper__video-content-item-decoration-menu-decoration" });
            createElement(videoMenuDecorationContainer, "div", { class: "wrapper__video-content-item-decoration-menu-decoration" });

            const menu = createElement(menuAndDelBtnContainer, "ul", { class: "wrapper__video-content-item-menu-hide" });

            if(window.location.href.includes("private-video")) {
                const menuItemVideo = createElement(menu, "li");
                const makePublicVideoBtn = createElement(menuItemVideo, "button");

                makePublicVideoBtn.innerHTML = "Make public video";
                makePublicVideoBtn.setAttribute("id", el.idVideo);

                makePublicVideoBtn.addEventListener("click", async function () {
                    await apiService.apiCall(`/my-video/make-public-video/${this.getAttribute("id")}`, "PUT");
                    skipVideo-=1;
                    this.parentElement.parentElement.parentElement.parentElement.remove();
                });
            } else {
                const menuItemPrivateVideo = createElement(menu, "li");
                const makePrivateVideoBtn = createElement(menuItemPrivateVideo, "button");

                makePrivateVideoBtn.setAttribute("id", el.idVideo);
                makePrivateVideoBtn.innerHTML = "Make private video";

                makePrivateVideoBtn.addEventListener("click", async function () {
                    await apiService.apiCall(`/my-video/make-private-video/${this.getAttribute("id")}`, "PUT");
                    skipVideo-=1;
                    this.parentElement.parentElement.parentElement.parentElement.remove();
                });
            }

            const menuItemChangeParamVideo = createElement(menu, "li");
            const changeParamsVideoLink = createElement(menuItemChangeParamVideo, "a", { href: `/my-video/change-params-private-video/${el.idVideo}` });

            const changeParamVideoBtn = createElement(changeParamsVideoLink, "button");
            changeParamVideoBtn.innerHTML = "Change params video";

            const menuItemDeleteVideo = createElement(menu, "li");
            const deleteVideoBtn = createElement(menuItemDeleteVideo, "button", {class: "delete-video-btn", id: el.idVideo});
            deleteVideoBtn.innerHTML = "Delete video";

            deleteVideoBtn.addEventListener("click", async function () {
                await apiService.apiCall(`/my-video/delete/${this.getAttribute("id")}`, "DELETE", JSON.stringify({ isPrivate: true }));
                this.parentElement.parentElement.parentElement.parentElement.remove();
                skipVideo-=1;
            });

            createElement(wrapperVideoContentItem, "video", {
                "data-role": "video-player",
                "data-src": `"/my-video/private-video/${el.idVideo}"`
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

            videoMenuDecorationContainer.addEventListener("click", function () {
                this.nextElementSibling.classList.toggle("wrapper__video-content-item-menu-show");
            });
            
        });
    }); 
}

if(makePrivateVideoBtn) {
    for(let i = 0; i < makePrivateVideoBtn.length; i++) {
        makePrivateVideoBtn[i].addEventListener("click", async function () {
            await apiService.apiCall(`/my-video/make-private-video/${this.getAttribute("id")}`, "PUT");
            skipVideo-=1;
            this.parentElement.parentElement.parentElement.parentElement.remove();
        });
    }
}

if(makePublicVideoBtn) {
    for(let i = 0; i < makePublicVideoBtn.length; i++) {
        makePublicVideoBtn[i].addEventListener("click", async function () {
            await apiService.apiCall(`/my-video/make-public-video/${this.getAttribute("id")}`, "PUT");
            skipVideo-=1;
            this.parentElement.parentElement.parentElement.parentElement.remove();
        });
    }
}

for (let i = 0; i < deleteVideoBtn.length; i++) {
    deleteVideoBtn[i].addEventListener("click", async function () {

        if(window.location.href.includes("my-video/private-video")) {
            await apiService.apiCall(`/my-video/delete/${this.getAttribute("id")}`, "DELETE", JSON.stringify({ isPrivate: true }));
            this.parentElement.parentElement.parentElement.parentElement.remove()
            skipVideo-=1;

            return;
        }
        await apiService.apiCall(`/my-video/delete/${this.getAttribute("id")}`, "DELETE", JSON.stringify({ isPrivate: false }));
        this.parentElement.parentElement.parentElement.parentElement.remove()
        skipVideo-=1;
    });
}

for(let i = 0; i < itemVideoMenuToggle.length; i++) {
    itemVideoMenuToggle[i].addEventListener("click", function () {
        this.nextElementSibling.classList.toggle("wrapper__video-content-item-menu-show");
    });
}
