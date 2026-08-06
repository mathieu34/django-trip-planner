import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const csrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken="))
        ?.split("=")[1];

    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }

    // Token custom pour le module compilation (indépendant des sessions Django)
    const compilationToken = localStorage.getItem("compilation_token");
    if (compilationToken) {
        config.headers["X-Compilation-Token"] = compilationToken;
    }

    return config;
});

api.interceptors.response.use(response => {
    // Si le backend renvoie un token compilation, on le stocke
    if (response.data?.token) {
        localStorage.setItem("compilation_token", response.data.token);
    }
    return response;
});

export default api;