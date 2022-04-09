import { createElement } from "../../../common/createElement.js";
import { ApiService } from "../../../services/api-call.service.js";

const wrapperArticles = document.querySelector(".wrapper__articles");
const loadMoreArticles = document.querySelector(".load-more-articles-btn");
const wrapperArticleDecorationMenu = document.querySelectorAll(".wrapper__article-item-decoration-menu");
const deleteBtn = document.querySelectorAll(".delete-article-btn");

const apiService = new ApiService();
let skipArticles = 0;

if(loadMoreArticles) {
    loadMoreArticles.addEventListener("click", async function () {
        skipArticles += 5;
        const api = await apiService.apiCall(`/my-articles/load-more-articles/${skipArticles}`, "GET");
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

            const wrapperArticleDecorationMenu = createElement(wrapperItemArticleLogo, "div", { class: "wrapper__article-item-decoration-menu" });

            wrapperArticleDecorationMenu.addEventListener("click", async function () {
                await apiService.apiCall(`/my-articles/${this.getAttribute("id")}`, "DELETE");
                this.nextElementSibling.classList.toggle("wrapper__article-item-menu-show");
            });

            createElement(wrapperArticleDecorationMenu, "div", { class: "wrapper__article-item-decoration-menu-decoration" });
            createElement(wrapperArticleDecorationMenu, "div", { class: "wrapper__article-item-decoration-menu-decoration" });
            createElement(wrapperArticleDecorationMenu, "div", { class: "wrapper__article-item-decoration-menu-decoration" });

            const articleMenuList = createElement(wrapperItemArticleLogo, "ul", { class: "wrapper__article-item-menu-hide" });
            const itemMenuList = createElement(articleMenuList, "li");
            const deleteBtn = createElement(itemMenuList, "button", { class: "delete-article-btn", id: el.idArticle });
            console.log(this.getAttribute("id"));
            deleteBtn.addEventListener("click", async function () {
                await apiService.apiCall(`/my-articles/`, "DELETE");
                this.parentElement.parentElement.parentElement.parentElement.remove();
                skipArticles-=1;
            });
            deleteBtn.innerHTML = "Delete article";

            const logoTheme = createElement(wrapperItemArticle, "h4", { class: "wrapper__article-theme" });
            logoTheme.innerHTML = `<strong>Theme: </strong> ${el.theme}`;

            const logoDate = createElement(wrapperItemArticle, "h6", { class: "wrapper__article-date pt-10" });
            logoDate.innerHTML = `${el.date}`;

            const link = createElement(wrapperItemArticle, "a", { href: `/my-articles/${el.idArticle}`, class: "read-article-link" });
            link.innerHTML = "Read";
        });
    });
};

for(let i = 0; i < wrapperArticleDecorationMenu.length; i++) {
    wrapperArticleDecorationMenu[i].addEventListener("click", function () {
        this.nextElementSibling.classList.toggle("wrapper__article-item-menu-show");
    });
}

for(let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", async function () {
        await apiService.apiCall(`/my-articles/${this.getAttribute("id")}`, "DELETE");
        this.parentElement.parentElement.parentElement.parentElement.remove();
        skipArticles-=1;
    });
}
