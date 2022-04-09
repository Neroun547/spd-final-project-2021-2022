import { ApiService } from "../../../services/api-call.service.js";
const changeParamsVideoForm = document.getElementById("change-params-private-video-form");
const wrapperMessage = document.querySelector(".wrapper__message-signup"); 
const apiService = new ApiService();

changeParamsVideoForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const idVideo = this.getAttribute("data-idVideo");

    try {
        const api = await apiService.apiCall(`/my-video/change-params-private-video/${idVideo}`, "PUT", JSON.stringify(
            { name: e.target[0].value, description: e.target[1].value })
        );

        const response = await api.json();
        
        if(!api.ok) {
            wrapperMessage.classList.remove("bd-green");
            wrapperMessage.classList.add("bd-red");
            wrapperMessage.style.display = "block";
            wrapperMessage.innerHTML = response.message;

            return;
        }

        console.log(response);
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