export default function SearchFilters({ filters, onChange, onUseLocation }) {
    function update(field, value) {
        onChange({ ...filters, [field]: value });
    }

    return (
        <aside className="bg-white rounded-wander shadow-card p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Ville</label>
                <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    value={filters.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Paris, Lyon..."
                />
            </div>

        

            <div>
                <label className="block text-sm font-medium mb-1">Rayon (km)</label>
                <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    value={filters.radius}
                    onChange={(e) => update("radius", e.target.value)}
                />
                <button
                    type="button"
                    onClick={onUseLocation}
                    className="mt-2 text-sm text-accent underline"
                >
                    📍 Utiliser ma position
                </button>
            </div>

                  <div>
                <label className="block text-sm font-medium mb-1">Niveau de prix</label>
                <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={filters.priceLevel}
                    onChange={(e) => update("priceLevel", e.target.value)}
                >
                    <option value="">Tous</option>
                    <option value="1">$</option>
                    <option value="2">$$</option>
                    <option value="3">$$$</option>
                    <option value="4">$$$$</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Reviews minimum</label>
                <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    value={filters.minReviews}
                    onChange={(e) => update("minReviews", e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Photos minimum</label>
                <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    value={filters.minPhotos}
                    onChange={(e) => update("minPhotos", e.target.value)}
                />
            </div>

      

            <button
                type="button"
                onClick={() => onChange({ category: "", city: "", radius: "", lat: "", lon: "", minReviews: "", minPhotos: "", priceLevel: "", profile: filters.profile })}
                className="text-sm text-gray-500 underline"
            >
                Réinitialiser les filtres
            </button>
        </aside>
    );
}