import { ApiService } from "./services/api-call.service.js";

const form = document.getElementById("signup-form");
const wrapperMessage = document.querySelector(".wrapper__message-signup");

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = e.target[0].value;
    const username = e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;

    try {
        const apiService = new ApiService(); 
        const api = await apiService.apiCall("/signup", "POST", JSON.stringify({name, username, email, password}));

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
        
    } catch(e) {
        wrapperMessage.classList.add("bd-red");
        wrapperMessage.style.display = "block";
        wrapperMessage.innerHTML = "Error";
    }
});