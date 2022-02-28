import { ApiService } from "./services/api-call.service.js";

const apiService = new ApiService();  

setInterval(async () => {
    const api = await apiService.apiCall("/check-token-interval", "GET"); 
    
    if(!api.ok) {
        window.location.reload();
    } 
}, 5000);
