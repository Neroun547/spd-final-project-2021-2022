import { ApiService } from "../../../services/api-call.service.js";
const deleteAccountBtn = document.getElementById("delete-account-btn");
const apiCallService = new ApiService();

deleteAccountBtn.addEventListener("click", () => {
   const answerUser = confirm("Are you want delete account ?");

   if(answerUser) {
       apiCallService.apiCall("/account-settings/", "DELETE");
       window.location.href = "/signup";
   }
});
