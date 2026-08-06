import api from "../api/api";

export function searchAttractions(filters = {}) {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.city) params.city = filters.city;
    if (filters.priceLevel) params.price_level = filters.priceLevel;
    if (filters.minReviews) params.min_reviews = filters.minReviews;
    if (filters.minPhotos) params.min_photos = filters.minPhotos;
    if (filters.profile) params.profile = filters.profile.toLowerCase();
    if (filters.lat) params.lat = filters.lat;
    if (filters.lon) params.lon = filters.lon;
    if (filters.radius) params.radius = filters.radius;

    return api.get("/search/", { params }).then(res => res.data);
}