import { createElement } from "../../../common/createElement.js";
import { ApiService } from "../../../services/api-call.service.js";

const loadMoreMusics = document.querySelector(".load-more-musics-btn");
let skipMusics = 0;

const apiService = new ApiService();

if(loadMoreMusics) {
    loadMoreMusics.addEventListener("click", async function () {
        const user = this.getAttribute("id");
        skipMusics += 5;
    
        const api = await apiService.apiCall(`/user/load-more-music/${skipMusics}?user=${user}`, "GET");
        const data = await api.json();
    
        if (data.length < 4) {
            loadMoreMusics.remove();
        }

        const wrapperMusics = document.querySelector(".wrapper__musics");

        data.forEach((el) => {
            const wrapperMusicsItem = createElement(wrapperMusics, "div", { class: "wrapper__musics-item" });
            const wrapperNameAuthor = createElement(
                wrapperMusicsItem,
                "div",
                { class: "wrapper__musics-item-author-name mt-5 mb-5" });

            wrapperNameAuthor.innerHTML = `${el.author} - ${el.name}`

            createElement(wrapperMusicsItem, "audio", {
                "data-src": `"/my-musics/${el.idMusic}"`,
                "data-role": "audio-player",
                class: "light"
            });
        });
    });
}
