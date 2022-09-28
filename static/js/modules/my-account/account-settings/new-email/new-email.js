import { ApiService } from "../../../../services/api-call.service.js";
const newEmailForm = document.querySelector(".new-email-form");
const wrapperMessage = document.querySelector(".wrapper__message-signup");
const apiService = new ApiService();

newEmailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    wrapperMessage.style.display = "block";
    wrapperMessage.innerHTML = "Loading ...";
    try {
        const res = await apiService.apiCall("/account-settings/new-email", "PUT", JSON.stringify({
            email: e.target[0].value
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
    } catch {
        wrapperMessage.style.border = "1px solid red";
        wrapperMessage.innerHTML = "Some error ...";
    }
});
