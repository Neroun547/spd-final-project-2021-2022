import { ApiService } from "../../../../services/api-call.service.js";
const newUsernameForm = document.querySelector(".new-username-form");
const wrapperMessage = document.querySelector(".wrapper__message-signup");
const apiService = new ApiService();

newUsernameForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if(e.target[0].value.match(/[a-z]/i) === null) {
        wrapperMessage.style.display = "block";
        wrapperMessage.style.borderColor = "red";
        wrapperMessage.innerHTML = "Username should contains only latin letters";

        return;
    }
    try {
        const res = await apiService.apiCall("/account-settings/new-username", "PUT", JSON.stringify({
            username: e.target[0].value
        }));
        const data = await res.json();

        wrapperMessage.style.display = "block";

        if (res.status >= 400 && res.status <= 500) {
            wrapperMessage.style.border = "1px solid red";
            wrapperMessage.innerHTML = data.message;

            return;
        }
        wrapperMessage.style.border = "1px solid green";
        wrapperMessage.innerHTML = data.message;
    } catch(e) {
        console.log(e);
        wrapperMessage.style.border = "1px solid red";
        wrapperMessage.innerHTML = "Some error ...";
    }
});
