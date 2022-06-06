import { ApiService } from "../../services/api-call.service.js";
const recoveryPasswordCheckEmailForm = document.querySelector(".recovery-password-check-email-form");
const wrapperMessage = document.querySelector(".wrapper__message-signup");

const apiService = new ApiService();

recoveryPasswordCheckEmailForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    wrapperMessage.style.display = "block";
    wrapperMessage.innerHTML = "Loading ...";

    try {
        const api = await apiService.apiCall("/recovery-password/check-email",
        "POST",  
        JSON.stringify({ email: e.target[0].value }) 
        );

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
