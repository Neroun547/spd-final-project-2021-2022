import { createElement } from "../../../common/createElement.js";
import { ApiService } from "../../../services/api-call.service.js";

const loadMoreMusics = document.querySelector(".load-more-musics-btn");
const deleteMusic = document.querySelectorAll(".delete-music-btn");
const countTrack = document.querySelector(".count__track");
const wrapperMusics = document.querySelector(".wrapper__musics");
let skipMusics = 0;

const apiService = new ApiService();

if(loadMoreMusics) {
    loadMoreMusics.addEventListener("click", async function () {
        skipMusics += 5;
        const api = await apiService.apiCall(`/my-musics/load-more-musics/${skipMusics}`, "GET");
        const data = await api.json();

        if(data.length < 5) {
            loadMoreMusics.remove();
        }
        data.forEach((el) => {
            const wrapperMusicsItem = createElement(wrapperMusics, "div", { class: "wrapper__musics-item", id: el.idMusic });
            const wrapperNameAuthor = createElement(
                wrapperMusicsItem,
                "div",
                { class: "wrapper__musics-item-author-name mt-5 mb-5" });

            wrapperNameAuthor.innerHTML = `${el.author} - ${el.name}`

            const deleteMusic = createElement(wrapperNameAuthor, "button", { class: "button alert delete-music-btn" });
            deleteMusic.innerHTML = "Delete";
            
            deleteMusic.addEventListener("click", async function () {
                const element = this.parentElement.parentElement;
        
                await apiService.apiCall(`/my-musics/delete/${element.getAttribute("id")}`, "DELETE");
                element.remove();
        
                countTrack.innerHTML = String(Number(countTrack.textContent) - 1);
                skipMusics-=1;
            });

            createElement(wrapperMusicsItem, "audio", {
                "data-src": `"/my-musics/${el.idMusic}"`,
                "data-role": "audio-player",
                class: "light",
                preload: "metadata"
            });
        });
    });
}
for (let i = 0; i < deleteMusic.length; i++) {
    deleteMusic[i].addEventListener("click", async function () {
        const element = this.parentElement.parentElement;

        await apiService.apiCall(`/my-musics/delete/${element.getAttribute("id")}`, "DELETE");
        element.remove();

        countTrack.innerHTML = String(Number(countTrack.textContent) - 1);

        skipMusics-=1;
    });
}