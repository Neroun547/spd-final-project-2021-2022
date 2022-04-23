import { createElement } from "../../../common/createElement.js";
import { ApiService } from "../../../services/api-call.service.js";

const wrapperArticles = document.querySelector(".wrapper__articles");
const loadMoreArticles = document.querySelector(".load-more-articles-btn");

const apiService = new ApiService();
let skipArticles = 0;

if(loadMoreArticles) {
    loadMoreArticles.addEventListener("click", async function () {
        const user = this.getAttribute("id");
        skipArticles += 5;
        const api = await apiService.apiCall(`/user/articles/load-more-articles/${skipArticles}?user=${user}`, "GET");
        const data = await api.json();

        console.log(data);

        if(data.length < 5) {
            loadMoreArticles.remove();
        }
        data.forEach((el) => {
            const wrapperItemArticle = createElement(wrapperArticles, "div", { class: "wrapper__article" });

            const wrapperItemArticleLogo = createElement(wrapperItemArticle, "div", { class: "wrapper__article-logo" });

            const wrapperItemArticleLogoLogo = createElement(wrapperItemArticleLogo, "h2", { class: "wrapper__article-logo" });
            wrapperItemArticleLogoLogo.innerHTML = `<strong>Title: </strong> ${el.title}`;

            const logoTheme = createElement(wrapperItemArticle, "h4", { class: "wrapper__article-theme" });
            logoTheme.innerHTML = `<strong>Theme: </strong> ${el.theme}`;

            const logoDate = createElement(wrapperItemArticle, "h6", { class: "wrapper__article-date pt-10" });
            logoDate.innerHTML = `${el.date}`;

            const link = createElement(wrapperItemArticle, "a", { href: `/user/articles/article/${el.idArticle}`, class: "read-article-link" });
            link.innerHTML = "Read";
        });
    });
};
