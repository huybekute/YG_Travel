import axios from "axios";

const apiModel = axios.create({
    baseURL: import.meta.env.MODEL_API_URL || 'http://127.0.0.1:8000'
});

export default apiModel;