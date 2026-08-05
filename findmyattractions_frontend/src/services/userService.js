import api from "../api/api";

export function createProfile(data) {
    return api.post("/users/profile/", data);
}

export function getProfile() {
    return api.get("/users/me/");
}

export function logout() {
    return api.post("/users/logout/");
}