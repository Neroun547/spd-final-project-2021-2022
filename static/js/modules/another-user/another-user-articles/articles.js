import { createElement } from "../../../common/create-element.js";
import { ApiService } from "../../../services/api-call.service.js";

const wrapperArticles = document.querySelector(".wrapper__articles");
const loadMoreArticles = document.querySelector(".load-more-articles-btn");
const wrapperSearchArticleInput = document.querySelector(".wrapper__search-article-input");
const wrapperAbout = document.querySelector(".wrapper__about");

const apiService = new ApiService();
let skipArticles = 0;
let activeThemeArticles = "";


function makeNewArticles(el) {
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

    const span = createElement(wrapperItemArticle, "span");
    const linkToAuthor = "/user/photo/" + el.author;
    span.innerHTML = `<a href=${linkToAuthor}>${el.author}</a>`;
}

if(loadMoreArticles) {
    loadMoreArticles.addEventListener("click", async function () {

        if(!activeThemeArticles.trim()) {
            skipArticles += 5;
            const api = await apiService.apiCall(`/user/articles/load-more-articles/?username=${wrapperAbout.getAttribute("id")}&skip=${skipArticles}&theme=`, "GET");
            const data = await api.json();

            if(data.length < 5) {
                loadMoreArticles.style.display = "none";
            }
            data.forEach((el) => {
                makeNewArticles(el);
            });

            return;
        }
        skipArticles += 5;
        const api = await apiService.apiCall(`/user/articles/load-more-articles/?theme=${activeThemeArticles}&username=${wrapperAbout.getAttribute("id")}&skip=${skipArticles}`, "GET");
        const data = await api.json();

        if(data.length < 5) {
            loadMoreArticles.style.display = "none";
        }
        data.forEach((el) => {
            makeNewArticles(el);
        });
    });
}

wrapperSearchArticleInput.addEventListener("input", function (e) {
    setTimeout(async () => {
        activeThemeArticles = this.value;
        skipArticles = 0;

        const api = await apiService.apiCall(`/user/articles/load-more-articles/?theme=${this.value}&username=${wrapperAbout.getAttribute("id")}&skip=0`, "GET");
        const data = await api.json();

        if(data.length > 4) {
            loadMoreArticles.style.display = "block";
        } else {
            loadMoreArticles.style.display = "none";
        }

        wrapperArticles.innerHTML = "";

        data.forEach((el) => {
            makeNewArticles(el);
        });
    }, 1000);
});
