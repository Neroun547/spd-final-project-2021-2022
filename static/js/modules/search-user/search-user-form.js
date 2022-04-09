import { createElement } from "../../common/createElement.js";
import { ApiService } from "../../services/api-call.service.js";

const searchUserForm = document.getElementById("search-user-form");
const findUserContainer = document.querySelector(".wrapper__find-user");
const wrapperAbout = document.querySelector(".wrapper__about");

let countUsers = 0;

searchUserForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    findUserContainer.innerHTML = "";
    const apiService = new ApiService();

    const api = await apiService.apiCall("/search-user", "POST", JSON.stringify({username:e.target[0].value}));
    const data = await api.json();
    
    if(!data.users.length){
        createElement(findUserContainer, "div", { class:"not-found-user-logo" } ).innerHTML = "User with this username not found :(";
        return;
    }

    data.users.forEach((el) => {
        
        if(!document.getElementById(el.username)){

            const link = createElement(findUserContainer, "a", { href:`/user/${el.username}`, class:"wrapper__find-user-link" });
            const wrapperUser = createElement(link, "div", { id:el.username, class:"wrapper__find-user-item" });
            
            const subWrapperUser = createElement(wrapperUser, "div", { class:"sub__wrapper-user-item" });

            if(el.idAvatar) {
                createElement(subWrapperUser, "img", { src: `/account-settings/avatar/${el.idAvatar}` });
            } else {
                createElement(subWrapperUser, "img", { src: "/img/user.png" });
            }
            
            const wrapperUserLogo = createElement(subWrapperUser, "div", { class:"wrapper__find-user-sub-item" });
            wrapperUserLogo.innerHTML = el.username;
        }
    });

    if(data.loadMore) {
        const loadMoreBtn = createElement(wrapperAbout, "button", { class: "button dark load-more-users mt-5 mb-5" });   
        loadMoreBtn.innerHTML = "Load more users";

        loadMoreBtn.addEventListener("click", async function () {
            countUsers += 5;
            const api = await apiService.apiCall("/load-more-users", "POST", JSON.stringify({skip: countUsers,username: e.target[0].value}))
            const data = await api.json();

            data.users.forEach((el) => {
        
                if(!document.getElementById(el.username)){
        
                    const link = createElement(findUserContainer, "a", { href:`/user/${el.username}`, class:"wrapper__find-user-link" });
                    const wrapperUser = createElement(link, "div", { id:el.username, class:"wrapper__find-user-item" });
                    
                    const subWrapperUser = createElement(wrapperUser, "div", { class:"sub__wrapper-user-item" } );
                    
                    if(el.idAvatar) {
                        createElement(subWrapperUser, "img", { src: `/account-settings/avatar/${el.idAvatar}` });
                    } else {
                        createElement(subWrapperUser, "img", { src: "/img/user.png" });
                    }
                    
                    const wrapperUserLogo = createElement(subWrapperUser, "div", { class:"wrapper__find-user-sub-item" });
                    wrapperUserLogo.innerHTML = el.username;
                }
            });

            if(!data.loadMore) {
                this.remove();
            }
        }); 
    }
});
