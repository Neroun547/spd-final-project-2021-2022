export class ApiService {
    constructor(){};

    async apiCall(url, method, body, headers={"Content-Type":"application/json"}) {
        const api = await fetch(url, {
            method: method,
            headers: headers,
            body: body ? body : undefined
        });

        return api;
    }
}