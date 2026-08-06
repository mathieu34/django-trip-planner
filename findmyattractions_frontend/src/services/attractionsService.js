import api from "../api/api";

export function getAttractions() {
    return api.get("/attractions/").then((res) => res.data.attractions);
}

export function getAttraction(id) {
    return api.get(`/attractions/${id}/`).then((res) => res.data);
}