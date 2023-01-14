import { ApiService } from "../../../services/api-call.service.js";

const changeParamsArticleForm = document.getElementById("change-params-article-form");
const wrapperMessage = document.querySelector(".wrapper__message-signup");
const apiService = new ApiService();
const idArticle = window.location.pathname.replace("/my-articles/change-params-form/", "");

changeParamsArticleForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
        const api = await apiService.apiCall(`/my-articles/${idArticle}`, "PATCH", JSON.stringify({
            title: e.target[0].value,
            theme: e.target[1].value
        }));
        const response = await api.json();

        if (!api.ok) {
            wrapperMessage.classList.remove("bd-green");
            wrapperMessage.classList.add("bd-red");
            wrapperMessage.style.display = "block";
            wrapperMessage.innerHTML = response.message;

            return;
        }
        wrapperMessage.classList.remove("bd-red");
        wrapperMessage.classList.add("bd-green");
        wrapperMessage.style.display = "block";
        wrapperMessage.innerHTML = response.message;
    } catch(e) {
        wrapperMessage.classList.remove("bd-green");
        wrapperMessage.classList.add("bd-red");
        wrapperMessage.style.display = "block";
        wrapperMessage.innerHTML = "Server error";
    }
});

