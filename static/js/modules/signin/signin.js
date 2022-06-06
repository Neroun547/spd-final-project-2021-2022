import { ApiService } from "../../services/api-call.service.js";

const form = document.getElementById("signin-form");
const wrapperMessage = document.querySelector(".wrapper__message-signup");

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    wrapperMessage.style.display = "block";
    wrapperMessage.innerHTML = "Loading ...";

    try {
        const apiService = new ApiService();
        const api = await apiService.apiCall("/signin", "POST", JSON.stringify({username, password}));
        const res = await api.json();
        
        if(api.status < 200 || api.status > 300) {
            wrapperMessage.classList.remove("bd-green");
            wrapperMessage.classList.add("bd-red");
            wrapperMessage.style.display = "block";
            wrapperMessage.innerHTML = res.message;
            
            return;
        } 

        wrapperMessage.classList.remove("bd-red");
        wrapperMessage.classList.add("bd-green");
        wrapperMessage.style.display = "block";
        wrapperMessage.innerHTML = res.message;
        
        document.location.reload();
    } catch(e) {
        wrapperMessage.classList.add("bd-red");
        wrapperMessage.style.display = "block";
        wrapperMessage.innerHTML = "Error";
    }
});