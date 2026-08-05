import api from "./api";

export async function getCsrfToken(){
    await api.get("/users/csrf/");
}