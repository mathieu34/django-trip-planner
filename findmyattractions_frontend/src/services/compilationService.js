import api from "../api/api";

export function getCompilation(sort = "added") {
    return api.get("/compilation/", { params: { sort } }).then(res => res.data);
}

export function addToCompilation(attractionId) {
    return api.post("/compilation/", { attraction_id: attractionId }).then(res => res.data);
}

export function removeCompilationItem(itemId) {
    return api.delete(`/compilation/${itemId}/`).then(res => res.data);
}