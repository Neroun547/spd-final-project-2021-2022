import { createElement } from "../../../common/create-element.js";
import { ApiService } from "../../../services/api-call.service.js";

const wrapperArticles = document.querySelector(".wrapper__articles");
const loadMoreArticles = document.querySelector(".load-more-articles-btn");
let wrapperArticleDecorationMenuElements = document.querySelectorAll(".wrapper__article-item-decoration-menu");
const deleteBtn = document.querySelectorAll(".delete-article-btn");
const wrapperSearchArticleInput = document.querySelector(".wrapper__search-article-input");
const wrapperAbout = document.querySelector(".wrapper__about");

let activeThemeArticles = "";
let skipArticles = 0;

function makeNewArticles(el) {
    const wrapperItemArticle = createElement(wrapperArticles, "div", { class: "wrapper__article mt-5 mb-5" });

    const wrapperItemArticleLogo = createElement(wrapperItemArticle, "div", { class: "wrapper__article-logo" });

    const wrapperItemArticleLogoLogo = createElement(wrapperItemArticleLogo, "h2", { class: "wrapper__article-logo" });
    wrapperItemArticleLogoLogo.innerHTML = `<strong>Title: </strong> ${el.title}`;

    const wrapperArticleDecorationMenu = createElement(wrapperItemArticleLogo, "div", { class: "wrapper__article-item-decoration-menu" });

    wrapperArticleDecorationMenu.addEventListener("click", async function () {
        this.nextElementSibling.classList.toggle("wrapper__article-item-menu-show");
    });

    createElement(wrapperArticleDecorationMenu, "div", { class: "wrapper__article-item-decoration-menu-decoration" });
    createElement(wrapperArticleDecorationMenu, "div", { class: "wrapper__article-item-decoration-menu-decoration" });
    createElement(wrapperArticleDecorationMenu, "div", { class: "wrapper__article-item-decoration-menu-decoration" });

    const articleMenuList = createElement(wrapperItemArticleLogo, "ul", { class: "wrapper__article-item-menu-hide" });
    /* Create delete article btn ... */
    const itemMenuListForDeleteBtn = createElement(articleMenuList, "li");
    const deleteBtn = createElement(itemMenuListForDeleteBtn, "button", { class: "delete-article-btn", id: el.idArticle });

    deleteBtn.addEventListener("click", async function () {
        await apiService.apiCall(`/my-articles/${this.getAttribute("id")}`, "DELETE");
        this.parentElement.parentElement.parentElement.parentElement.remove();
        skipArticles-=1;
    });
    deleteBtn.innerHTML = "Delete article";
    /* Create change params article btn */
    const itemMenuListForChangeParamsBtn = createElement(articleMenuList, "li");
    const changeParamsBtnLink = createElement(itemMenuListForChangeParamsBtn, "a", { href: `/my-articles/change-params-form/${el.idArticle}` });
    createElement(changeParamsBtnLink, "button").innerHTML = "Change params";

    const logoTheme = createElement(wrapperItemArticle, "h4", { class: "wrapper__article-theme" });
    logoTheme.innerHTML = `<strong>Theme: </strong> ${el.theme}`;

    const logoDate = createElement(wrapperItemArticle, "h6", { class: "wrapper__article-date pt-10" });
    logoDate.innerHTML = `${el.date}`;

    const link = createElement(wrapperItemArticle, "a", { href: `/user/articles/article/${el.idArticle}`, class: "read-article-link" });
    link.innerHTML = "Read";

    wrapperArticleDecorationMenuElements = document.querySelectorAll(".wrapper__article-item-decoration-menu");
}

wrapperSearchArticleInput.addEventListener("input", function (e) {
    setTimeout(async () => {
        activeThemeArticles = this.value;
        skipArticles = 0;
        
        const api = await apiService.apiCall(`/user/articles/load-articles-by-theme/?theme=${this.value}&username=${wrapperAbout.getAttribute("id")}`, "GET");
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

const apiService = new ApiService();

if(loadMoreArticles) {
    loadMoreArticles.addEventListener("click", async function () {
        
        if(!activeThemeArticles.trim()) {
            skipArticles += 5;
            const api = await apiService.apiCall(`/user/articles/load-more-articles/${skipArticles}/?&user=${wrapperAbout.getAttribute("id")}`, "GET");
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
        const api = await apiService.apiCall(`/user/articles/load-more-articles-by-theme/?theme=${activeThemeArticles}&username=${wrapperAbout.getAttribute("id")}&skip=${skipArticles}`, "GET");
        const data = await api.json();
        
        if(data.length < 5) {
            loadMoreArticles.style.display = "none";
        }
        data.forEach((el) => {
            makeNewArticles(el);
        });
    });
}

for(let i = 0; i < wrapperArticleDecorationMenuElements.length; i++) {
    wrapperArticleDecorationMenuElements[i].addEventListener("click", function () {
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

window.addEventListener("click", function (e) {
   for(let i = 0; i < wrapperArticleDecorationMenuElements.length; i++) {
       if(![...e.target.classList].find(el => el === "wrapper__article-item-decoration-menu")
           && ![...e.target.classList].find(el => el === "wrapper__article-item-decoration-menu-decoration")) {
           wrapperArticleDecorationMenuElements[i].nextElementSibling.classList.remove("wrapper__article-item-menu-show");
       }
   }
});
