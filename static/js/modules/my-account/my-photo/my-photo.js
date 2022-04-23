import { createElement } from "../../../common/createElement.js";
import { openDialogActions } from "../../../common/photo-dialog.js";
import { ApiService } from "../../../services/api-call.service.js";

const toggleButtons = document.querySelectorAll(".columns__photo-description-toggle-btn");
const loadMorePhotoBtn = document.querySelector(".load-more-photo-btn");
const wrapperColumnsPhoto = document.querySelector(".wrapper__columns-photo");
const wrapperColumnsPhotoImg = document.querySelectorAll(".wrapper__column-photo-img");

for(let i = 0; i < toggleButtons.length; i++){
    toggleButtons[i].addEventListener("click", function () {
        this.nextElementSibling.classList.toggle("show-description");
    });
}

let skip = 0;

const apiService = new ApiService();

if(loadMorePhotoBtn) {

    loadMorePhotoBtn.addEventListener("click", async function () {
        skip+=4;
        const api = await apiService.apiCall(`/user/photo/load-more-photo/${skip}`, "GET");

        const data = await api.json();

        if(data.length < 4){
            this.style.display = "none";
        }
    
        data.forEach(el => {
            const wrapper = createElement(wrapperColumnsPhoto, "div", { class:"columns__photo-item", id: el.idPhoto });
            const wrapperColumnsPhotoImg = createElement(wrapper, "img", { src: `/user/photo/item/${el.idPhoto}`, id: el.idPhoto, class: "wrapper__column-photo-img"});
            wrapperColumnsPhotoImg.addEventListener("click", function () {
                new Promise((resolve, reject) => {
                    openDialogActions(`/user/photo/item/${this.getAttribute("id")}`, this.getAttribute("id"), true, resolve);
                })
                .then((n) => {
                    skip-=n;
                })
            });
            
            createElement(wrapper, "div", { class: "columns__photo-theme" }).innerHTML = `Theme: ${el.theme}`;
        
            if(el.description){
                const showDescriptionBtn = createElement(wrapper, "button", { class: "columns__photo-description-toggle-btn button primary" });
                showDescriptionBtn.innerHTML = "Show description";

                createElement(wrapper, "div", { class: "columns__photo-description" }).innerHTML = el.description;
                showDescriptionBtn.addEventListener("click", function () {
                    this.nextElementSibling.classList.toggle("show-description");
                });
            }
        });
    });
}

for(let i = 0; i < wrapperColumnsPhotoImg.length; i++) {
    wrapperColumnsPhotoImg[i].addEventListener("click", async function () {
        new Promise((resolve, reject) => {
            openDialogActions(`/user/photo/item/${this.getAttribute("id")}`, this.getAttribute("id"), true, resolve);
        })
        .then((n) => {
            skip-=n;
        })
    }); 
} 