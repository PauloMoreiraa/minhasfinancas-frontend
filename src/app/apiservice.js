import axios from "axios";

const httpClient = axios.create({
    baseURL: 'http://ec2-23-22-239-117.compute-1.amazonaws.com/paulo/',
    withCredentials: true
})

class ApiService {

    constructor(apiurl){
        this.apiurl = apiurl;
    }

    static registrarToken(token){
        if(token){
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    post(url, objeto){
        const requestUrl = `${this.apiurl}${url}`;
        return httpClient.post(requestUrl, objeto);
    }

    put(url, objeto){
        const requestUrl = `${this.apiurl}${url}`;
        return httpClient.put(requestUrl, objeto);
    }

    delete(id){
        const requestUrl = `${this.apiurl}/${id}`;
        return httpClient.delete(requestUrl);
    }

    get(url){
        const requestUrl = `${this.apiurl}${url}`;
        return httpClient.get(requestUrl);
    }
}

export default ApiService;